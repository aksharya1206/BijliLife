from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field


class ChallengeOut(BaseModel):
    id: str
    title: str
    category: str
    description: str
    sparks_reward: int
    co2_kg_reward: float
    start_time: str
    end_time: str
    requires_proof: bool
    proof_type: str
    is_active: bool
    tips: Optional[str] = None
    time_remaining_seconds: Optional[int] = None
    is_completed_today: bool = False


class ChallengeVerifyRequest(BaseModel):
    challenge_id: str
    image_base64: Optional[str] = None
    detected_temperature_c: Optional[int] = None
    telemetry_notes: Optional[str] = None


class ChallengeVerifyResponse(BaseModel):
    success: bool
    challenge_id: str
    sparks_awarded: int
    co2_saved_kg: float
    kwh_shifted: float
    message: str
    society_rank_updated: bool
    new_sparks_balance: int
    celebration_message: str


class SocietyLeaderboardItem(BaseModel):
    id: int
    rank: int
    name: str
    ward: str
    city: str
    total_flats: int
    total_sparks: int
    total_kwh_shifted: float
    total_co2_kg_saved: float
    trees_equivalent: float
    avg_sparks_per_flat: float
    is_user_society: bool = False


class ResidentRankItem(BaseModel):
    rank: int
    flat_number: str
    resident_name: str
    sparks: int
    kwh_shifted: float
    co2_saved_kg: float
    is_current_user: bool = False


class SocietyLeaderboardResponse(BaseModel):
    inter_society_leagues: List[SocietyLeaderboardItem]
    my_society_internal_ranks: List[ResidentRankItem]
    user_society_name: str
    user_society_rank: int
    user_sparks_balance: int
    total_derby_sparks: int
