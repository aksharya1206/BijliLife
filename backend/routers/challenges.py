from typing import List, Dict, Any
from fastapi import APIRouter
from schemas.challenge import (
    ChallengeOut,
    ChallengeVerifyRequest,
    ChallengeVerifyResponse
)
from services.gamification import (
    get_active_challenges,
    verify_and_claim_challenge,
    get_user_state
)

router = APIRouter(prefix="/api/challenges", tags=["Gamification & Flash Quests"])


@router.get("", response_model=List[ChallengeOut])
async def get_challenges():
    """
    List active Mission LiFE challenges (e.g. Gujarat Afternoon Peak Shaving,
    LiFE 24°C AC Lock, Zero Standby Slayer) with countdown timers.
    """
    return get_active_challenges()


@router.post("/verify", response_model=ChallengeVerifyResponse)
async def verify_challenge(req: ChallengeVerifyRequest):
    """
    Verify challenge completion (with client canvas/camera proof)
    and award LiFE Sparks to user and society leaderboard.
    """
    return verify_and_claim_challenge(req)


@router.get("/user-profile")
async def get_active_user_profile() -> Dict[str, Any]:
    """
    Get active user gamification profile, sparks balance, and society info.
    """
    state = get_user_state()
    return {
        "user_id": state["user_id"],
        "name": state["name"],
        "flat_number": state["flat_number"],
        "society_name": "Gokuldham Residency (Bodakdev)",
        "sparks_balance": state["sparks_balance"],
        "peak_kwh_shifted": state["peak_kwh_shifted"],
        "co2_saved_kg": state["co2_saved_kg"],
        "completed_count": len(state["completed_challenges"])
    }
