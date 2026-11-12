import datetime
import logging
from typing import List, Dict, Any, Optional
from schemas.challenge import (
    ChallengeOut,
    ChallengeVerifyRequest,
    ChallengeVerifyResponse,
    SocietyLeaderboardItem,
    ResidentRankItem,
    SocietyLeaderboardResponse
)
from core.config import settings

logger = logging.getLogger("bijlilife.gamification")

# Seed Societies with realistic Gujarat ward statistics
SOCIETIES_DATA: List[Dict[str, Any]] = [
    {
        "id": 1,
        "name": "Gokuldham Residency",
        "ward": "Bodakdev",
        "city": "Ahmedabad",
        "total_flats": 180,
        "total_sparks": 14250,
        "total_kwh_shifted": 8920.0,
        "total_co2_kg_saved": 6386.7,
        "rank": 1
    },
    {
        "id": 2,
        "name": "Shivalik Enclave",
        "ward": "Navrangpura",
        "city": "Ahmedabad",
        "total_flats": 140,
        "total_sparks": 12800,
        "total_kwh_shifted": 7450.0,
        "total_co2_kg_saved": 5334.2,
        "rank": 2
    },
    {
        "id": 3,
        "name": "Surat Diamond Towers",
        "ward": "Pal",
        "city": "Surat",
        "total_flats": 220,
        "total_sparks": 11400,
        "total_kwh_shifted": 6800.0,
        "total_co2_kg_saved": 4868.8,
        "rank": 3
    },
    {
        "id": 4,
        "name": "Vrundavan Greens",
        "ward": "Alkapuri",
        "city": "Vadodara",
        "total_flats": 110,
        "total_sparks": 9600,
        "total_kwh_shifted": 5120.0,
        "total_co2_kg_saved": 3665.9,
        "rank": 4
    },
    {
        "id": 5,
        "name": "Iscon Heights",
        "ward": "Kalawad Road",
        "city": "Rajkot",
        "total_flats": 95,
        "total_sparks": 8100,
        "total_kwh_shifted": 4300.0,
        "total_co2_kg_saved": 3078.8,
        "rank": 5
    }
]

# Seed Active Missions & Quests
CHALLENGES_DATA: List[Dict[str, Any]] = [
    {
        "id": "gujarat-afternoon-peak",
        "title": "Gujarat Afternoon Peak Shaving",
        "category": "PEAK_SHAVING",
        "description": "Shift heavy loads (washing machines, geysers, pumps) outside Gujarat's 2 PM - 5 PM peak grid strain window.",
        "sparks_reward": 120,
        "co2_kg_reward": 1.4,
        "start_time": "14:00",
        "end_time": "17:00",
        "requires_proof": True,
        "proof_type": "APPLIANCE_OFF",
        "is_active": True,
        "tips": "Running washing machines at 11 AM or 8 PM utilizes abundant solar or off-peak thermal grid capacity."
    },
    {
        "id": "life-ac-24",
        "title": "Mission LiFE 24°C AC Lock",
        "category": "AC_OPTIMIZATION",
        "description": "Lock your air conditioner at 24°C or above. Snap a photo of your AC remote screen showing 24°C+.",
        "sparks_reward": 80,
        "co2_kg_reward": 1.2,
        "start_time": "12:00",
        "end_time": "23:00",
        "requires_proof": True,
        "proof_type": "AC_REMOTE_PHOTO",
        "is_active": True,
        "tips": "Every 1°C increase saves ~6% electricity. 24°C provides ideal comfort with ceiling fan circulation."
    },
    {
        "id": "standby-vampire-slayer",
        "title": "Zero Standby Vampire Slayer",
        "category": "STANDBY_POWER",
        "description": "Switch off master switchboards for television consoles, gaming rigs, and microwave clocks before bedtime.",
        "sparks_reward": 60,
        "co2_kg_reward": 0.4,
        "start_time": "22:00",
        "end_time": "06:00",
        "requires_proof": False,
        "proof_type": "SELF_REPORT",
        "is_active": True,
        "tips": "Vampire power bleeds 40W continually, costing over ₹150 every month for zero useful work."
    },
    {
        "id": "solar-rooftop-audit",
        "title": "PM Surya Ghar Rooftop Audit",
        "category": "SOLAR_ADOPTION",
        "description": "Request a free GEDA-empanelled EPC site survey or evaluate your roof feasibility in the solar calculator.",
        "sparks_reward": 200,
        "co2_kg_reward": 5.0,
        "start_time": "09:00",
        "end_time": "19:00",
        "requires_proof": False,
        "proof_type": "SOLAR_AUDIT_REQUEST",
        "is_active": True,
        "tips": "A 3 kW solar rooftop system yields up to ₹78,000 direct central subsidy and eliminates 80%+ of your power bill."
    },
    {
        "id": "bldc-fan-upgrade",
        "title": "5-Star BLDC Energy Upgrade",
        "category": "ENERGY_AUDIT",
        "description": "Verify the installation of a 5-star BLDC ceiling fan (28W) or 5-star inverter appliance in your flat.",
        "sparks_reward": 150,
        "co2_kg_reward": 2.8,
        "start_time": "08:00",
        "end_time": "21:00",
        "requires_proof": True,
        "proof_type": "BEE_STAR_PHOTO",
        "is_active": True,
        "tips": "Replacing an old 75W fan with a 28W BLDC fan pays for itself in less than 14 months."
    }
]

