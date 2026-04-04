const express = require('express');
const { sql } = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await sql`
      SELECT u.id, u.name, u.email, u.avatar_url, u.created_at,
        COALESCE(SUM(s.score), 0) AS total_score,
        COUNT(CASE WHEN s.result = true THEN 1 END) AS correct_answers,
        COUNT(s.id) AS total_answers,
        COUNT(DISTINCT g.id) AS total_games
      FROM ws_users u
      LEFT JOIN ws_scores s ON s.user_id = u.id
      LEFT JOIN ws_games g ON g.user_id = u.id
      WHERE u.id = ${req.user.id}
      GROUP BY u.id, u.name, u.email, u.avatar_url, u.created_at
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result[0];
    const accuracy = user.total_answers > 0
      ? Math.round((user.correct_answers / user.total_answers) * 100)
      : 0;

    res.json({ ...user, accuracy });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.put('/', authenticateToken, async (req, res) => {
  try {
    const { name, avatar_url } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (name.trim().length > 100) {
      return res.status(400).json({ error: 'Name too long (max 100 characters)' });
    }

    const result = await sql`
      UPDATE ws_users
      SET name = ${name.trim()},
          avatar_url = ${avatar_url || null}
      WHERE id = ${req.user.id}
      RETURNING id, name, email, avatar_url
    `;

    res.json({ user: result[0] });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
