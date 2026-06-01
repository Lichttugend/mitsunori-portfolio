from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlmodel import Session, select

from app.database import get_session
from app.models.message import Message
from app.models.user import User
from app.routers.auth import get_current_user
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
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    character = current_user.selected_character

    response = await get_character_response(
        user_message=request.content,
        character=character,
        language=request.language,
    )

    user_msg = Message(
        user_id=current_user.id,
        role="user",
        content=request.content,
    )
    session.add(user_msg)

    assistant_msg = Message(
        user_id=current_user.id,
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
def get_history(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    messages = session.exec(select(Message).where(Message.user_id == current_user.id)).all()
    return messages


@router.delete("/history")
def delete_history(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    messages = session.exec(select(Message).where(Message.user_id == current_user.id)).all()
    for msg in messages:
        session.delete(msg)
    session.commit()
    return {"ok": True}
