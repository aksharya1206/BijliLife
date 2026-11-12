from typing import List, Optional
from pydantic import BaseModel, Field


class SlabBreakdown(BaseModel):
    slab_name: str
    slab_range: str
    units_in_slab: float
    rate_per_unit: float
    amount: float


class TariffCalculationResult(BaseModel):
    units: float
    billing_period_days: int
    sanctioned_load_kw: float
    discom_name: str
    energy_charges: float
    fixed_charges: float
    fpppa_charges: float
    meter_rent: float
    electricity_duty: float
    total_bill: float
    effective_rate_per_unit: float
    marginal_rate: float
    effective_marginal_rate: float
    co2_kg_footprint: float
    trees_equivalent: float
    slab_breakdown: List[SlabBreakdown]


class BillParseResponse(BaseModel):
    success: bool
    discom_name: str
    consumer_number: str
    customer_name: Optional[str] = "Gujarat Resident"
    sanctioned_load_kw: float
    billing_period_days: int
    units_consumed: float
    meter_number: Optional[str] = None
    bill_date: Optional[str] = None
    due_date: Optional[str] = None
    extracted_amount: Optional[float] = None
    tariff_calculation: TariffCalculationResult
    raw_snippet: Optional[str] = None


class BillCalculateRequest(BaseModel):
    units_consumed: float = Field(..., gt=0, description="Total units consumed in kWh")
    sanctioned_load_kw: float = Field(default=4.0, gt=0, description="Sanctioned load in kW")
    billing_period_days: int = Field(default=60, gt=0, description="Billing cycle days (e.g. 60 for bi-monthly)")
    discom_name: str = Field(default="UGVCL", description="PGVCL, UGVCL, DGVCL, MGVCL, or Torrent Power")


class ApplianceBurnRate(BaseModel):
    appliance_id: str
    name: str
    category: str
    power_watts: float
    power_kw: float
    hourly_cost_rupees: float
    is_life_optimized: bool
    life_alternative: Optional[str] = None
    hourly_savings_rupees: float = 0.0
    hourly_co2_kg: float
    description: str


class AcOptimizationRequest(BaseModel):
    temperature_c: int = Field(default=24, ge=16, le=28)
    daily_hours: float = Field(default=8.0, ge=1.0, le=24.0)
    days_per_month: int = Field(default=30, ge=1, le=31)
    marginal_rate: float = Field(default=5.20, gt=0)


class AcOptimizationResponse(BaseModel):
    temperature_c: int
    power_kw: float
    hourly_cost_rupees: float
    monthly_cost_rupees: float
    baseline_temp_c: int = 18
    baseline_power_kw: float = 1.80
    monthly_savings_rupees: float
    monthly_units_saved_kwh: float
    monthly_co2_kg_saved: float
    trees_equivalent_annual: float
    percentage_savings: float
    life_status: str # "SUPER_EFFICIENT", "MISSION_LIFE_OPTIMAL", "HIGH_CONSUMPTION"
    recommendation: str

