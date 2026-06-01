# accounting-agent v1

経理エージェント v1 — **Gmail → Google Sheets → Google Drive** パイプライン。

- Gmail の請求・領収書メールを Claude で解析して経費情報を抽出
- Google Sheets の台帳シートに自動記録
- 月次レポートを JSON として Google Drive に保存

## セットアップ

### 1. 依存パッケージのインストール

```bash
cd accounting-agent
uv sync
```

### 2. Google Cloud の設定

1. [Google Cloud Console](https://console.cloud.google.com/) でプロジェクトを作成
2. **Gmail API / Google Sheets API / Google Drive API** を有効化
3. OAuth 2.0 クライアントID（デスクトップアプリ）を作成し `credentials.json` として保存
4. Google Sheets でスプレッドシートを新規作成し、スプレッドシート ID をコピー
5. Google Drive でレポート保存フォルダを作成し、フォルダ ID をコピー

### 3. 環境変数の設定

```bash
cp .env.example .env
# .env を編集して各値を入力
```

| 変数名 | 説明 |
|---|---|
| `ANTHROPIC_API_KEY` | Anthropic API キー |
| `GOOGLE_SHEET_ID` | 台帳スプレッドシートの ID |
| `GOOGLE_DRIVE_FOLDER_ID` | レポート保存フォルダの ID |

### 4. 初回認証

```bash
uv run python scripts/fetch_invoices.py --dry-run
```

ブラウザが開くので Google アカウントで認証する。`token.json` が生成されれば完了。

## 使い方

### Gmail から請求メールを取り込む

```bash
# 過去30日分（デフォルト）
uv run python scripts/fetch_invoices.py

# カスタムクエリ
uv run python scripts/fetch_invoices.py --query "subject:Invoice newer_than:7d"

# 内容確認のみ（Sheets に書かない）
uv run python scripts/fetch_invoices.py --dry-run
```

### 手動でイベントを追記する

```bash
uv run python scripts/record_event.py \
  --kind expense \
  --source berlinchat \
  --amount 12.50 \
  --currency EUR \
  --description "Render hosting fee"
```

### 月次レポートを生成・Drive にアップロード

```bash
uv run python scripts/export_report.py --month 2026-04
```

出力:
- ローカル: `reports/2026-04.json`
- Drive: `accounting-2026-04.json`（指定フォルダに保存）

## ファイル構成

```
accounting-agent/
├── pyproject.toml
├── .env.example
├── credentials.json      ← Google OAuth クライアント（.gitignore 対象）
├── token.json            ← 認証トークンキャッシュ（.gitignore 対象）
├── data/
│   └── ledger.csv        ← ローカル台帳バックアップ
├── reports/              ← ローカルレポートバックアップ
├── scripts/
│   ├── fetch_invoices.py ← Gmail → Sheets メイン取り込み
│   ├── record_event.py   ← 手動イベント追記（ローカル CSV）
│   └── export_report.py  ← Sheets → Drive 月次レポート
└── src/accounting/
    ├── auth.py           ← Google OAuth2 認証
    ├── gmail.py          ← Gmail API ラッパー
    ├── parser.py         ← Claude によるメール解析
    ├── sheets.py         ← Google Sheets 読み書き
    └── drive.py          ← Google Drive アップロード
```
