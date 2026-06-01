from datetime import datetime
from sqlmodel import Field, SQLModel


class Message(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    role: str                        # "user" or "assistant"
    content: str                     # ドイツ語テキスト
    explanation: str | None = None   # 日本語または英語の解説
    character: str | None = None     # "freya" or "finn"
    created_at: datetime = Field(default_factory=datetime.utcnow)
