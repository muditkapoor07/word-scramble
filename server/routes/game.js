const express = require('express');
const { sql } = require('../db');
const { authenticateToken } = require('../middleware/auth');
const { getWord, getWords, getCategories } = require('../data/words');

const HINT_LIMITS = { easy: 2, medium: 3, hard: 4 };

const router = express.Router();

router.get('/word', authenticateToken, (req, res) => {
  try {
    const { category = 'general', difficulty = 'easy' } = req.query;
    const wordData = getWord(category, difficulty);
    res.json(wordData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/categories', authenticateToken, (req, res) => {
  res.json(getCategories());
});

// Fetch a batch of unique words for a full game (no repeats)
router.get('/words', authenticateToken, (req, res) => {
  try {
    const { category = 'general', difficulty = 'easy', count = 10 } = req.query;
    const wordList = getWords(category, difficulty, parseInt(count));
    res.json(wordList);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/submit', authenticateToken, async (req, res) => {
  try {
    const { word, answer, time_taken, category, difficulty, game_id } = req.body;
    const userId = req.user.id;

    if (!word || !answer || time_taken === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const correct = answer.toUpperCase().trim() === word.toUpperCase().trim();

    let score = 0;
    if (correct) {
      score = 10;
      if (time_taken <= 5) score += 5;
      else if (time_taken <= 10) score += 3;
      else if (time_taken <= 15) score += 1;

      if (difficulty === 'medium') score = Math.floor(score * 1.5);
      if (difficulty === 'hard') score = Math.floor(score * 2);
    }

    await sql`
      INSERT INTO ws_scores (user_id, game_id, word, result, time_taken, score, category, difficulty)
      VALUES (${userId}, ${game_id || null}, ${word}, ${correct}, ${time_taken}, ${score}, ${category}, ${difficulty})
    `;

    if (game_id) {
      await sql`
        UPDATE ws_games
        SET total_score = total_score + ${score},
            correct_answers = correct_answers + ${correct ? 1 : 0},
            total_questions = total_questions + 1
        WHERE id = ${game_id} AND user_id = ${userId}
      `;
    }

    res.json({ correct, score, word });
  } catch (err) {
    console.error('Submit error:', err);
    res.status(500).json({ error: 'Failed to submit answer' });
  }
});

router.post('/start', authenticateToken, async (req, res) => {
  try {
    const { category = 'general', difficulty = 'easy' } = req.body;
    const userId = req.user.id;

    const result = await sql`
      INSERT INTO ws_games (user_id, category, difficulty)
      VALUES (${userId}, ${category}, ${difficulty})
      RETURNING id
    `;

    res.json({ game_id: result[0].id });
  } catch (err) {
    console.error('Start game error:', err);
    res.status(500).json({ error: 'Failed to start game' });
  }
});

router.post('/hint', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { difficulty = 'easy' } = req.body;
    const today = new Date().toISOString().split('T')[0];
    const MAX_HINTS = HINT_LIMITS[difficulty] || 2;

    const existing = await sql`
      SELECT hints_used FROM ws_hints_usage
      WHERE user_id = ${userId} AND usage_date = ${today}
    `;

    if (existing.length > 0 && existing[0].hints_used >= MAX_HINTS) {
      return res.status(429).json({ error: 'Hint limit reached', hints_remaining: 0 });
    }

    if (existing.length === 0) {
      await sql`INSERT INTO ws_hints_usage (user_id, usage_date, hints_used) VALUES (${userId}, ${today}, 1)`;
    } else {
      await sql`UPDATE ws_hints_usage SET hints_used = hints_used + 1 WHERE user_id = ${userId} AND usage_date = ${today}`;
    }

    const hintsUsed = existing.length > 0 ? existing[0].hints_used + 1 : 1;
    res.json({ success: true, hints_remaining: MAX_HINTS - hintsUsed });
  } catch (err) {
    console.error('Hint error:', err);
    res.status(500).json({ error: 'Failed to use hint' });
  }
});

router.get('/hint-status', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { difficulty = 'easy' } = req.query;
    const today = new Date().toISOString().split('T')[0];
    const MAX_HINTS = HINT_LIMITS[difficulty] || 2;

    const result = await sql`
      SELECT hints_used FROM ws_hints_usage WHERE user_id = ${userId} AND usage_date = ${today}
    `;

    const hintsUsed = result.length > 0 ? result[0].hints_used : 0;
    res.json({ hints_remaining: MAX_HINTS - hintsUsed, hints_used: hintsUsed, max: MAX_HINTS });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get hint status' });
  }
});

module.exports = router;
