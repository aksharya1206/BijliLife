from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "BijliLiFE Citizen Energy Platform"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./bijlilife.db"

    # OpenWeather API Key for solar irradiance & weather modeling
    OPENWEATHER_API_KEY: str = ""

    # GERC Tariff FY26 Default Constants
    GERC_FIXED_CHARGE_PER_KW: float = 15.0  # ₹15 per kW sanctioned load per month
    GERC_METER_RENT: float = 30.0           # ₹30 per billing cycle
    GERC_FPPPA_PER_KWH: float = 2.50        # ₹2.50 per kWh
    GERC_ELECTRICITY_DUTY_PCT: float = 0.15 # 15% duty on consumption charges
    GUVNL_SOLAR_EXPORT_RATE: float = 2.25   # ₹2.25/unit surplus buyback
    CEA_CO2_FACTOR_KG: float = 0.716        # 0.716 kg CO2 per kWh grid average (CEA India)

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, list):
            return v
        return [
            "http://localhost:5173",
            "http://localhost:3000",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:3000"
        ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()
