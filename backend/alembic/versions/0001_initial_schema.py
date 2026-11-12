"""0001 initial schema for BijliLiFE

Revision ID: 0001_initial_schema
Revises: 
Create Date: 2026-11-12 11:30:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '0001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Societies
    op.create_table(
        'societies',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=150), nullable=False),
        sa.Column('ward', sa.String(length=100), nullable=False),
        sa.Column('city', sa.String(length=100), nullable=False),
        sa.Column('total_flats', sa.Integer(), nullable=True, default=100),
        sa.Column('total_sparks', sa.Integer(), nullable=True, default=0),
        sa.Column('total_kwh_shifted', sa.Float(), nullable=True, default=0.0),
        sa.Column('total_co2_kg_saved', sa.Float(), nullable=True, default=0.0),
        sa.Column('rank', sa.Integer(), nullable=True, default=1),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name')
    )

    # Users
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('full_name', sa.String(length=120), nullable=False),
        sa.Column('email', sa.String(length=120), nullable=True),
        sa.Column('phone', sa.String(length=20), nullable=True),
        sa.Column('discom_name', sa.String(length=50), nullable=False),
        sa.Column('consumer_number', sa.String(length=30), nullable=True),
        sa.Column('flat_number', sa.String(length=50), nullable=True),
        sa.Column('sanctioned_load_kw', sa.Float(), nullable=True),
        sa.Column('sparks_balance', sa.Integer(), nullable=True),
        sa.Column('peak_kwh_shifted', sa.Float(), nullable=True),
        sa.Column('co2_saved_kg', sa.Float(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('society_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['society_id'], ['societies.id']),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )

    # Bills
    op.create_table(
        'electricity_bills',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('discom_name', sa.String(length=50), nullable=False),
        sa.Column('consumer_number', sa.String(length=50), nullable=False),
        sa.Column('meter_number', sa.String(length=50), nullable=True),
        sa.Column('billing_month', sa.String(length=50), nullable=True),
        sa.Column('billing_period_days', sa.Integer(), nullable=True),
        sa.Column('sanctioned_load_kw', sa.Float(), nullable=True),
        sa.Column('units_consumed', sa.Float(), nullable=False),
        sa.Column('energy_charges', sa.Float(), nullable=True),
        sa.Column('fixed_charges', sa.Float(), nullable=True),
        sa.Column('fpppa_charges', sa.Float(), nullable=True),
        sa.Column('meter_rent', sa.Float(), nullable=True),
        sa.Column('electricity_duty', sa.Float(), nullable=True),
        sa.Column('total_amount', sa.Float(), nullable=False),
        sa.Column('effective_rate_per_unit', sa.Float(), nullable=True),
        sa.Column('marginal_rate', sa.Float(), nullable=True),
        sa.Column('raw_extracted_text', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id')
    )

    # Challenges
    op.create_table(
        'challenges',
        sa.Column('id', sa.String(length=80), nullable=False),
        sa.Column('title', sa.String(length=150), nullable=False),
        sa.Column('category', sa.String(length=50), nullable=True),
        sa.Column('description', sa.String(length=500), nullable=False),
        sa.Column('sparks_reward', sa.Integer(), nullable=True),
        sa.Column('co2_kg_reward', sa.Float(), nullable=True),
        sa.Column('start_time', sa.String(length=10), nullable=True),
        sa.Column('end_time', sa.String(length=10), nullable=True),
        sa.Column('requires_proof', sa.Boolean(), nullable=True),
        sa.Column('proof_type', sa.String(length=50), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('tips', sa.String(length=300), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

    # Sparks Ledger
    op.create_table(
        'sparks_ledger',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('challenge_id', sa.String(length=80), nullable=False),
        sa.Column('sparks_earned', sa.Integer(), nullable=False),
        sa.Column('kwh_shifted', sa.Float(), nullable=True),
        sa.Column('co2_saved_kg', sa.Float(), nullable=True),
        sa.Column('verification_notes', sa.String(length=250), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['challenge_id'], ['challenges.id']),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id')
    )

    # Solar Vendors
    op.create_table(
        'solar_vendors',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=150), nullable=False),
        sa.Column('city', sa.String(length=100), nullable=False),
        sa.Column('address', sa.String(length=250), nullable=False),
        sa.Column('latitude', sa.Float(), nullable=False),
        sa.Column('longitude', sa.Float(), nullable=False),
        sa.Column('rating', sa.Float(), nullable=True),
        sa.Column('reviews_count', sa.Integer(), nullable=True),
        sa.Column('installations_count', sa.Integer(), nullable=True),
        sa.Column('phone', sa.String(length=50), nullable=True),
        sa.Column('email', sa.String(length=100), nullable=True),
        sa.Column('geda_empanelment_id', sa.String(length=50), nullable=True),
        sa.Column('is_geda_approved', sa.Boolean(), nullable=True),
        sa.Column('subsidy_assistance', sa.Boolean(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('geda_empanelment_id')
    )

    # Solar Quotes
    op.create_table(
        'solar_quote_requests',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('vendor_id', sa.Integer(), nullable=False),
        sa.Column('roof_area_sqft', sa.Float(), nullable=True),
        sa.Column('proposed_kw', sa.Float(), nullable=True),
        sa.Column('estimated_cost', sa.Float(), nullable=True),
        sa.Column('subsidy_amount', sa.Float(), nullable=True),
        sa.Column('net_payable', sa.Float(), nullable=True),
        sa.Column('consumer_notes', sa.String(length=300), nullable=True),
        sa.Column('status', sa.String(length=50), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.ForeignKeyConstraint(['vendor_id'], ['solar_vendors.id']),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    op.drop_table('solar_quote_requests')
    op.drop_table('solar_vendors')
    op.drop_table('sparks_ledger')
    op.drop_table('challenges')
    op.drop_table('electricity_bills')
    op.drop_table('users')
    op.drop_table('societies')
