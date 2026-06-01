from fastapi.testclient import TestClient


def test_register_success(client: TestClient):
    response = client.post(
        "/auth/register",
        json={"email": "test@example.com", "password": "password123"},
    )
    assert response.status_code == 201
    assert response.json()["message"] == "User created successfully"


def test_register_duplicate_email(client: TestClient):
    client.post(
        "/auth/register",
        json={"email": "dup@example.com", "password": "password123"},
    )
    response = client.post(
        "/auth/register",
        json={"email": "dup@example.com", "password": "password123"},
    )
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"]


def test_login_success(client: TestClient):
    client.post(
        "/auth/register",
        json={"email": "login@example.com", "password": "password123"},
    )
    response = client.post(
        "/auth/login",
        json={"email": "login@example.com", "password": "password123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client: TestClient):
    client.post(
        "/auth/register",
        json={"email": "user@example.com", "password": "correct"},
    )
    response = client.post(
        "/auth/login",
        json={"email": "user@example.com", "password": "wrong"},
    )
    assert response.status_code == 401


def test_login_nonexistent_user(client: TestClient):
    response = client.post(
        "/auth/login",
        json={"email": "nobody@example.com", "password": "password"},
    )
    assert response.status_code == 401
