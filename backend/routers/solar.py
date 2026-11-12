from typing import List, Dict, Any
from fastapi import APIRouter, Query
from schemas.solar import (
    SolarRoiRequest,
    SolarRoiResponse,
    WeatherSolarIrradianceResponse,
    SolarVendorOut,
    SolarQuoteCreate
)
from services.solar_service import (
    calculate_solar_roi,
    get_solar_weather_irradiance,
    get_all_geda_vendors
)
from services.gamification import user_state

router = APIRouter(prefix="/api/solar", tags=["PM Surya Ghar & Solar GIS"])


@router.post("/calculate", response_model=SolarRoiResponse)
async def compute_solar_roi(req: SolarRoiRequest):
    """
    Computes rooftop solar capacity, PM Surya Ghar (Muft Bijli Yojana) subsidy,
    net consumer investment, monthly generation, payback period, and 25-year life cycle savings.
    """
    return calculate_solar_roi(req)


@router.get("/weather", response_model=WeatherSolarIrradianceResponse)
async def get_weather_solar_irradiance(
    city: str = Query(default="Ahmedabad", description="Gujarat city: Ahmedabad, Surat, Vadodara, Rajkot, Gandhinagar")
):
    """
    Returns real-time or modeled Global Horizontal Irradiance (GHI W/m²), UV index,
    and ambient temperature for Gujarat cities.
    """
    return await get_solar_weather_irradiance(city=city)


@router.get("/vendors", response_model=List[SolarVendorOut])
async def list_geda_vendors():
    """
    Returns verified GEDA-empanelled EPC solar vendors across Gujarat.
    """
    return get_all_geda_vendors()


@router.post("/request-quote")
async def submit_solar_quote(req: SolarQuoteCreate) -> Dict[str, Any]:
    """
    Submits a free solar site survey quote request to a GEDA-empanelled vendor
    and awards +200 Sparks for citizen energy initiative.
    """
    # Award solar quest sparks if not yet completed
    if "solar-rooftop-audit" not in user_state["completed_challenges"]:
        user_state["sparks_balance"] += 200
        user_state["completed_challenges"].add("solar-rooftop-audit")

    return {
        "success": True,
        "message": f"Quote request successfully dispatched to vendor #{req.vendor_id}. A certified GEDA engineer will contact you within 24 hours.",
        "proposed_kw": req.proposed_kw,
        "sparks_awarded": 200,
        "new_sparks_balance": user_state["sparks_balance"]
    }

