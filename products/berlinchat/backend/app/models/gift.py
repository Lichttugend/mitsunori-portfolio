# TODO: MVP後に実装

from datetime import datetime
from sqlmodel import Field, SQLModel


class Gift(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    character: str    # "freya" or "finn"
    gift_type: str    # "coffee", "book", "flower" など
    created_at: datetime = Field(default_factory=datetime.utcnow)
