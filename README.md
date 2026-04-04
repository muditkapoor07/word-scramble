# 🔤 Word Scramble

> **Unscramble. Learn. Compete.**

A full-stack word scramble game with authentication, leaderboards, progress tracking, and gamification features.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- A [Neon](https://console.neon.tech) PostgreSQL database (free tier works)

### 1. Clone & Install

```bash
cd "word scramble"
npm run install:all
```

### 2. Configure Environment

```bash
cp .env.example server/.env
```

Edit `server/.env` and fill in:

```env
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=your-random-secret-string-at-least-32-chars
PORT=5000
CLIENT_URL=http://localhost:5173
```

> Get your `DATABASE_URL` from your [Neon dashboard](https://console.neon.tech) → Connection string.

### 3. Initialize Database

The database tables are created automatically on first request. Or run manually:

```bash
cd server && node db/setup.js
```

### 4. Start Development

```bash
# From root directory — starts both server and client:
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api

---

## 📁 Project Structure

```
word-scramble/
├── server/                 # Node.js + Express backend
│   ├── index.js            # Server entry point
│   ├── db.js               # Neon database connection + schema
│   ├── middleware/
│   │   └── auth.js         # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js         # Register / Login / Me
│   │   ├── game.js         # Words, submit, hints
│   │   ├── leaderboard.js  # Global rankings
│   │   ├── progress.js     # User stats & charts
│   │   └── profile.js      # Profile view & update
│   └── data/
│       └── words.js        # 240+ words across 4 categories × 3 difficulties
│
└── client/                 # React + Vite frontend
    └── src/
        ├── App.jsx          # Router + auth guard
        ├── index.css        # Complete design system (blue/purple theme)
        ├── context/
        │   └── AuthContext.jsx
        ├── pages/
        │   ├── Landing.jsx   # Public marketing page
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── Game.jsx      # Full game with timer, hints, sounds
        │   ├── Progress.jsx  # Charts & stats dashboard
        │   ├── Leaderboard.jsx
        │   └── Profile.jsx
        └── components/
            └── Navbar.jsx
```

---

## 🎮 Features

| Feature | Details |
|---------|---------|
| **Authentication** | JWT-based, password hashing with bcryptjs |
| **Gameplay** | 10 words/game, 30s timer, instant feedback |
| **Sound Effects** | Web Audio API (correct/wrong/tick) |
| **Confetti** | Fires on ≥70% accuracy |
| **Hints** | 2 hints/day, stored in DB |
| **Skip** | 3 skips per game |
| **Scoring** | +10 base, +1–5 time bonus, ×1.5 medium, ×2 hard |
| **Categories** | General, Technology, Sports, Science |
| **Difficulties** | Easy (4-5 letters), Medium (6-8), Hard (9+) |
| **Leaderboard** | Global rankings with podium display |
| **Progress** | Bar, pie, and line charts via Recharts |
| **Local Backup** | Last 20 games saved to localStorage |
| **Responsive** | Mobile + desktop, hamburger menu |

---

## 🗄️ Database Schema

```sql
users         (id, name, email, password_hash, avatar_url, created_at)
games         (id, user_id, category, difficulty, total_score, correct_answers, total_questions, played_at)
scores        (id, user_id, game_id, word, result, time_taken, score, category, difficulty, created_at)
hints_usage   (id, user_id, usage_date, hints_used)
```

---

## 🌐 API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/auth/me` | Yes | Current user |
| GET | `/api/game/word` | Yes | Get scrambled word |
| POST | `/api/game/start` | Yes | Start game session |
| POST | `/api/game/submit` | Yes | Submit answer |
| POST | `/api/game/hint` | Yes | Use a hint |
| GET | `/api/game/hint-status` | Yes | Hints remaining today |
| GET | `/api/leaderboard` | Yes | Global rankings |
| GET | `/api/progress` | Yes | User stats |
| GET | `/api/profile` | Yes | Profile data |
| PUT | `/api/profile` | Yes | Update profile |

---

## 🚢 Deployment

### Backend (e.g., Railway, Render, Fly.io)
1. Set all environment variables from `.env.example`
2. Deploy `server/` directory
3. Start command: `node index.js`

### Frontend (e.g., Vercel, Netlify)
1. Build: `cd client && npm run build`
2. Publish directory: `client/dist`
3. Set `VITE_API_URL` if backend is on different domain and update `vite.config.js` proxy accordingly

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router v6, Recharts, react-confetti, Axios
- **Backend**: Node.js, Express
- **Database**: Neon (PostgreSQL) via `@neondatabase/serverless`
- **Auth**: JWT + bcryptjs
- **Styling**: Pure CSS (no framework) with CSS custom properties
