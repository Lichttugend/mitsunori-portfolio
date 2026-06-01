"""Google Sheets に経費データを書き込む。"""
from __future__ import annotations

import os
from datetime import datetime

from googleapiclient.discovery import build

from .auth import get_credentials
from .parser import ExpenseRecord

SHEET_NAME = "Ledger"
HEADERS = [
    "date", "kind", "amount", "currency",
    "vendor", "category", "description", "source_email_id", "recorded_at",
]


def _get_sheet_id() -> str:
    sheet_id = os.environ.get("GOOGLE_SHEET_ID")
    if not sheet_id:
        raise EnvironmentError("GOOGLE_SHEET_ID が設定されていません")
    return sheet_id


def _ensure_header(service: object, sheet_id: str) -> None:
    """シートが空なら1行目にヘッダーを書く。"""
    result = (
        service.spreadsheets()
        .values()
        .get(spreadsheetId=sheet_id, range=f"{SHEET_NAME}!A1:A1")
        .execute()
    )
    if not result.get("values"):
        service.spreadsheets().values().append(
            spreadsheetId=sheet_id,
            range=f"{SHEET_NAME}!A1",
            valueInputOption="RAW",
            body={"values": [HEADERS]},
        ).execute()


def _existing_email_ids(service: object, sheet_id: str) -> set[str]:
    """シートに記録済みの source_email_id を返す。"""
    result = (
        service.spreadsheets()
        .values()
        .get(spreadsheetId=sheet_id, range=f"{SHEET_NAME}!H:H")
        .execute()
    )
    rows = result.get("values", [])
    # 1行目はヘッダー（"source_email_id"）なのでスキップ
    return {r[0] for r in rows[1:] if r}


def append_record(record: ExpenseRecord) -> bool:
    """1件の ExpenseRecord を Sheets に追記する。重複の場合は False を返す。"""
    creds = get_credentials()
    service = build("sheets", "v4", credentials=creds)
    sheet_id = _get_sheet_id()
    _ensure_header(service, sheet_id)

    if record.source_email_id in _existing_email_ids(service, sheet_id):
        return False

    row = [
        record.date,
        record.kind,
        record.amount,
        record.currency,
        record.vendor,
        record.category,
        record.description,
        record.source_email_id,
        datetime.utcnow().isoformat(),
    ]
    service.spreadsheets().values().append(
        spreadsheetId=sheet_id,
        range=f"{SHEET_NAME}!A1",
        valueInputOption="USER_ENTERED",
        body={"values": [row]},
    ).execute()
    return True


def read_all_records() -> list[dict[str, str]]:
    """シートの全行を辞書のリストとして返す。"""
    creds = get_credentials()
    service = build("sheets", "v4", credentials=creds)
    sheet_id = _get_sheet_id()

    result = (
        service.spreadsheets()
        .values()
        .get(spreadsheetId=sheet_id, range=f"{SHEET_NAME}!A:I")
        .execute()
    )
    rows = result.get("values", [])
    if len(rows) < 2:
        return []

    headers = rows[0]
    return [dict(zip(headers, r)) for r in rows[1:]]
