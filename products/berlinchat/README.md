# BerlinChat 🇩🇪
**ベルリン在住のAIキャラクターとドイツ語を学ぶWebアプリ**

---

## プロジェクト概要

BerlinChatは、ベルリン在住の2人のAIキャラクター（FreyaとFinn）とリアルな会話を通じてドイツ語を学ぶWebアプリです。
キャラクターたちは同じIT Startupに勤めており、自社開発したこのアプリを使ってユーザーとドイツ語で会話します。
会話はドイツ語のみで行われ、難しい表現や文法には日本語または英語の解説が自動で表示されます。
解説言語はユーザー設定で日本語・英語から選択できます。

### コンセプト
- **対象ユーザー**：ベルリン在住または移住予定の日本語話者・英語話者
- **解説言語**：日本語・英語を切り替え可能（ユーザー設定で選択）
- **差別化ポイント**：Duolingo・Babbelとは異なり、キャラクターへの感情的愛着と継続性を重視
- **収益モデル**：月額サブスクリプション（Stripe） + キャラクターへのプレゼント機能（課金）

---

## キャラクター設定

### Freya
- **年齢**：27歳
- **居住地**：Prenzlauer Berg, Berlin
- **職業**：IT Startup / SNS Marketing担当
- **性格**：知的でフレンドリー、ベルリンの文化に精通
- **容姿**：白人・ブロンドヘア・碧眼
- **会話スタイル**：流行や文化の話題を自然に織り交ぜる

### Finn
- **年齢**：28歳
- **居住地**：Mitte, Berlin
- **職業**：IT Startup / Systems Engineer
- **性格**：知的で陽気、技術の話も日常会話も得意
- **容姿**：白人・ブラウンヘア・茶色い目
- **会話スタイル**：論理的だが親しみやすく、ユーモアがある

> **世界観設定**：FreyaとFinnは同じIT Startupに勤めており、二人が開発したドイツ語学習アプリ（= このアプリそのもの）を通じてユーザーと会話している。

---

## 技術スタック

### フロントエンド
- **React + Vite**（TypeScript）
- **Tailwind CSS**
- **Axios**（API通信）

### バックエンド
- **Python 3.11+**
- **uv**（パッケージ・仮想環境管理）
- **FastAPI**
- **SQLModel**（ORM）
- **SQLite**（開発・MVP段階）→ 本番はPostgreSQL（Supabase）に移行予定

### 外部API
- **Claude API**（Anthropic）：キャラクター会話生成 + 日本語解説生成
- **Whisper API**（OpenAI）：音声入力（MVP後に実装）
- **ElevenLabs API**：音声出力・キャラクターごとの声（MVP後に実装）
- **Stripe**：サブスクリプション課金

### デプロイ
- **フロントエンド**：Vercel（無料枠）
- **バックエンド**：Railway または Render（無料枠）

---

## ディレクトリ構成

```
berlinchat/
├── frontend/                  # React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWindow.tsx        # メイン会話画面
│   │   │   ├── CharacterSelect.tsx   # キャラクター選択画面
│   │   │   ├── MessageBubble.tsx     # 会話バブル（ドイツ語 + 解説）
│   │   │   ├── ExplanationPanel.tsx  # 文法・語彙解説表示
│   │   │   └── GiftModal.tsx         # プレゼント機能（後日実装）
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Chat.tsx
│   │   │   └── Settings.tsx
│   │   ├── hooks/
│   │   │   └── useChat.ts
│   │   ├── api/
│   │   │   └── client.ts
│   │   └── App.tsx
│   ├── index.html
│   └── package.json
│
├── backend/                   # FastAPI + Python
│   ├── app/
│   │   ├── main.py                   # FastAPIエントリーポイント
│   │   ├── models/
│   │   │   ├── user.py               # Userテーブル
│   │   │   ├── message.py            # Messageテーブル
│   │   │   └── gift.py               # Giftテーブル（後日実装）
│   │   ├── routers/
│   │   │   ├── chat.py               # /chat エンドポイント
│   │   │   ├── auth.py               # /auth エンドポイント
│   │   │   └── subscription.py       # /subscription エンドポイント（後日）
│   │   ├── services/
│   │   │   ├── claude_service.py     # Claude API連携
│   │   │   └── character_prompts.py  # FreyaとFinnのシステムプロンプト
│   │   ├── database.py               # DB接続・セッション管理
│   │   └── config.py                 # 環境変数管理
│   ├── pyproject.toml         # uv管理・依存関係定義
│   ├── uv.lock
│   └── .env.example
│
├── .gitignore
└── README.md
```

---

## データベース設計

