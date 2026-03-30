from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    app_name: str = "TaniTrade AI API"
    api_v1_prefix: str = "/api/v1"
    frontend_url: str = "http://localhost:5173"
    supabase_url: str = ""
    supabase_secret_key: str = ""
    supabase_service_role_key: str = ""
    gemini_api_key: str = ""
    gemini_model_primary: str = "gemini-2.5-flash"
    gemini_model_listing: str = "gemini-2.5-flash"
    gemini_timeout_seconds: int = 20
    gemini_max_retries: int = 2
    ai_fallback_enabled: bool = True
    ai_debug_logging: bool = False
    ai_log_file: str = "logs/ai.log"
    demo_farmer_profile_id: str = "11111111-1111-1111-1111-111111111111"

    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def cors_origins(self) -> list[str]:
        return [self.frontend_url]

    @property
    def supabase_server_key(self) -> str:
        return self.supabase_secret_key or self.supabase_service_role_key

    @property
    def ai_log_path(self) -> Path:
        path = Path(self.ai_log_file)
        return path if path.is_absolute() else BASE_DIR / path


@lru_cache
def get_settings() -> Settings:
    return Settings()
