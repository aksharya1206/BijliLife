from typing import List
from schemas.bill import SlabBreakdown, TariffCalculationResult
from core.config import settings


def calculate_gerc_tariff(
    units: float,
    sanctioned_load_kw: float = 4.0,
    billing_period_days: int = 60,
    discom_name: str = "UGVCL"
) -> TariffCalculationResult:
    """
    Computes GERC (Gujarat Electricity Regulatory Commission) FY26
    telescopic residential tariff structure.
    
    Slabs:
    - 0 to 50 units:   ₹3.05 / kWh
    - 51 to 100 units:  ₹3.50 / kWh
    - 101 to 250 units: ₹4.15 / kWh
    - 251+ units:       ₹5.20 / kWh
    
    Additional components:
    - Fixed charges: ₹15 / kW / month
    - Meter rent: ₹30 / billing cycle
    - FPPPA: ₹2.50 / kWh
    - Electricity duty: 15% on energy + fixed charges
    """
    units = max(0.0, float(units))
    sanctioned_load_kw = max(1.0, float(sanctioned_load_kw))
    months = max(0.5, billing_period_days / 30.0)

    # In Gujarat, bi-monthly bills standardly double the slab limits (100, 200, 500),
    # but for normalized comparison or monthly units, we scale slabs by month factor.
    slab_multiplier = months

    s1_limit = 50.0 * slab_multiplier
    s2_limit = 50.0 * slab_multiplier
    s3_limit = 150.0 * slab_multiplier

    remaining = units
    slab_breakdown: List[SlabBreakdown] = []
    energy_charges = 0.0
    marginal_rate = 3.05

    # Slab 1: 0 - 50 units (scaled)
    if remaining > 0:
        u1 = min(remaining, s1_limit)
        amt1 = round(u1 * 3.05, 2)
        energy_charges += amt1
        remaining -= u1
        marginal_rate = 3.05
        slab_breakdown.append(
            SlabBreakdown(
                slab_name="Slab 1 (Base Lifeline)",
                slab_range=f"0 - {int(s1_limit)} kWh",
                units_in_slab=round(u1, 2),
                rate_per_unit=3.05,
                amount=amt1
            )
        )

    # Slab 2: 51 - 100 units (scaled)
    if remaining > 0:
        u2 = min(remaining, s2_limit)
        amt2 = round(u2 * 3.50, 2)
        energy_charges += amt2
        remaining -= u2
        marginal_rate = 3.50
        slab_breakdown.append(
            SlabBreakdown(
                slab_name="Slab 2 (Moderate)",
                slab_range=f"{int(s1_limit) + 1} - {int(s1_limit + s2_limit)} kWh",
                units_in_slab=round(u2, 2),
                rate_per_unit=3.50,
                amount=amt2
            )
        )

    # Slab 3: 101 - 250 units (scaled)
    if remaining > 0:
        u3 = min(remaining, s3_limit)
        amt3 = round(u3 * 4.15, 2)
        energy_charges += amt3
        remaining -= u3
        marginal_rate = 4.15
        slab_breakdown.append(
            SlabBreakdown(
                slab_name="Slab 3 (Standard)",
                slab_range=f"{int(s1_limit + s2_limit) + 1} - {int(s1_limit + s2_limit + s3_limit)} kWh",
                units_in_slab=round(u3, 2),
                rate_per_unit=4.15,
                amount=amt3
            )
        )

    # Slab 4: Above 250 units (scaled)
    if remaining > 0:
        u4 = remaining
        amt4 = round(u4 * 5.20, 2)
        energy_charges += amt4
        remaining = 0
        marginal_rate = 5.20
        slab_breakdown.append(
            SlabBreakdown(
                slab_name="Slab 4 (High Consumption)",
                slab_range=f"{int(s1_limit + s2_limit + s3_limit) + 1}+ kWh",
                units_in_slab=round(u4, 2),
                rate_per_unit=5.20,
                amount=amt4
            )
        )

    # Fixed Charges: ₹15 / kW / month
    fixed_charges = round(settings.GERC_FIXED_CHARGE_PER_KW * sanctioned_load_kw * months, 2)

    # Meter Rent: ₹30 flat per bill cycle
    meter_rent = round(settings.GERC_METER_RENT * (months / 2.0 if months > 1 else 1.0), 2)

    # FPPPA (Fuel and Power Purchase Price Adjustment): ₹2.50 / kWh
    fpppa_charges = round(units * settings.GERC_FPPPA_PER_KWH, 2)

    # Electricity Duty: 15% on (energy charges + fixed charges)
    duty_base = energy_charges + fixed_charges
    electricity_duty = round(duty_base * settings.GERC_ELECTRICITY_DUTY_PCT, 2)

    # Total Bill Amount
    total_bill = round(energy_charges + fixed_charges + meter_rent + fpppa_charges + electricity_duty, 2)

    # Effective rate per unit
    effective_rate = round(total_bill / units, 2) if units > 0 else 0.0

    # Effective marginal rate: when a citizen curtails 1 kWh at their highest slab,
    # they save: slab_rate + FPPPA (₹2.50) + 15% duty on energy!
    effective_marginal_rate = round((marginal_rate * 1.15) + settings.GERC_FPPPA_PER_KWH, 2)

    # Carbon emissions: 0.716 kg CO2 / kWh
    co2_kg = round(units * settings.CEA_CO2_FACTOR_KG, 2)
    trees = round(co2_kg / 20.0, 1)

    return TariffCalculationResult(
        units=units,
        billing_period_days=billing_period_days,
        sanctioned_load_kw=sanctioned_load_kw,
        discom_name=discom_name,
        energy_charges=round(energy_charges, 2),
        fixed_charges=fixed_charges,
        fpppa_charges=fpppa_charges,
        meter_rent=meter_rent,
        electricity_duty=electricity_duty,
        total_bill=total_bill,
        effective_rate_per_unit=effective_rate,
        marginal_rate=marginal_rate,
        effective_marginal_rate=effective_marginal_rate,
        co2_kg_footprint=co2_kg,
        trees_equivalent=trees,
        slab_breakdown=slab_breakdown
    )
