const express = require('express');
const { sql } = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const rows = await sql`
      SELECT
        u.id,
        u.name,
        u.avatar_url,
        COALESCE(SUM(s.score), 0) AS total_score,
        COUNT(CASE WHEN s.result = true THEN 1 END) AS correct_answers,
        COUNT(s.id) AS total_answers,
        RANK() OVER (ORDER BY COALESCE(SUM(s.score), 0) DESC) AS rank
      FROM ws_users u
      LEFT JOIN ws_scores s ON s.user_id = u.id
      GROUP BY u.id, u.name, u.avatar_url
      ORDER BY total_score DESC
      LIMIT ${parseInt(limit)}
    `;

    const userRankResult = await sql`
      SELECT rank FROM (
        SELECT
          u.id,
          RANK() OVER (ORDER BY COALESCE(SUM(s.score), 0) DESC) AS rank
        FROM ws_users u
        LEFT JOIN ws_scores s ON s.user_id = u.id
        GROUP BY u.id
      ) ranked
      WHERE id = ${req.user.id}
    `;

    const userRank = userRankResult.length > 0 ? userRankResult[0].rank : null;

    res.json({ leaderboard: rows, userRank });
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

module.exports = router;
