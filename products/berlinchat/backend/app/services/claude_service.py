import re

import anthropic

from app.config import settings
from app.services.character_prompts import get_system_prompt

client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)

EXPLAIN_PATTERN = re.compile(r"\[EXPLAIN\]\s*(.*?)(?=\[EXPLAIN\]|$)", re.DOTALL)


def parse_response(raw: str) -> dict:
    """[EXPLAIN]タグを検出し、会話テキストと解説を分割する。"""
    parts = raw.split("[EXPLAIN]", 1)
    message = parts[0].strip()
    explanation = parts[1].strip() if len(parts) > 1 else None
    return {"message": message, "explanation": explanation}


async def get_character_response(
    user_message: str,
    character: str,
    language: str = "ja",
    history: list[dict] | None = None,
) -> dict:
    system_prompt = get_system_prompt(character, language)

    messages = history or []
    messages = messages + [{"role": "user", "content": user_message}]

    response = await client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system=system_prompt,
        messages=messages,
    )

    raw_text = response.content[0].text
    return parse_response(raw_text)
