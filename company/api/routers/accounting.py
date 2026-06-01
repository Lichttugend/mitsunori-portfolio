"""経理エージェント ルーター

エンドポイント:
    GET  /api/accounting/records          — 台帳の全レコード取得
    POST /api/accounting/fetch-invoices   — Gmail から請求メールを取得・記録
    POST /api/accounting/record           — 経費/収益を手動記録
    GET  /api/accounting/report/{month}   — 月次レポート生成
"""
from __future__ import annotations

from typing import Literal

from fastapi import APIRouter, BackgroundTasks, HTTPException
from pydantic import BaseModel

from accounting.gmail import fetch_invoice_emails
from accounting.parser import parse_expense
from accounting.sheets import append_record, read_all_records

router = APIRouter()

# ブロックリスト（個人・娯楽目的の除外ベンダー）
VENDOR_BLOCKLIST = {"Walt's Comic Shop"}


# ── レスポンス / リクエスト モデル ──────────────────────────────────────


class FetchInvoicesRequest(BaseModel):
    query: str | None = None
    max: int = 50
    dry_run: bool = False


class FetchInvoicesResponse(BaseModel):
    recorded: int
    skipped: int
    records: list[dict]


class RecordEventRequest(BaseModel):
    kind: Literal["revenue", "expense"]
    source: str
    amount: float
    currency: str = "EUR"
    description: str = ""


# ── エンドポイント ────────────────────────────────────────────────────


@router.get("/records")
def get_records() -> list[dict]:
    """Google Sheets の台帳を全件返す。"""
    try:
        return read_all_records()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/fetch-invoices", response_model=FetchInvoicesResponse)
def fetch_invoices(body: FetchInvoicesRequest) -> FetchInvoicesResponse:
    """Gmail から請求メールを取得し、Claude で解析して Sheets に記録する。"""
    kwargs: dict = {"max_results": body.max}
    if body.query:
        kwargs["query"] = body.query

    try:
        emails = fetch_invoice_emails(**kwargs)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gmail 取得エラー: {e}")

    recorded_list = []
    skipped = 0

    for email in emails:
        record = parse_expense(email)
        if record is None:
            skipped += 1
            continue
        if record.vendor in VENDOR_BLOCKLIST:
            skipped += 1
            continue
        if not body.dry_run:
            try:
                append_record(record)
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Sheets 書き込みエラー: {e}")
        recorded_list.append(
            {
                "date": record.date,
                "kind": record.kind,
                "amount": record.amount,
                "currency": record.currency,
                "vendor": record.vendor,
                "category": record.category,
                "description": record.description,
            }
        )

    return FetchInvoicesResponse(
        recorded=len(recorded_list),
        skipped=skipped,
        records=recorded_list,
    )


@router.post("/record", status_code=201)
def record_event(body: RecordEventRequest) -> dict:
    """経費・収益を1件手動で記録する。"""
    from datetime import datetime, timezone
    import csv
    from pathlib import Path

    data_dir = Path(__file__).resolve().parents[2] / "accounting-agent" / "data"
    data_dir.mkdir(parents=True, exist_ok=True)
    ledger_path = data_dir / "ledger.csv"
    fieldnames = ["timestamp", "kind", "source", "amount", "currency", "description"]

    write_header = not ledger_path.exists()
    with ledger_path.open("a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        if write_header:
            writer.writeheader()
        writer.writerow(
            {
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "kind": body.kind,
                "source": body.source,
                "amount": f"{body.amount:.2f}",
                "currency": body.currency,
                "description": body.description,
            }
        )

    return {
        "recorded": True,
        "kind": body.kind,
        "source": body.source,
        "amount": body.amount,
        "currency": body.currency,
    }
