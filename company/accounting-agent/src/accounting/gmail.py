"""Gmail から請求・領収書メールを取得する。"""
from __future__ import annotations

import base64
import re
from dataclasses import dataclass
from typing import Any

from googleapiclient.discovery import build

from .auth import get_credentials

# 請求・領収書関連メールを絞り込むデフォルトクエリ
DEFAULT_QUERY = (
    "subject:(Rechnung OR Invoice OR Receipt OR 請求書 OR 領収書) "
    "newer_than:30d"
)


@dataclass
class EmailMessage:
    msg_id: str
    subject: str
    sender: str
    date: str
    snippet: str
    body: str


def _decode_body(payload: dict[str, Any]) -> str:
    """メール本文を再帰的にデコードしてテキストとして返す。"""
    mime_type: str = payload.get("mimeType", "")
    if mime_type == "text/plain":
        data = payload.get("body", {}).get("data", "")
        if data:
            return base64.urlsafe_b64decode(data).decode("utf-8", errors="replace")
    if mime_type.startswith("multipart/"):
        for part in payload.get("parts", []):
            text = _decode_body(part)
            if text:
                return text
    return ""


def _header(headers: list[dict[str, str]], name: str) -> str:
    for h in headers:
        if h["name"].lower() == name.lower():
            return h["value"]
    return ""


def fetch_invoice_emails(query: str = DEFAULT_QUERY, max_results: int = 50) -> list[EmailMessage]:
    """指定クエリに一致するメールを取得して返す。"""
    creds = get_credentials()
    service = build("gmail", "v1", credentials=creds)

    results = (
        service.users()
        .messages()
        .list(userId="me", q=query, maxResults=max_results)
        .execute()
    )
    messages = results.get("messages", [])

    emails: list[EmailMessage] = []
    for m in messages:
        msg = service.users().messages().get(
            userId="me", id=m["id"], format="full"
        ).execute()
        payload = msg.get("payload", {})
        headers = payload.get("headers", [])
        emails.append(
            EmailMessage(
                msg_id=m["id"],
                subject=_header(headers, "Subject"),
                sender=_header(headers, "From"),
                date=_header(headers, "Date"),
                snippet=msg.get("snippet", ""),
                body=_decode_body(payload),
            )
        )
    return emails
