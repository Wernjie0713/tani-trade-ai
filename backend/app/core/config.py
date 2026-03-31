from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    app_name: str = "TaniTrade AI API"
    api_v1_prefix: str = "/api/v1"
    frontend_url: str = "http://localhost:5173"
    firebase_project_id: str = ""
    firebase_credentials_path: str = ""
    firebase_service_account_json: str = ""
    google_cloud_project_id: str = ""
    gemini_api_key: str = ""
    gemini_model_primary: str = "gemini-3.1-flash-lite-preview"
    gemini_model_listing: str = "gemini-3.1-flash-lite-preview"
    gemini_timeout_seconds: int = 20
    gemini_max_retries: int = 2
    speech_to_text_language_codes: str = "en-US"
    speech_to_text_model: str = "latest_short"
    speech_max_audio_seconds: int = 30
    speech_max_audio_bytes: int = 10_000_000
    speech_debug_logging: bool = False
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
    def firebase_credentials_file(self) -> Path | None:
        if not self.firebase_credentials_path:
            return None
        path = Path(self.firebase_credentials_path)
        return path if path.is_absolute() else BASE_DIR / path

    @property
    def firebase_configured(self) -> bool:
        return bool(
            self.firebase_project_id
            or self.firebase_service_account_json
            or self.firebase_credentials_path
        )

    @property
    def google_cloud_project(self) -> str:
        return self.google_cloud_project_id or self.firebase_project_id

    @property
    def speech_language_codes(self) -> list[str]:
        return [
            language.strip()
            for language in self.speech_to_text_language_codes.split(",")
            if language.strip()
        ] or ["en-US"]

    @property
    def ai_log_path(self) -> Path:
        path = Path(self.ai_log_file)
        return path if path.is_absolute() else BASE_DIR / path


@lru_cache
def get_settings() -> Settings:
    return Settings()
