from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    ANTHROPIC_API_KEY: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    DATABASE_URL: str = "sqlite:///./berlinchat.db"

    # MVP後に使用
    OPENAI_API_KEY: str = ""
    ELEVENLABS_API_KEY: str = ""
    STRIPE_SECRET_KEY: str = ""

    class Config:
        env_file = ".env"


settings = Settings()
