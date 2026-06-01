"""Claude API を使ってメール本文から経費情報を抽出する。"""
from __future__ import annotations

import json
import os
from dataclasses import dataclass
from typing import Any

import anthropic

from .gmail import EmailMessage


@dataclass
class ExpenseRecord:
    date: str          # YYYY-MM-DD
    kind: str          # "expense" or "revenue"
    amount: float
    currency: str      # EUR など
    vendor: str
    category: str      # API, hosting, domain, subscription ...
    description: str
    source_email_id: str


_SYSTEM_PROMPT = """\
あなたは経理アシスタントです。
メール本文から以下のJSON形式で経費・請求情報を抽出してください。
不明な項目は空文字または0にしてください。

{
  "date": "YYYY-MM-DD",
  "kind": "expense または revenue",
  "amount": 数値,
  "currency": "通貨コード（例: EUR, USD, JPY）",
  "vendor": "請求元の会社名・サービス名",
  "category": "API / hosting / domain / subscription / other のいずれか",
  "description": "1行で内容の説明"
}

JSONのみを返してください。余計なテキストは不要です。
"""


def parse_expense(email: EmailMessage) -> ExpenseRecord | None:
    """メール1通から ExpenseRecord を抽出する。取得できない場合は None。"""
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise EnvironmentError("ANTHROPIC_API_KEY が設定されていません")

    client = anthropic.Anthropic(api_key=api_key)

    user_content = (
        f"件名: {email.subject}\n"
        f"送信者: {email.sender}\n"
        f"日付: {email.date}\n"
        f"本文:\n{email.body[:3000]}"  # 長すぎるメールは切り詰め
    )

    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=512,
        system=_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_content}],
    )

    raw = message.content[0].text.strip()
    # ```json ... ``` で囲まれている場合は除去
    if raw.startswith("```"):
        raw = raw.split("```", 2)[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()
    try:
        data: dict[str, Any] = json.loads(raw)
    except json.JSONDecodeError:
        return None

    amount = float(data.get("amount") or 0)
    if amount == 0:
        return None

    return ExpenseRecord(
        date=str(data.get("date", "")),
        kind=str(data.get("kind", "expense")),
        amount=amount,
        currency=str(data.get("currency", "EUR")),
        vendor=str(data.get("vendor", "")),
        category=str(data.get("category", "other")),
        description=str(data.get("description", "")),
        source_email_id=email.msg_id,
    )
