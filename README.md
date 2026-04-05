# 🔤 Word Scramble

> **Unscramble. Learn. Compete.**

---

## 🧠 What This Project Does (Plain English)

Word Scramble is an online word game where letters of a word are shuffled up, and your job is to put them back in the right order — before the timer runs out!

Think of it as a tool that:

- **Takes in** a category and difficulty you choose (like "Technology" on "Hard")
- **Shows you** a scrambled word with a ticking countdown timer
- **Gives back** your score, tells you if you were right, and tracks your progress over time

You can play against yourself, climb the global leaderboard, and see how you improve over time — all inside a slick, dark-themed web app.

---

## ✨ Key Features

### 🎮 Gameplay
| Feature | Details |
|---|---|
| 🔤 Word Scramble | Unscramble 10 words per game with a live countdown timer |
| 🧩 Drag & Click Tiles | Build your answer by dragging or clicking letter tiles — or just type it |
| 🔁 No Repeated Words | Fresh set of words every game in the same category |
| 🔊 Sound Effects | Audio feedback for correct/wrong answers and the ticking timer |

### 📚 Categories & Difficulty
| Category | Difficulty | Word Length |
|---|---|---|
| 📖 General | 🌱 Easy | 4–5 letters |
| 💻 Technology | ⚡ Medium | 6–8 letters |
| ⚽ Sports | 🔥 Hard | 9+ letters |
| 🔬 Science | | |

### 🏆 Scoring & Progress
| Feature | Details |
|---|---|
| 💡 Hints & Skips | Use hints when stuck; 3 skips allowed per game |
| ⭐ Smart Scoring | Points based on how fast you answer and how hard the difficulty is |
| 🥇 Leaderboard | See where you rank against all players globally |
| 📊 Progress Dashboard | Charts showing your scores and accuracy over time |
| 👤 User Accounts | Register, log in, and update your profile |

---

## ⚙️ How It Works

1. You **register or log in** to your account
2. On the Play page, **choose a category** (e.g. Science) and a **difficulty** (e.g. Medium)
3. The game loads **10 scrambled words** — each on a timer
4. You **drag tiles** or **type** your answer and hit Submit
5. Get it right → points added, move to the next word
6. Wrong or time's up → the correct answer is shown, then move on
7. After 10 words → see your final score, accuracy, and a word-by-word review
8. Your results are **saved to the leaderboard and your progress dashboard**

---

## 🚀 How to Use It

### Step 1: Setup

Clone the repository:

```bash
git clone https://github.com/muditkapoor07/word-scramble.git
cd word-scramble
```

Install all dependencies (frontend + backend in one command):

```bash
npm run install:all
```

### Step 2: Configure Environment

```bash
cp .env.example server/.env
```

Open `server/.env` and fill in your values:

```env
DATABASE_URL=postgresql://user:pass@your-neon-host/neondb?sslmode=require
JWT_SECRET=any-long-random-string-at-least-32-characters
PORT=5001
CLIENT_URL=http://localhost:5174
```

> 💡 Get a free `DATABASE_URL` from [neon.tech](https://neon.tech) → create a project → copy the connection string.

### Step 3: Start the App

```bash
npm run dev
```

This starts both the backend and frontend together.

- **App (Frontend):** http://localhost:5174
- **API (Backend):** http://localhost:5001/api

### Step 4: Play!

1. Open http://localhost:5174 in your browser
2. Click **Get Started** to register an account
3. Go to **Play**, pick a category and difficulty
4. Hit **Start Game** and unscramble away!

---

## 🧩 Example Usage

You select **Technology** + **Hard** difficulty and start a game.

- The game shows you: `TMOIAGRLH`
- You drag the tiles to spell: `ALGORITHM`
- ✅ Correct! You earn points based on how fast you answered
- After 10 words, your score is saved and you appear on the leaderboard

---

## 🛠️ Configuration

All configuration lives in `server/.env`:

| Variable | What it does |
|----------|-------------|
| `DATABASE_URL` | Your Neon PostgreSQL connection string |
| `JWT_SECRET` | Secret key used to sign login tokens (keep this private) |
| `PORT` | Port the backend runs on (default: 5001) |
| `CLIENT_URL` | URL of the frontend (used for security settings) |

For production (e.g. Render), also set `VITE_API_URL` on the frontend:

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## 📂 Project Structure

```
word-scramble/
│
├── server/                   # Backend — Node.js + Express
│   ├── index.js              # Server entry point
│   ├── db.js                 # Database connection & table setup
│   ├── middleware/
│   │   └── auth.js           # Login/token checking
│   ├── routes/
│   │   ├── auth.js           # Register & Login
│   │   ├── game.js           # Game logic (words, scoring, hints)
│   │   ├── leaderboard.js    # Global rankings
│   │   ├── progress.js       # Your stats over time
│   │   └── profile.js        # View & edit your profile
│   └── data/
│       └── words.js          # 180 words across 4 categories × 3 difficulties
│
├── client/                   # Frontend — React + Vite
│   └── src/
│       ├── pages/
│       │   ├── Landing.jsx   # Home/marketing page
│       │   ├── Login.jsx     # Sign in
│       │   ├── Register.jsx  # Create account
│       │   ├── Game.jsx      # The actual game
│       │   ├── Progress.jsx  # Your stats & charts
│       │   ├── Leaderboard.jsx
│       │   └── Profile.jsx
│       ├── context/
│       │   └── AuthContext.jsx  # Keeps you logged in across pages
│       └── components/
│           └── Navbar.jsx
│
├── package.json              # Root scripts (run both server + client)
├── .env.example              # Template for your environment variables
└── README.md                 # This file
```

---

## 💡 Who Is This For?

- **Students** who want to improve vocabulary in a fun way
- **Developers** looking for a full-stack project example with auth, database, and charts
- **Beginners** who want to see how a real React + Node.js app is built end to end
- **Anyone** who enjoys word games!

---

## ⚠️ Notes

- Make sure **Node.js 18 or higher** is installed
- You need a free [Neon](https://neon.tech) account for the database — no credit card required
- The database tables are created **automatically** when the server starts for the first time
- Keep your `JWT_SECRET` and `DATABASE_URL` private — never commit them to GitHub

---

## 🌐 Live Demo

- **Frontend:** https://word-scramble-static.onrender.com
- **Backend API:** https://word-scramble-04sa.onrender.com/api/health

---

## 📌 Summary

Word Scramble helps you exercise your brain and vocabulary by:

- Making word puzzles fun and competitive
- Tracking your improvement with charts
- Letting you race against a timer for extra challenge
- Saving your scores so you can beat your own record

**Stack:** React · Vite · Node.js · Express · PostgreSQL (Neon) · JWT Auth
