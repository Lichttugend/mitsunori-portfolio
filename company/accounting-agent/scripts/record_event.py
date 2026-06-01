from __future__ import annotations

import argparse
import csv
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
LEDGER_PATH = DATA_DIR / "ledger.csv"
FIELDNAMES = [
    "timestamp",
    "kind",
    "source",
    "amount",
    "currency",
    "description",
]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Record one accounting event")
    parser.add_argument("--kind", choices=["revenue", "expense"], required=True)
    parser.add_argument("--source", required=True, help="Product or channel name")
    parser.add_argument("--amount", type=float, required=True)
    parser.add_argument("--currency", default="EUR")
    parser.add_argument("--description", default="")
    return parser.parse_args()


def ensure_ledger() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not LEDGER_PATH.exists():
        with LEDGER_PATH.open("w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
            writer.writeheader()


def append_event(args: argparse.Namespace) -> None:
    ensure_ledger()
    now = datetime.now(timezone.utc).isoformat()
    with LEDGER_PATH.open("a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
        writer.writerow(
            {
                "timestamp": now,
                "kind": args.kind,
                "source": args.source,
                "amount": f"{args.amount:.2f}",
                "currency": args.currency,
                "description": args.description,
            }
        )


def main() -> None:
    args = parse_args()
    append_event(args)
    print(f"Recorded: {args.kind} {args.amount:.2f} {args.currency} from {args.source}")


if __name__ == "__main__":
    main()
