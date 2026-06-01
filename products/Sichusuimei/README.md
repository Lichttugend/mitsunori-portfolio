# 🔮 BaZi Fortune — Four Pillars of Destiny Web App

> An AI-powered web application that brings the Eastern divination system **Four Pillars of Destiny** (四柱推命 / BaZi) to Western audiences.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg)](https://fastapi.tiangolo.com/)

---

## What is BaZi?

**Four Pillars of Destiny** (BaZi / 四柱推命) is a Chinese metaphysical system that uses your birth date, time, and location to construct a personal chart of four "pillars" — Year, Month, Day, and Hour. Each pillar reveals insights about personality, strengths, life themes, and cycles.

This app translates BaZi concepts into language familiar to Western audiences (e.g. astrology, personality archetypes), making the system accessible without prior knowledge.

---

## Features

- 🧮 **BaZi Chart Calculation** — Enter birth date, time, and location to generate your Four Pillars
- 🤖 **AI-Generated Reports** — Powered by Claude API (Haiku) in English and German
- 📄 **PDF Report Sales** — Detailed personal reports available for purchase
- 💳 **Stripe Payments** — Secure one-time and subscription billing
- 🌐 **Multilingual** — English and German output (French and Spanish planned)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React (Vite) + TailwindCSS |
| Backend | Python / FastAPI |
| AI | Claude API (`claude-haiku-4-5`) |
| Payments | Stripe Checkout / Subscription |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth |
| PDF | ReportLab / WeasyPrint |
| Hosting | Render / Railway |

---

## Project Structure

```
bazi-fortune/
├── backend/
│   ├── main.py              # FastAPI entry point
│   ├── calculator.py        # BaZi calculation logic
│   ├── ai_report.py         # Claude API integration
│   ├── pdf_generator.py     # PDF report generation
│   └── stripe_webhook.py    # Stripe payment handling
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── BirthForm.jsx
│   │   │   ├── FreePreview.jsx
│   │   │   └── PaywallModal.jsx
│   │   └── pages/
│   │       ├── Home.jsx
│   │       └── Result.jsx
├── .env.example
└── README.md
```

---

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- Anthropic API key
- Stripe account
- Supabase project

### 1. Clone the repository

```bash
git clone https://github.com/your-username/bazi-fortune.git
cd bazi-fortune
```

### 2. Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and fill in your keys:

```bash
cp .env.example .env
```

```env
ANTHROPIC_API_KEY=your_key_here
STRIPE_SECRET_KEY=your_key_here
STRIPE_WEBHOOK_SECRET=your_key_here
SUPABASE_URL=your_url_here
SUPABASE_KEY=your_key_here
```

Start the backend:

```bash
uvicorn main:app --reload
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

---

## Pricing

| Plan | Price | Contents |
|------|-------|----------|
| Free | €0 | Chart display only |
| Basic Report | €5 | English or German PDF (~800 words) |
| Premium Report | €15 | Bilingual PDF + Annual & Monthly Forecast |
| Pro Subscription | €7/month | Monthly report (EN + DE) + compatibility readings |

---

## Roadmap

- [x] BaZi chart calculation engine
- [x] Claude API report generation
- [x] Stripe one-time payment
- [ ] PDF report generation
- [ ] User accounts (Supabase Auth)
- [ ] Monthly subscription billing
- [ ] Compatibility reading feature
- [ ] React Native mobile app (iOS / Android)
- [ ] French and Spanish language support

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## License

[MIT](LICENSE)
