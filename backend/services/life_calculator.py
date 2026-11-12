from typing import List
from schemas.bill import ApplianceBurnRate, AcOptimizationResponse
from core.config import settings


def get_appliance_burn_rates(marginal_rate: float = 5.20) -> List[ApplianceBurnRate]:
    """
    Computes real-time hourly burn rates for common home appliances
    factoring effective marginal rate (marginal slab + FPPPA + duty).
    """
    # Effective rate considering FPPPA (₹2.50) + 15% duty
    effective_rate = (marginal_rate * 1.15) + settings.GERC_FPPPA_PER_KWH

    appliances = [
        {
            "appliance_id": "ac_18",
            "name": "1.5 Ton Split AC (Chilled 18°C)",
            "category": "Cooling",
            "power_watts": 1800.0,
            "power_kw": 1.80,
            "is_life_optimized": False,
            "life_alternative": "Set AC to 24°C Mission LiFE standard to drop to 1.1 kW",
            "hourly_savings_rupees": round((1.80 - 1.10) * effective_rate, 2),
            "description": "Continuous compressor strain; draws maximum current under Gujarat summer heat."
        },
        {
            "appliance_id": "ac_24",
            "name": "1.5 Ton Split AC (LiFE Mode 24°C)",
            "category": "Cooling",
            "power_watts": 1100.0,
            "power_kw": 1.10,
            "is_life_optimized": True,
            "life_alternative": None,
            "hourly_savings_rupees": 0.0,
            "description": "Recommended by Bureau of Energy Efficiency (BEE) & Mission LiFE. Saves ~39% power."
        },
        {
            "appliance_id": "water_geyser",
            "name": "Storage Water Geyser (25L)",
            "category": "Heating",
            "power_watts": 2000.0,
            "power_kw": 2.00,
            "is_life_optimized": False,
            "life_alternative": "Use 15-minute timer switch or Solar Water Heater",
            "hourly_savings_rupees": round(2.00 * effective_rate, 2),
            "description": "One of the heaviest residential loads. Keeping it on standby cycles heat repeatedly."
        },
        {
            "appliance_id": "ceiling_fan_standard",
            "name": "Conventional Induction Ceiling Fan",
            "category": "Ventilation",
            "power_watts": 75.0,
            "power_kw": 0.075,
            "is_life_optimized": False,
            "life_alternative": "Upgrade to 5-Star BLDC Fan (28W) - saves 63%",
            "hourly_savings_rupees": round((0.075 - 0.028) * effective_rate, 2),
            "description": "Runs 12-16 hours/day. Standard copper coil capacitor fan wastes energy as heat."
        },
        {
            "appliance_id": "ceiling_fan_bldc",
            "name": "5-Star BLDC Ceiling Fan",
            "category": "Ventilation",
            "power_watts": 28.0,
            "power_kw": 0.028,
            "is_life_optimized": True,
            "life_alternative": None,
            "hourly_savings_rupees": 0.0,
            "description": "Brushless DC motor with 63% lower power draw; runs cool and quiet."
        },
        {
            "appliance_id": "induction_cooktop",
            "name": "Induction Cooktop (Boil/Fry)",
            "category": "Cooking",
            "power_watts": 1500.0,
            "power_kw": 1.50,
            "is_life_optimized": True,
            "life_alternative": None,
            "hourly_savings_rupees": 0.0,
            "description": "Direct electromagnetic pan heating with 84% thermal efficiency vs 40% for LPG gas."
        },
        {
            "appliance_id": "refrigerator_frost_free",
            "name": "Double Door Refrigerator (350L)",
            "category": "Refrigeration",
            "power_watts": 250.0,
            "power_kw": 0.25,
            "is_life_optimized": True,
            "life_alternative": None,
            "hourly_savings_rupees": 0.0,
            "description": "Smart inverter compressor duty cycle averages 0.25 kW under normal door openings."
        },
        {
            "appliance_id": "vampire_standby",
            "name": "Vampire Standby Power (Set-top, Chargers)",
            "category": "Standby Bleed",
            "power_watts": 40.0,
            "power_kw": 0.040,
            "is_life_optimized": False,
            "life_alternative": "Switch off master plug before sleep - saves ₹150+/month",
            "hourly_savings_rupees": round(0.040 * effective_rate, 2),
            "description": "Phantom power drawn by TV standby lights, set-top boxes, and idle microwave clocks 24/7."
        }
    ]

    result: List[ApplianceBurnRate] = []
    for app in appliances:
        kw = app["power_kw"]
        hourly_cost = round(kw * effective_rate, 2)
        hourly_co2 = round(kw * settings.CEA_CO2_FACTOR_KG, 3)

        result.append(
            ApplianceBurnRate(
                appliance_id=app["appliance_id"],
                name=app["name"],
                category=app["category"],
                power_watts=app["power_watts"],
                power_kw=kw,
                hourly_cost_rupees=hourly_cost,
                is_life_optimized=app["is_life_optimized"],
                life_alternative=app["life_alternative"],
                hourly_savings_rupees=app["hourly_savings_rupees"],
                hourly_co2_kg=hourly_co2,
                description=app["description"]
            )
        )

    return result


