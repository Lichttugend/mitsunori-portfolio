import os

# テスト用の環境変数をモジュールインポート前にセット
os.environ.setdefault("ANTHROPIC_API_KEY", "test-key")
os.environ.setdefault("SECRET_KEY", "test-secret-key-for-testing")
os.environ.setdefault("DATABASE_URL", "sqlite:///:memory:")

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from app.database import get_session
from app.main import app
from app.models.user import User
from app.routers.auth import get_current_user

_CHAT_USER_EMAIL = "chat_user@example.com"


@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        user = User(id=1, email=_CHAT_USER_EMAIL, hashed_password="hashed")
        session.add(user)
        session.commit()
        yield session


@pytest.fixture(name="client")
def client_fixture(session: Session):
    def override_get_session():
        yield session

    def override_get_current_user():
        return User(id=1, email=_CHAT_USER_EMAIL, hashed_password="hashed")

    app.dependency_overrides[get_session] = override_get_session
    app.dependency_overrides[get_current_user] = override_get_current_user
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()