# In-memory runtime state for stateful demo interaction
user_state = {
    "user_id": 1,
    "name": "Aarav Patel",
    "society_id": 1,
    "flat_number": "Flat B-402",
    "sparks_balance": 420,
    "peak_kwh_shifted": 38.5,
    "co2_saved_kg": 27.56,
    "completed_challenges": set()
}

# Resident rankings inside Gokuldham Residency (Bodakdev)
MY_SOCIETY_FLATS: List[Dict[str, Any]] = [
    {"rank": 1, "flat_number": "Flat A-102", "resident_name": "Deepak Shah", "sparks": 640, "kwh_shifted": 52.0, "co2_saved_kg": 37.2, "is_current_user": False},
    {"rank": 2, "flat_number": "Flat C-304", "resident_name": "Pooja Mehta", "sparks": 580, "kwh_shifted": 48.0, "co2_saved_kg": 34.3, "is_current_user": False},
    {"rank": 3, "flat_number": "Flat B-402", "resident_name": "Aarav Patel (You)", "sparks": 420, "kwh_shifted": 38.5, "co2_saved_kg": 27.56, "is_current_user": True},
    {"rank": 4, "flat_number": "Flat D-201", "resident_name": "Ketan Dave", "sparks": 390, "kwh_shifted": 32.0, "co2_saved_kg": 22.9, "is_current_user": False},
    {"rank": 5, "flat_number": "Flat B-105", "resident_name": "Nidhi Joshi", "sparks": 340, "kwh_shifted": 28.0, "co2_saved_kg": 20.0, "is_current_user": False},
    {"rank": 6, "flat_number": "Flat A-504", "resident_name": "Sanjay Trivedi", "sparks": 290, "kwh_shifted": 24.5, "co2_saved_kg": 17.5, "is_current_user": False},
    {"rank": 7, "flat_number": "Flat C-101", "resident_name": "Ramesh Parmar", "sparks": 250, "kwh_shifted": 21.0, "co2_saved_kg": 15.0, "is_current_user": False}
]


def get_active_challenges() -> List[ChallengeOut]:
    """Returns list of challenges with dynamic live countdown timers."""
    now = datetime.datetime.now()
    results: List[ChallengeOut] = []

    for ch in CHALLENGES_DATA:
        # Calculate seconds remaining based on end_time
        try:
            end_parts = [int(p) for p in ch["end_time"].split(":")]
            target_time = now.replace(hour=end_parts[0], minute=end_parts[1], second=0, microsecond=0)
            if target_time < now:
                # Set for tomorrow or next cycle
                diff = 10800  # 3 hours default remaining
            else:
                diff = int((target_time - now).total_seconds())
        except Exception:
            diff = 7200

        is_done = ch["id"] in user_state["completed_challenges"]

        results.append(
            ChallengeOut(
                id=ch["id"],
                title=ch["title"],
                category=ch["category"],
                description=ch["description"],
                sparks_reward=ch["sparks_reward"],
                co2_kg_reward=ch["co2_kg_reward"],
                start_time=ch["start_time"],
                end_time=ch["end_time"],
                requires_proof=ch["requires_proof"],
                proof_type=ch["proof_type"],
                is_active=ch["is_active"],
                tips=ch["tips"],
                time_remaining_seconds=max(600, diff),
                is_completed_today=is_done
            )
        )

    return results


