from datetime import datetime
from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    email: str = Field(unique=True)
    hashed_password: str
    language_preference: str = Field(default="ja")  # "ja" or "en"
    selected_character: str = Field(default="freya")  # "freya" or "finn"
    subscription_status: str = Field(default="free")  # "free" or "premium"
    created_at: datetime = Field(default_factory=datetime.utcnow)
