from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(120), nullable=False, default="Aarav Patel")
    email = Column(String(120), unique=True, index=True, default="aarav.patel@gujarat.life.gov.in")
    phone = Column(String(20), default="+91 98250 12345")
    discom_name = Column(String(50), nullable=False, default="UGVCL")
    consumer_number = Column(String(30), index=True, default="21098765432")
    flat_number = Column(String(50), default="Flat B-402")
    sanctioned_load_kw = Column(Float, default=4.0)
    sparks_balance = Column(Integer, default=420)
    peak_kwh_shifted = Column(Float, default=38.5)
    co2_saved_kg = Column(Float, default=27.56)
    created_at = Column(DateTime, default=datetime.utcnow)

    society_id = Column(Integer, ForeignKey("societies.id"), nullable=True)
    society = relationship("Society", back_populates="residents")
    bills = relationship("ElectricityBill", back_populates="user", cascade="all, delete-orphan")
    ledger_entries = relationship("SparksLedger", back_populates="user", cascade="all, delete-orphan")
    quote_requests = relationship("SolarQuoteRequest", back_populates="user", cascade="all, delete-orphan")