def calculate_ac_savings(
    temperature_c: int = 24,
    daily_hours: float = 8.0,
    days_per_month: int = 30,
    marginal_rate: float = 5.20
) -> AcOptimizationResponse:
    """
    Computes dynamic Rupee & CO2 savings when adjusting AC temperature
    from 16°C up to 28°C compared to 18°C baseline.
    
    Formula: Power(T) = 1.80 * (1 - 0.065 * (T - 18))
    """
    temperature_c = max(16, min(28, int(temperature_c)))
    effective_rate = (marginal_rate * 1.15) + settings.GERC_FPPPA_PER_KWH

    # 18°C Baseline
    baseline_power = 1.80
    baseline_monthly_kwh = baseline_power * daily_hours * days_per_month
    baseline_monthly_cost = baseline_monthly_kwh * effective_rate

    # Calculated Power at chosen temperature
    # Each degree above 18°C reduces power draw by ~6.5%
    power_reduction_pct = 0.065 * (temperature_c - 18)
    current_power = max(0.65, round(baseline_power * (1.0 - power_reduction_pct), 3))

    hourly_cost = round(current_power * effective_rate, 2)
    monthly_kwh = round(current_power * daily_hours * days_per_month, 2)
    monthly_cost = round(monthly_kwh * effective_rate, 2)

    monthly_savings = max(0.0, round(baseline_monthly_cost - monthly_cost, 2))
    monthly_kwh_saved = max(0.0, round(baseline_monthly_kwh - monthly_kwh, 2))
    monthly_co2_saved = round(monthly_kwh_saved * settings.CEA_CO2_FACTOR_KG, 2)
    trees = round((monthly_co2_saved * 12) / 20.0, 1) # annual equivalent
    pct_savings = round(((baseline_power - current_power) / baseline_power) * 100.0, 1)

    if temperature_c >= 26:
        status = "SUPER_EFFICIENT"
        rec = "Outstanding green champion! Running at 26°C+ with a ceiling fan delivers maximum comfort and lowest thermal load."
    elif temperature_c >= 24:
        status = "MISSION_LIFE_OPTIMAL"
        rec = "Perfect Mission LiFE default! 24°C strikes the ideal thermal equilibrium for the human body while reducing cooling bills by ~39%."
    else:
        status = "HIGH_CONSUMPTION"
        rec = f"Setting AC to {temperature_c}°C forces the compressor to run 100% duty cycle. Bump to 24°C to save ₹{monthly_savings:.0f}/month!"

    return AcOptimizationResponse(
        temperature_c=temperature_c,
        power_kw=current_power,
        hourly_cost_rupees=hourly_cost,
        monthly_cost_rupees=monthly_cost,
        baseline_temp_c=18,
        baseline_power_kw=baseline_power,
        monthly_savings_rupees=monthly_savings,
        monthly_units_saved_kwh=monthly_kwh_saved,
        monthly_co2_kg_saved=monthly_co2_saved,
        trees_equivalent_annual=trees,
        percentage_savings=pct_savings,
        life_status=status,
        recommendation=rec
    )
