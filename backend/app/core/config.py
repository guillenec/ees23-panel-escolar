from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "EES23 API"
    app_env: str = "development"
    api_v1_prefix: str = "/api/v1"

    database_url: str = "postgresql+psycopg://ees23:ees23@localhost:5432/ees23"

    jwt_secret_key: str = "change-me-in-env"
    jwt_algorithm: str = "HS256"
    access_token_minutes: int = 60
    refresh_token_minutes: int = 60 * 24 * 7
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"

    google_client_id: str = ""
    google_client_secret: str = ""
    google_redirect_uri: str = "http://localhost:3000/auth/callback"

    openrouter_api_key: str = ""
    openrouter_model: str = "arcee-ai/trinity-large-preview:free"
    openrouter_base_url: str = "https://openrouter.ai/api/v1"

    google_drive_service_account_file: str = ""
    google_drive_root_folder_id: str = ""
    google_drive_source: str = "personal"


settings = Settings()
