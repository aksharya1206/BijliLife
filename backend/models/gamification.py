from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship

from core.database import Base


class Society(Base):
    __tablename__ = "societies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False, unique=True)
    ward = Column(String(100), nullable=False)
    city = Column(String(100), nullable=False)
    total_flats = Column(Integer, default=100)
    total_sparks = Column(Integer, default=0)
    total_kwh_shifted = Column(Float, default=0.0)
    total_co2_kg_saved = Column(Float, default=0.0)
    rank = Column(Integer, default=1)

    residents = relationship("User", back_populates="society")


class Challenge(Base):
    __tablename__ = "challenges"

    id = Column(String(80), primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    category = Column(String(50), default="PEAK_SHAVING")
    description = Column(String(500), nullable=False)
    sparks_reward = Column(Integer, default=100)
    co2_kg_reward = Column(Float, default=1.0)
    start_time = Column(String(10), default="14:00")
    end_time = Column(String(10), default="17:00")
    requires_proof = Column(Boolean, default=True)
    proof_type = Column(String(50), default="AC_REMOTE_PHOTO") # AC_REMOTE_PHOTO, METER_PHOTO, APPLIANCE_OFF
    is_active = Column(Boolean, default=True)
    tips = Column(String(300), nullable=True)

    ledger_entries = relationship("SparksLedger", back_populates="challenge")


class SparksLedger(Base):
    __tablename__ = "sparks_ledger"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    challenge_id = Column(String(80), ForeignKey("challenges.id"), nullable=False)
    sparks_earned = Column(Integer, nullable=False)
    kwh_shifted = Column(Float, default=0.0)
    co2_saved_kg = Column(Float, default=0.0)
    verification_notes = Column(String(250), default="Verified via client-side thermal heuristic")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="ledger_entries")
    challenge = relationship("Challenge", back_populates="ledger_entries")


class SolarVendor(Base):
    __tablename__ = "solar_vendors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    city = Column(String(100), nullable=False)
    address = Column(String(250), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    rating = Column(Float, default=4.8)
    reviews_count = Column(Integer, default=150)
    installations_count = Column(Integer, default=300)
    phone = Column(String(50), default="+91 79 4000 1122")
    email = Column(String(100), default="support@gedasolar.gujarat.gov.in")
    geda_empanelment_id = Column(String(50), unique=True)
    is_geda_approved = Column(Boolean, default=True)
    subsidy_assistance = Column(Boolean, default=True)

    quotes = relationship("SolarQuoteRequest", back_populates="vendor")


class SolarQuoteRequest(Base):
    __tablename__ = "solar_quote_requests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    vendor_id = Column(Integer, ForeignKey("solar_vendors.id"), nullable=False)
    roof_area_sqft = Column(Float, default=400.0)
    proposed_kw = Column(Float, default=3.0)
    estimated_cost = Column(Float, default=155000.0)
    subsidy_amount = Column(Float, default=78000.0)
    net_payable = Column(Float, default=77000.0)
    consumer_notes = Column(String(300), nullable=True)
    status = Column(String(50), default="PENDING")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="quote_requests")
    vendor = relationship("SolarVendor", back_populates="quotes")
