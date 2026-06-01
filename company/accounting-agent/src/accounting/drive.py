"""月次レポートを Google Drive にアップロードする。"""
from __future__ import annotations

import io
import json
import os
from pathlib import Path

from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload

from .auth import get_credentials


def _get_folder_id() -> str:
    folder_id = os.environ.get("GOOGLE_DRIVE_FOLDER_ID")
    if not folder_id:
        raise EnvironmentError("GOOGLE_DRIVE_FOLDER_ID が設定されていません")
    return folder_id


def upload_report(report: dict, month: str) -> str:
    """
    月次レポート辞書を JSON ファイルとして Drive にアップロードする。
    既存ファイルがあれば上書き更新し、ファイル ID を返す。
    """
    creds = get_credentials()
    service = build("drive", "v3", credentials=creds)
    folder_id = _get_folder_id()
    filename = f"accounting-{month}.json"
    content = json.dumps(report, ensure_ascii=False, indent=2).encode("utf-8")
    media = MediaIoBaseUpload(io.BytesIO(content), mimetype="application/json")

    # 同名ファイルを検索して上書きか新規作成か判断
    existing = (
        service.files()
        .list(
            q=f"name='{filename}' and '{folder_id}' in parents and trashed=false",
            fields="files(id)",
        )
        .execute()
    )
    files = existing.get("files", [])

    if files:
        file_id = files[0]["id"]
        service.files().update(fileId=file_id, media_body=media).execute()
    else:
        metadata = {"name": filename, "parents": [folder_id]}
        created = (
            service.files()
            .create(body=metadata, media_body=media, fields="id")
            .execute()
        )
        file_id = created["id"]

    return file_id
