from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel import Session, select

from app.database import get_session
from app.models.message import Message
from app.services.claude_service import get_character_response

router = APIRouter()


class ChatRequest(BaseModel):
    content: str
    language: str = "ja"  # "ja" or "en"


class ChatResponse(BaseModel):
    message: str
    explanation: str | None
    character: str


@router.post("/message", response_model=ChatResponse)
async def send_message(
    request: ChatRequest,
    session: Session = Depends(get_session),
):
    # TODO: 認証済みユーザーのcharacter設定を参照する
    character = "freya"

    response = await get_character_response(
        user_message=request.content,
        character=character,
        language=request.language,
    )

    # ユーザーメッセージを保存
    user_msg = Message(
        user_id=1,  # TODO: 認証後に実際のuser_idを使用
        role="user",
        content=request.content,
    )
    session.add(user_msg)

    # アシスタントメッセージを保存
    assistant_msg = Message(
        user_id=1,
        role="assistant",
        content=response["message"],
        explanation=response.get("explanation"),
        character=character,
    )
    session.add(assistant_msg)
    session.commit()

    return ChatResponse(
        message=response["message"],
        explanation=response.get("explanation"),
        character=character,
    )


@router.get("/history")
def get_history(session: Session = Depends(get_session)):
    # TODO: 認証済みユーザーの履歴のみ返す
    messages = session.exec(select(Message).where(Message.user_id == 1)).all()
    return messages


@router.delete("/history")
def delete_history(session: Session = Depends(get_session)):
    messages = session.exec(select(Message).where(Message.user_id == 1)).all()
    for msg in messages:
        session.delete(msg)
    session.commit()
    return {"ok": True}
