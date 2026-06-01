"""エージェント状態管理ルーター + WebSocket

エンドポイント:
    GET  /api/agents/status          — 全エージェントのステータス一覧
    POST /api/agents/{name}/trigger  — エージェントのタスクを手動実行
    WS   /api/agents/ws              — リアルタイムアクティビティフィード
"""
from __future__ import annotations

import asyncio
import json
from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter()


# ── エージェント定義（擬人化情報含む） ─────────────────────────────────

AGENTS: dict[str, dict[str, Any]] = {
    "ceo": {
        "name": "CEO",
        "role": "最高経営責任者",
        "avatar": "ceo",
        "status": "idle",
        "description": "全エージェントの統括・週次サマリーの作成",
        "last_active": None,
        "capabilities": ["weekly_summary", "dashboard"],
    },
    "accounting": {
        "name": "経理",
        "role": "経理担当",
        "avatar": "accounting",
        "status": "idle",
        "description": "請求書処理・経費台帳管理・月次レポート",
        "last_active": None,
        "capabilities": ["fetch_invoices", "record_event", "export_report"],
    },
    "dev": {
        "name": "エンジニア",
        "role": "開発担当",
        "avatar": "dev",
        "status": "idle",
        "description": "GitHub 進捗追跡・工数集計・開発レポート",
        "last_active": None,
        "capabilities": ["github_summary", "effort_report"],
    },
    "sales": {
        "name": "営業",
        "role": "営業担当",
        "avatar": "sales",
        "status": "idle",
        "description": "案件管理・見積生成・売上予測",
        "last_active": None,
        "capabilities": ["opportunity_list", "quote_generate", "revenue_forecast"],
    },
}

# アクティビティログ（最新50件）
activity_log: list[dict[str, Any]] = []

# 接続中の WebSocket クライアント
connected_clients: list[WebSocket] = []


# ── ユーティリティ ────────────────────────────────────────────────────


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _set_status(agent_key: str, status: str) -> None:
    if agent_key in AGENTS:
        AGENTS[agent_key]["status"] = status
        AGENTS[agent_key]["last_active"] = _now()


async def _broadcast(event: dict[str, Any]) -> None:
    """全 WebSocket クライアントにイベントを送信する。"""
    activity_log.append(event)
    if len(activity_log) > 50:
        activity_log.pop(0)

    dead = []
    for ws in connected_clients:
        try:
            await ws.send_text(json.dumps(event, ensure_ascii=False))
        except Exception:
            dead.append(ws)
    for ws in dead:
        connected_clients.remove(ws)


def _add_activity(agent_key: str, message: str, kind: str = "info") -> dict:
    event = {
        "agent": agent_key,
        "agent_name": AGENTS[agent_key]["name"],
        "message": message,
        "kind": kind,
        "timestamp": _now(),
    }
    return event


# ── REST エンドポイント ────────────────────────────────────────────────


@router.get("/status")
def get_status() -> dict[str, Any]:
    """全エージェントのステータスと最近のアクティビティを返す。"""
    return {
        "agents": AGENTS,
        "recent_activity": activity_log[-20:],
    }


@router.post("/{agent_name}/trigger")
async def trigger_agent(agent_name: str) -> dict[str, str]:
    """エージェントのメインタスクを手動実行する。"""
    if agent_name not in AGENTS:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail=f"エージェント '{agent_name}' が見つかりません")

    _set_status(agent_name, "working")
    event = _add_activity(agent_name, f"{AGENTS[agent_name]['name']} が作業を開始しました", "start")
    await _broadcast(event)

    # accounting エージェントのみ実際の処理を実行
    if agent_name == "accounting":
        asyncio.create_task(_run_accounting())
    else:
        # 他エージェントは未実装のためシミュレーション
        asyncio.create_task(_simulate_agent(agent_name))

    return {"status": "triggered", "agent": agent_name}


async def _run_accounting() -> None:
    """経理エージェントの実処理を非同期で実行する。"""
    try:
        from accounting.gmail import fetch_invoice_emails
        from accounting.parser import parse_expense
        from accounting.sheets import append_record

        await _broadcast(_add_activity("accounting", "Gmail から請求メールを確認中...", "info"))

        emails = fetch_invoice_emails(max_results=50)
        await _broadcast(_add_activity("accounting", f"{len(emails)} 件のメールを取得しました", "info"))

        recorded = 0
        for email in emails:
            record = parse_expense(email)
            if record:
                append_record(record)
                recorded += 1
                await _broadcast(
                    _add_activity(
                        "accounting",
                        f"記録: {record.vendor} — {record.amount:.2f} {record.currency}",
                        "success",
                    )
                )

        _set_status("accounting", "idle")
        await _broadcast(
            _add_activity("accounting", f"完了: {recorded} 件を台帳に記録しました", "complete")
        )

    except Exception as e:
        _set_status("accounting", "error")
        await _broadcast(_add_activity("accounting", f"エラー: {e}", "error"))


async def _simulate_agent(agent_name: str) -> None:
    """未実装エージェントの動作シミュレーション。"""
    await asyncio.sleep(1.5)
    _set_status(agent_name, "idle")
    await _broadcast(
        _add_activity(agent_name, f"{AGENTS[agent_name]['name']} は現在開発中です", "info")
    )


# ── WebSocket ─────────────────────────────────────────────────────────


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket) -> None:
    """リアルタイムアクティビティフィード。"""
    await websocket.accept()
    connected_clients.append(websocket)

    # 接続直後に現在のステータスを送信
    await websocket.send_text(
        json.dumps(
            {"type": "init", "agents": AGENTS, "recent_activity": activity_log[-20:]},
            ensure_ascii=False,
        )
    )

    try:
        while True:
            # クライアントからのメッセージを待機（切断検知のため）
            await websocket.receive_text()
    except WebSocketDisconnect:
        connected_clients.remove(websocket)
