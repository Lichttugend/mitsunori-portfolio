"""Gmail から請求メールを取得して Google Sheets に記録する。

使い方:
    uv run python scripts/fetch_invoices.py
    uv run python scripts/fetch_invoices.py --query "subject:Invoice newer_than:7d"
    uv run python scripts/fetch_invoices.py --dry-run
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT / ".env")

sys.path.insert(0, str(ROOT / "src"))

from accounting.gmail import fetch_invoice_emails
from accounting.parser import parse_expense
from accounting.sheets import append_record

# 経費として記録しないベンダー（娯楽・個人購入など）
VENDOR_BLOCKLIST = {
    "Walt's Comic Shop",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Gmail → Sheets 請求メール取り込み")
    parser.add_argument("--query", default=None, help="Gmail 検索クエリ（省略時はデフォルト）")
    parser.add_argument("--max", type=int, default=50, help="取得上限件数")
    parser.add_argument("--dry-run", action="store_true", help="Sheets に書かずに内容だけ表示")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    kwargs = {"max_results": args.max}
    if args.query:
        kwargs["query"] = args.query

    print("Gmail からメールを取得中...")
    emails = fetch_invoice_emails(**kwargs)
    print(f"{len(emails)} 件取得")

    recorded = 0
    skipped = 0
    for email in emails:
        record = parse_expense(email)
        if record is None:
            skipped += 1
            continue
        if record.vendor in VENDOR_BLOCKLIST:
            print(f"除外: {record.vendor}（ブロックリスト）")
            skipped += 1
            continue
        if args.dry_run:
            print(
                f"[DRY RUN] {record.date} | {record.kind} | "
                f"{record.amount:.2f} {record.currency} | "
                f"{record.vendor} | {record.category} | {record.description}"
            )
            recorded += 1
        else:
            written = append_record(record)
            if written:
                print(
                    f"記録: {record.date} {record.amount:.2f} {record.currency} "
                    f"— {record.vendor}"
                )
                recorded += 1
            else:
                print(f"スキップ（重複）: {record.vendor} [{record.source_email_id}]")
                skipped += 1

    print(f"\n完了: 記録 {recorded} 件 / スキップ {skipped} 件")


if __name__ == "__main__":
    main()
