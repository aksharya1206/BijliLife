from typing import List, Optional
from pydantic import BaseModel, Field


class YearlyFinancialProjection(BaseModel):
    year: int
    cost_without_solar: float
    cost_with_solar: float
    net_cumulative_savings: float
    solar_generation_kwh: float


class SolarRoiRequest(BaseModel):
    roof_area_sqft: float = Field(default=400.0, ge=100.0, le=10000.0)
    monthly_units_consumed: float = Field(default=350.0, gt=0)
    sanctioned_load_kw: float = Field(default=4.0, gt=0)
    discom_name: str = Field(default="UGVCL")
    city: str = Field(default="Ahmedabad")


class SolarRoiResponse(BaseModel):
    city: str
    recommended_kw: float
    min_roof_area_sqft: float
    selected_roof_area_sqft: float
    annual_generation_kwh: float
    monthly_generation_kwh: float
    daily_generation_kwh: float
    gross_system_cost: float
    pm_surya_ghar_subsidy: float
    net_consumer_investment: float
    monthly_grid_savings: float
    monthly_surplus_revenue: float
    total_monthly_benefit: float
    annual_savings: float
    payback_years: float
    twenty_five_year_savings: float
    lifetime_co2_offset_tonnes: float
    equivalent_trees_planted: int
    projections: List[YearlyFinancialProjection]


class WeatherSolarIrradianceResponse(BaseModel):
    city: str
    latitude: float
    longitude: float
    ghi_irradiance_wm2: float
    uv_index: float
    ambient_temp_c: float
    weather_condition: str
    solar_yield_rating: str
    estimated_today_generation_per_kw: float
    source: str


class SolarVendorOut(BaseModel):
    id: int
    name: str
    city: str
    address: str
    latitude: float
    longitude: float
    rating: float
    reviews_count: int
    installations_count: int
    phone: str
    email: str
    geda_empanelment_id: str
    is_geda_approved: bool
    subsidy_assistance: bool


class SolarQuoteCreate(BaseModel):
    vendor_id: int
    roof_area_sqft: float
    proposed_kw: float
    consumer_notes: Optional[str] = None
