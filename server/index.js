require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { setupDatabase } = require('./db');
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/game');
const leaderboardRoutes = require('./routes/leaderboard');
const profileRoutes = require('./routes/profile');
const progressRoutes = require('./routes/progress');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/progress', progressRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

setupDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Word Scramble server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to set up database:', err);
    process.exit(1);
  });
