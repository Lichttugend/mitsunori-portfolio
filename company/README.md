# company

個人事業主・法人化（ドイツ登記）を見据えた**マルチエージェント会社システム**。

各部署をAIエージェントとして実装し、経理・開発管理・営業・CEO統括をソフトウェアで代替する。現時点では経理エージェント（v1）のみ稼働。プロダクト群（`../products/`）と連携し、収益・コスト・開発状況を一元管理することが最終目標。

---

## リポジトリの位置づけ

```
~/projects/
├── company/                     ← 本リポジトリ（社内インフラ・非公開）
│   ├── README.md                ← このファイル
│   ├── accounting-agent/        ← 経理エージェント（v1 稼働中）
│   ├── ceo-agent/               ← CEO統括エージェント（将来追加）
│   ├── dev-agent/               ← 開発管理エージェント（将来追加）
│   └── sales-agent/             ← 営業エージェント（将来追加）
│
└── products/                    ← プロダクト群（収益物・公開可）
    ├── berlin-biyori-bot/       ← Xニュース配信BOT（稼働中）
    ├── berlinchat/              ← AIキャラクター会話アプリ（開発中）
    └── personal-hp/             ← 個人HP（将来追加）
```

`company/` は**社内インフラ**であり、外部には公開しない（GitHubでは private）。
`products/` は**収益物・成果物**であり、状況に応じて public / private を使い分ける。

---

## エージェント構成

### 現在稼働中

| エージェント | 場所 | 状態 | 概要 |
|---|---|---|---|
| 経理エージェント | `accounting-agent/` | ✅ v1 稼働中 | 請求メール自動記録・経費台帳管理 |

### 将来追加予定

| エージェント | 場所 | 状態 | 概要 |
|---|---|---|---|
| CEO エージェント | `ceo-agent/` | 🔲 未着手 | 各エージェントへの指示・週次サマリー生成 |
| 開発エージェント | `dev-agent/` | 🔲 未着手 | GitHubコミット記録・工数管理・進捗レポート |
| 営業エージェント | `sales-agent/` | 🔲 未着手 | 案件管理・見積書生成・売上予測 |

---

## プロダクトとの連携イメージ

```
products/
  berlin-biyori-bot  ──→  company/accounting-agent  （API費用を自動記録）
  berlinchat         ──→  company/accounting-agent  （サーバー代・ドメイン代を記録）
  personal-hp        ──→  company/accounting-agent  （ホスティング費用を記録）
                     ──→  company/dev-agent          （デプロイ・コミット履歴管理）〔将来〕
                     ──→  company/sales-agent        （収益・問い合わせ管理）〔将来〕
```

---

## 事業フェーズとシステム拡張ロードマップ

### Phase 1 — 現在（2026年）
**状況**: ALG受給中・Ausbildung準備中・副業届け出前

- [x] 経理エージェント v1（Gmail → Sheets → Drive）
- [x] Xニュース配信BOT（berlin-biyori-bot）稼働
- [ ] berlin-biyori-bot を `products/` へ移行
- [ ] `company/` リポジトリの初期化・GitHub private 登録

### Phase 2 — Ausbildung開始後（2026年9月〜）
**状況**: 収入発生・Nebentätigkeit届け出済み想定

- [ ] 経理エージェント v2（月次PDF・為替レート自動取得）
- [ ] 個人HP（personal-hp）公開・Impressum整備
- [ ] berlinchat MVP リリース

### Phase 3 — 収益発生後
**状況**: Einzelunternehmen（個人事業主）として Gewerbeanmeldung 済み想定

- [ ] 売上記録モジュール追加（EÜR対応）
- [ ] 開発エージェント v1（GitHub連携・工数記録）
- [ ] 請求書（Rechnung）自動生成

### Phase 4 — 法人化後（UG / GmbH）
**状況**: ドイツ法人登記済み想定

- [ ] CEO エージェント統括レイヤー
- [ ] 営業エージェント v1
- [ ] Datev / ELSTER 連携
- [ ] 複式簿記対応

---

## ドイツ事業登記に向けた準備チェックリスト

会社システムとは別に、実際の登記には以下が必要になる。記録としてここに管理する。

### Einzelunternehmen（個人事業主）登記時

- [ ] Gewerbeanmeldung（事業登録）— Bezirksamt にて届け出
- [ ] Steuernummer（税番号）取得 — Finanzamt に申請
- [ ] Agentur für Arbeit への Nebentätigkeit 届け出（ALG受給中は必須）
- [ ] ビジネス用銀行口座の開設（任意だが強く推奨）
- [ ] Impressum の整備（HP・SNS 等の公開サービスに必須）

### 公開サービス運営時（HP・アプリ等）

- [ ] Impressum（法的表記）— 氏名・住所・連絡先の公開義務
- [ ] Datenschutzerklärung（プライバシーポリシー）— DSGVO 準拠
- [ ] AGB（利用規約）— 有料サービス提供時に必要
- [ ] Cookie 同意バナー — EU Cookie 指令対応

> 上記は参考情報であり、法的アドバイスではない。最終確認は Steuerberater・Rechtsanwalt に委ねること。

---

## 構築環境ポリシー

本プロジェクト全体（`company/` 配下の全エージェント）で統一するルール。

| 項目 | 方針 |
|---|---|
| Python パッケージ管理 | `uv` を使用。`pip` は使用しない |
| 依存関係ファイル | `pyproject.toml` + `uv.lock`（両方コミット対象） |
| 仮想環境 | `.venv/`（各エージェントディレクトリ配下） |
| シークレット管理 | `.env` または Apps Script プロパティ。ハードコード禁止 |
| バージョン管理 | Git / GitHub（本リポジトリは private） |

```bash
# uv のインストール（未導入の場合）
curl -LsSf https://astral.sh/uv/install.sh | sh

# 各エージェントの初期化例
cd company/accounting-agent
uv sync

# パッケージ追加例
uv add anthropic google-auth google-api-python-client

# 実行例
uv run python scripts/export_report.py
```

---

## .gitignore（このリポジトリ全体共通）

```gitignore
# シークレット
.env
.env.local
*.key

# uv / Python
.venv/
__pycache__/
*.pyc
.python-version

# uv.lock・pyproject.toml はコミット対象

# OS
.DS_Store
Thumbs.db
```

---

## ライセンス

Private repository — 個人利用・将来の事業利用を目的とした非公開プロジェクト。

---

*Last updated: 2026-04-09*
*Author: Mitsunori — Berlin, DE*
