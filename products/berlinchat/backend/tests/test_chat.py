from unittest.mock import AsyncMock, patch

from fastapi.testclient import TestClient


MOCK_RESPONSE = {
    "message": "Hallo! Wie geht es dir?",
    "explanation": "「Wie geht es dir?」は「元気ですか？」という意味の定番表現。",
}

MOCK_RESPONSE_NO_EXPLANATION = {
    "message": "Das ist toll!",
    "explanation": None,
}


@patch(
    "app.routers.chat.get_character_response",
    new_callable=AsyncMock,
    return_value=MOCK_RESPONSE,
)
def test_send_message(mock_claude, client: TestClient):
    response = client.post(
        "/chat/message",
        json={"content": "Hallo!", "language": "ja"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == MOCK_RESPONSE["message"]
    assert data["explanation"] == MOCK_RESPONSE["explanation"]
    assert data["character"] == "freya"
    mock_claude.assert_called_once()


@patch(
    "app.routers.chat.get_character_response",
    new_callable=AsyncMock,
    return_value=MOCK_RESPONSE_NO_EXPLANATION,
)
def test_send_message_no_explanation(mock_claude, client: TestClient):
    response = client.post(
        "/chat/message",
        json={"content": "Danke!", "language": "ja"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["explanation"] is None


@patch(
    "app.routers.chat.get_character_response",
    new_callable=AsyncMock,
    return_value=MOCK_RESPONSE,
)
def test_get_history(mock_claude, client: TestClient):
    client.post("/chat/message", json={"content": "Hallo!", "language": "ja"})
    response = client.get("/chat/history")
    assert response.status_code == 200
    history = response.json()
    # ユーザーメッセージとアシスタントメッセージの2件が保存される
    assert len(history) == 2
    roles = [msg["role"] for msg in history]
    assert "user" in roles
    assert "assistant" in roles


@patch(
    "app.routers.chat.get_character_response",
    new_callable=AsyncMock,
    return_value=MOCK_RESPONSE,
)
def test_delete_history(mock_claude, client: TestClient):
    client.post("/chat/message", json={"content": "Hallo!", "language": "ja"})
    delete_response = client.delete("/chat/history")
    assert delete_response.status_code == 200
    assert delete_response.json()["ok"] is True

    history_response = client.get("/chat/history")
    assert history_response.json() == []
