"""Google Sheets から月次レポートを集計し、Drive にアップロードする。

使い方:
    uv run python scripts/export_report.py --month 2026-04
    uv run python scripts/export_report.py --month 2026-04 --no-upload
"""
from __future__ import annotations

import argparse
import json
import sys
from collections import defaultdict
from datetime import datetime
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT / ".env")

sys.path.insert(0, str(ROOT / "src"))

from accounting.drive import upload_report
from accounting.sheets import read_all_records

REPORTS_DIR = ROOT / "reports"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="月次レポート生成 & Drive アップロード")
    parser.add_argument("--month", required=True, help="YYYY-MM")
    parser.add_argument("--no-upload", action="store_true", help="Drive にアップロードしない")
    return parser.parse_args()


def to_month(ts: str) -> str:
    dt = datetime.fromisoformat(ts.replace("Z", "+00:00"))
    return dt.strftime("%Y-%m")


def build_report(rows: list[dict[str, str]], month: str) -> dict:
    revenue_total = 0.0
    expense_total = 0.0
    by_source: dict[str, float] = defaultdict(float)
    matched = []

    for row in rows:
        row_month = row.get("date", "")[:7]
        if row_month != month:
            continue
        amount = float(row.get("amount") or 0)
        matched.append(row)
        if row.get("kind") == "revenue":
            revenue_total += amount
            by_source[row.get("vendor", "")] += amount
        else:
            expense_total += amount
            by_source[row.get("vendor", "")] -= amount

    return {
        "month": month,
        "currency": "EUR",
        "summary": {
            "revenue_total": round(revenue_total, 2),
            "expense_total": round(expense_total, 2),
            "profit": round(revenue_total - expense_total, 2),
            "event_count": len(matched),
        },
        "by_vendor_net": {k: round(v, 2) for k, v in sorted(by_source.items())},
        "events": matched,
    }


def main() -> None:
    args = parse_args()
    datetime.strptime(args.month, "%Y-%m")  # バリデーション

    print("Sheets からデータを取得中...")
    rows = read_all_records()
    report = build_report(rows, args.month)

    # ローカルにも保存
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    local_path = REPORTS_DIR / f"{args.month}.json"
    local_path.write_text(
        json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"ローカル保存: {local_path}")
    print(
        f"  収益: {report['summary']['revenue_total']:.2f} EUR  "
        f"経費: {report['summary']['expense_total']:.2f} EUR  "
        f"利益: {report['summary']['profit']:.2f} EUR"
    )

    if not args.no_upload:
        print("Drive にアップロード中...")
        file_id = upload_report(report, args.month)
        print(f"アップロード完了: {file_id}")


if __name__ == "__main__":
    main()
