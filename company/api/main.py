"""会社システム FastAPI バックエンド

起動方法:
    cd api && uv run uvicorn main:app --reload --port 8000
"""
from __future__ import annotations

import sys
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# accounting-agent の src を import パスに追加
ACCOUNTING_SRC = Path(__file__).resolve().parents[1] / "accounting-agent"
load_dotenv(ACCOUNTING_SRC / ".env")
sys.path.insert(0, str(ACCOUNTING_SRC / "src"))

from routers import accounting, agents  # noqa: E402

app = FastAPI(
    title="Company API",
    description="会社エージェントシステムのバックエンド API",
    version="0.1.0",
)

# Next.js 開発サーバー (localhost:3000) からのリクエストを許可
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(accounting.router, prefix="/api/accounting", tags=["accounting"])
app.include_router(agents.router, prefix="/api/agents", tags=["agents"])


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
