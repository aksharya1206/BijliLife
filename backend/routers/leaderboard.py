from typing import Dict, Any
from fastapi import APIRouter
from schemas.challenge import SocietyLeaderboardResponse
from services.gamification import (
    get_society_leaderboards,
    SOCIETIES_DATA,
    user_state
)

router = APIRouter(prefix="/api/leaderboard", tags=["Society Leaderboards & Leagues"])


@router.get("", response_model=SocietyLeaderboardResponse)
async def get_leaderboard_data():
    """
    Returns Inter-Society Derby rankings (Navrangpura vs Bodakdev vs Pal vs Alkapuri)
    and flat-level internal rankings within the user's society.
    """
    return get_society_leaderboards()


@router.post("/cheer/{society_id}")
async def cheer_society(society_id: int) -> Dict[str, Any]:
    """
    Cheer for your society in the Derby to boost social engagement and award +10 Sparks!
    """
    soc = next((s for s in SOCIETIES_DATA if s["id"] == society_id), None)
    if not soc:
        return {"success": False, "message": "Society not found."}

    soc["total_sparks"] += 10
    user_state["sparks_balance"] += 10

    return {
        "success": True,
        "message": f"Cheered for {soc['name']}! +10 Sparks awarded to you and your society.",
        "new_sparks_balance": user_state["sparks_balance"],
        "society_total_sparks": soc["total_sparks"]
    }

