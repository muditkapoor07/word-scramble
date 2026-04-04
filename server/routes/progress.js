const express = require('express');
const { sql } = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await sql`
      SELECT
        COUNT(DISTINCT g.id) AS total_games,
        COALESCE(SUM(s.score), 0) AS total_score,
        COUNT(CASE WHEN s.result = true THEN 1 END) AS correct_answers,
        COUNT(s.id) AS total_answers,
        COALESCE(MAX(g.total_score), 0) AS highest_game_score
      FROM ws_users u
      LEFT JOIN ws_games g ON g.user_id = u.id
      LEFT JOIN ws_scores s ON s.user_id = u.id
      WHERE u.id = ${userId}
    `;

    const stat = stats[0];
    const accuracy = stat.total_answers > 0
      ? Math.round((stat.correct_answers / stat.total_answers) * 100)
      : 0;

    const byCategory = await sql`
      SELECT
        category,
        COUNT(id) AS total,
        COUNT(CASE WHEN result = true THEN 1 END) AS correct,
        COALESCE(SUM(score), 0) AS score
      FROM ws_scores
      WHERE user_id = ${userId}
      GROUP BY category
    `;

    const byDifficulty = await sql`
      SELECT
        difficulty,
        COUNT(id) AS total,
        COUNT(CASE WHEN result = true THEN 1 END) AS correct,
        COALESCE(SUM(score), 0) AS score
      FROM ws_scores
      WHERE user_id = ${userId}
      GROUP BY difficulty
    `;

    const recentGames = await sql`
      SELECT
        g.id, g.category, g.difficulty, g.total_score,
        g.correct_answers, g.total_questions, g.played_at
      FROM ws_games g
      WHERE g.user_id = ${userId}
      ORDER BY g.played_at DESC
      LIMIT 10
    `;

    const streakData = await sql`
      SELECT DISTINCT DATE(created_at) AS play_date
      FROM ws_scores
      WHERE user_id = ${userId} AND result = true
      ORDER BY play_date DESC
    `;

    let streak = 0;
    if (streakData.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let checkDate = new Date(today);

      for (const row of streakData) {
        const playDate = new Date(row.play_date);
        playDate.setHours(0, 0, 0, 0);
        const diff = Math.round((checkDate - playDate) / (1000 * 60 * 60 * 24));
        if (diff === 0 || diff === 1) {
          streak++;
          checkDate = playDate;
        } else {
          break;
        }
      }
    }

    const weeklyScores = await sql`
      SELECT
        DATE(created_at) AS date,
        COALESCE(SUM(score), 0) AS daily_score,
        COUNT(CASE WHEN result = true THEN 1 END) AS correct
      FROM ws_scores
      WHERE user_id = ${userId}
        AND created_at >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    res.json({
      total_games: parseInt(stat.total_games) || 0,
      total_score: parseInt(stat.total_score) || 0,
      correct_answers: parseInt(stat.correct_answers) || 0,
      total_answers: parseInt(stat.total_answers) || 0,
      accuracy,
      highest_game_score: parseInt(stat.highest_game_score) || 0,
      streak,
      by_category: byCategory,
      by_difficulty: byDifficulty,
      recent_games: recentGames,
      weekly_scores: weeklyScores,
    });
  } catch (err) {
    console.error('Progress error:', err);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

module.exports = router;