### Userテーブル
```python
class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    email: str = Field(unique=True)
    hashed_password: str
    language_preference: str = Field(default="ja")  # "ja" or "en"
    selected_character: str = Field(default="freya") # "freya" or "finn"
    subscription_status: str = Field(default="free") # "free" or "premium"
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

### Messageテーブル
```python
class Message(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    role: str                        # "user" or "assistant"
    content: str                     # ドイツ語テキスト
    explanation: str | None = None   # 日本語または英語の解説
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

### Giftテーブル（後日実装）
```python
class Gift(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    character: str    # "freya" or "finn"
    gift_type: str    # "coffee", "book", "flower" など
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

---

## キャラクタープロンプト設計

### Freyaのシステムプロンプト（例）
```
あなたはFreyaです。
ベルリンのIT startupでSNSマーケティングを担当する27歳のBerlinerinです。
あなたは自分のスタートアップが開発したドイツ語学習アプリ（このアプリそのもの）を通じて、
日本人ユーザーとドイツ語で会話しています。

【厳守ルール】
- 会話は必ずドイツ語で行う
- ユーザーが文法ミスをした場合、直接指摘せず自然な返答の中で正しい表現を使う
- ベルリンの日常・文化・Kiez（下町）の話題を自然に織り込む
- 難しい表現や重要な文法を使った場合は [EXPLAIN] タグの後に日本語または英語で解説を付ける
- [EXPLAIN]タグの解説は簡潔に1〜2文で書く
- 性格：知的でフレンドリー、少しユーモアがある、ベルリンっ子らしい率直さがある

【[EXPLAIN]タグの使用例】
"Das ist doch klar!" [EXPLAIN] 「doch」は否定への反論や強調に使う副詞。「そんなの当たり前じゃない！」というニュアンス。
```

### レスポンス形式
バックエンドは `[EXPLAIN]` タグを検出し、会話テキストと解説を分割してフロントエンドに返す。

```json
{
  "message": "Das klingt super! Ich liebe es auch, durch Prenzlauer Berg zu schlendern.",
  "explanation": "「schlendern」はぶらぶら歩く・散歩するという意味の動詞。"durch + 場所"で「〜を通り抜けて」という表現。",
  "character": "freya"
}
```

---

## APIエンドポイント設計

### 認証
| Method | Path | 説明 |
|--------|------|------|
| POST | `/auth/register` | 新規ユーザー登録 |
| POST | `/auth/login` | ログイン・JWTトークン発行 |

### チャット
| Method | Path | 説明 |
|--------|------|------|
| POST | `/chat/message` | メッセージ送信・AI返答取得 |
| GET | `/chat/history` | 会話履歴取得 |
| DELETE | `/chat/history` | 会話履歴リセット |

### ユーザー設定
| Method | Path | 説明 |
|--------|------|------|
| GET | `/user/me` | ユーザー情報取得 |
| PATCH | `/user/character` | キャラクター切り替え（FreyaとFinn） |
| PATCH | `/user/language` | 解説言語切り替え（日本語・英語） |

---

## 収益モデル

| プラン | 機能 | 価格 |
|--------|------|------|
| 無料 | 1日10メッセージ・Freyaのみ | 0€ |
| Basic | 無制限・Freya＋Finn | 6.99€/月 |
| Premium | Basic + プレゼント機能・特別会話 | 12.99€/月 |

---

## MVP（最初に動かす最小範囲）

- [ ] ユーザー登録・ログイン
- [ ] Freyaとのテキストチャット
- [ ] ドイツ語会話 + 日本語解説の表示
- [ ] 会話履歴の保存・表示
- [ ] キャラクター切り替え（Freya / Finn）

### MVP後に実装
- [ ] Stripe課金・サブスクリプション
- [ ] プレゼント機能
- [ ] 音声入力（Whisper API）
- [ ] 音声出力（ElevenLabs API）
- [ ] ベルリンのニュース連携
- [ ] モバイルアプリ（React Native）

---

## 環境変数（.env）

```
# Claude API
ANTHROPIC_API_KEY=your_key_here

# OpenAI（Whisper・MVP後）
OPENAI_API_KEY=your_key_here

# ElevenLabs（MVP後）
ELEVENLABS_API_KEY=your_key_here

# Stripe（MVP後）
STRIPE_SECRET_KEY=your_key_here

# JWT
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# DB
DATABASE_URL=sqlite:///./berlinchat.db
```

---

## ローカル開発の起動手順

### バックエンド
```bash
cd backend
uv sync
uv run uvicorn app.main:app --reload
```

### フロントエンド
```bash
cd frontend
npm install
npm run dev
```

---

## 開発メモ・方針

- **言語**：バックエンドはPython優先（FastAPI）、フロントエンドはTypeScript
- **DB移行**：SQLite（開発） → PostgreSQL/Supabase（本番・有料ユーザーが安定してから）
- **音声機能**：MVP完成・テキスト会話の品質が安定してから実装
- **ニュース連携**：将来的にRSSフィードまたはWeb検索APIで実装予定
- **キャラクター画像**：Midjourneyで生成したリアル寄りイラストを使用予定