from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from core.database import Base


class ElectricityBill(Base):
    __tablename__ = "electricity_bills"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    discom_name = Column(String(50), nullable=False)
    consumer_number = Column(String(50), nullable=False, index=True)
    meter_number = Column(String(50), nullable=True)
    billing_month = Column(String(50), default="Oct-Nov 2026")
    billing_period_days = Column(Integer, default=60)
    sanctioned_load_kw = Column(Float, default=4.0)
    units_consumed = Column(Float, nullable=False)

    # Tariff Math Breakdown
    energy_charges = Column(Float, default=0.0)
    fixed_charges = Column(Float, default=0.0)
    fpppa_charges = Column(Float, default=0.0)
    meter_rent = Column(Float, default=30.0)
    electricity_duty = Column(Float, default=0.0)
    total_amount = Column(Float, nullable=False)
    effective_rate_per_unit = Column(Float, default=0.0)
    marginal_rate = Column(Float, default=5.20)

    # Metadata
    raw_extracted_text = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="bills")