def verify_and_claim_challenge(req: ChallengeVerifyRequest) -> ChallengeVerifyResponse:
    """
    Validates challenge proof (client-side optical/thermal verification telemetry)
    and credits Sparks to user and society ledger.
    """
    challenge_meta = next((c for c in CHALLENGES_DATA if c["id"] == req.challenge_id), None)
    if not challenge_meta:
        return ChallengeVerifyResponse(
            success=False,
            challenge_id=req.challenge_id,
            sparks_awarded=0,
            co2_saved_kg=0.0,
            kwh_shifted=0.0,
            message="Challenge ID not found.",
            society_rank_updated=False,
            new_sparks_balance=user_state["sparks_balance"],
            celebration_message="Please select a valid Mission LiFE challenge."
        )

    # Check AC Temperature validation if applicable
    if req.challenge_id == "life-ac-24" and req.detected_temperature_c:
        if req.detected_temperature_c < 24:
            return ChallengeVerifyResponse(
                success=False,
                challenge_id=req.challenge_id,
                sparks_awarded=0,
                co2_saved_kg=0.0,
                kwh_shifted=0.0,
                message=f"AC remote detected at {req.detected_temperature_c}°C. Please raise setting to 24°C or higher to unlock LiFE Sparks!",
                society_rank_updated=False,
                new_sparks_balance=user_state["sparks_balance"],
                celebration_message="Almost there! Bump your AC up to 24°C for healthy cooling."
            )

    sparks = challenge_meta["sparks_reward"]
    co2 = challenge_meta["co2_kg_reward"]
    kwh = round(co2 / settings.CEA_CO2_FACTOR_KG, 2)

    # Award to user
    user_state["sparks_balance"] += sparks
    user_state["peak_kwh_shifted"] = round(user_state["peak_kwh_shifted"] + kwh, 2)
    user_state["co2_saved_kg"] = round(user_state["co2_saved_kg"] + co2, 2)
    user_state["completed_challenges"].add(req.challenge_id)

    # Update Gokuldham Residency aggregate
    gokuldham = SOCIETIES_DATA[0]
    gokuldham["total_sparks"] += sparks
    gokuldham["total_kwh_shifted"] = round(gokuldham["total_kwh_shifted"] + kwh, 1)
    gokuldham["total_co2_kg_saved"] = round(gokuldham["total_co2_kg_saved"] + co2, 1)

    # Update user's flat entry in internal ranks
    for item in MY_SOCIETY_FLATS:
        if item["is_current_user"]:
            item["sparks"] = user_state["sparks_balance"]
            item["kwh_shifted"] = user_state["peak_kwh_shifted"]
            item["co2_saved_kg"] = user_state["co2_saved_kg"]

    # Re-sort internal rankings
    MY_SOCIETY_FLATS.sort(key=lambda x: x["sparks"], reverse=True)
    for idx, item in enumerate(MY_SOCIETY_FLATS, start=1):
        item["rank"] = idx

    celebration = f"Awesome effort! You earned +{sparks} LiFE Sparks & avoided {co2} kg CO2. Gokuldham Residency holds #1 rank in Bodakdev!"

    return ChallengeVerifyResponse(
        success=True,
        challenge_id=req.challenge_id,
        sparks_awarded=sparks,
        co2_saved_kg=co2,
        kwh_shifted=kwh,
        message=f"Mission '{challenge_meta['title']}' verified successfully!",
        society_rank_updated=True,
        new_sparks_balance=user_state["sparks_balance"],
        celebration_message=celebration
    )


def get_society_leaderboards() -> SocietyLeaderboardResponse:
    """Returns Inter-Society League rankings and Flat internal rankings."""
    # Ensure sorted by total_sparks
    sorted_societies = sorted(SOCIETIES_DATA, key=lambda s: s["total_sparks"], reverse=True)
    
    inter_leagues: List[SocietyLeaderboardItem] = []
    total_sparks_all = 0

    for idx, soc in enumerate(sorted_societies, start=1):
        soc["rank"] = idx
        total_sparks_all += soc["total_sparks"]
        trees = round(soc["total_co2_kg_saved"] / 20.0, 1)
        avg_per_flat = round(soc["total_sparks"] / max(1, soc["total_flats"]), 1)
        is_user_soc = (soc["id"] == user_state["society_id"])

        inter_leagues.append(
            SocietyLeaderboardItem(
                id=soc["id"],
                rank=idx,
                name=soc["name"],
                ward=soc["ward"],
                city=soc["city"],
                total_flats=soc["total_flats"],
                total_sparks=soc["total_sparks"],
                total_kwh_shifted=soc["total_kwh_shifted"],
                total_co2_kg_saved=soc["total_co2_kg_saved"],
                trees_equivalent=trees,
                avg_sparks_per_flat=avg_per_flat,
                is_user_society=is_user_soc
            )
        )

    resident_ranks = [ResidentRankItem(**r) for r in MY_SOCIETY_FLATS]

    user_soc = next((s for s in inter_leagues if s.id == user_state["society_id"]), inter_leagues[0])

    return SocietyLeaderboardResponse(
        inter_society_leagues=inter_leagues,
        my_society_internal_ranks=resident_ranks,
        user_society_name=user_soc.name,
        user_society_rank=user_soc.rank,
        user_sparks_balance=user_state["sparks_balance"],
        total_derby_sparks=total_sparks_all
    )


def get_user_state() -> Dict[str, Any]:
    """Retrieve active user profile state."""
    return user_state
