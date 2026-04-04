import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts';
import api from '../utils/api';

const COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: 'rgba(15,15,35,0.95)',
        border: '1px solid rgba(99,102,241,0.3)',
        borderRadius: 8,
        padding: '0.75rem',
        fontSize: '0.85rem',
      }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '0.3rem' }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Progress() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/progress')
      .then(res => setData(res.data))
      .catch(() => setError('Failed to load progress data'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page flex-center">
        <div className="spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="container">
          <div className="alert alert-error">{error}</div>
        </div>
      </div>
    );
  }

  const weeklyData = data?.weekly_scores?.map(d => ({
    date: new Date(d.date).toLocaleDateString('en', { weekday: 'short' }),
    score: parseInt(d.daily_score),
    correct: parseInt(d.correct),
  })) || [];

  const categoryData = data?.by_category?.map(c => ({
    name: c.category?.charAt(0).toUpperCase() + c.category?.slice(1),
    score: parseInt(c.score),
    correct: parseInt(c.correct),
    total: parseInt(c.total),
  })) || [];

  const difficultyData = data?.by_difficulty?.map(d => ({
    name: d.difficulty?.charAt(0).toUpperCase() + d.difficulty?.slice(1),
    value: parseInt(d.total),
    correct: parseInt(d.correct),
  })) || [];

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">📊 Your Progress</h1>
          <p className="page-subtitle">Track your improvement and achievements</p>
        </div>

        {/* Stat cards */}
        <div className="grid-4 mb-4">
          <div className="stat-card">
            <span className="stat-icon">🎮</span>
            <div className="stat-value">{data?.total_games || 0}</div>
            <div className="stat-label">Games Played</div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">⭐</span>
            <div className="stat-value">{data?.total_score || 0}</div>
            <div className="stat-label">Total Score</div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🎯</span>
            <div className="stat-value">{data?.accuracy || 0}%</div>
            <div className="stat-label">Accuracy</div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🔥</span>
            <div className="stat-value">{data?.streak || 0}</div>
            <div className="stat-label">Day Streak</div>
          </div>
        </div>

        <div className="grid-2 mb-4">
          <div className="stat-card">
            <span className="stat-icon">✅</span>
            <div className="stat-value">{data?.correct_answers || 0}</div>
            <div className="stat-label">Correct Answers</div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🏆</span>
            <div className="stat-value">{data?.highest_game_score || 0}</div>
            <div className="stat-label">Best Game Score</div>
          </div>
        </div>

        {/* Weekly chart */}
        {weeklyData.length > 0 && (
          <div className="chart-card mb-3">
            <div className="chart-title">📈 Weekly Performance (Last 7 Days)</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weeklyData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="score" name="Score" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="correct" name="Correct" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="grid-2 mb-4">
          {/* Category breakdown */}
          {categoryData.length > 0 && (
            <div className="chart-card">
              <div className="chart-title">📚 Score by Category</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 10, bottom: 5, left: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="score" name="Score" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Difficulty distribution */}
          {difficultyData.length > 0 && (
            <div className="chart-card">
              <div className="chart-title">⚙️ Questions by Difficulty</div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={difficultyData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {difficultyData.map((_, i) => (
                      <Cell key={i} fill={['#10b981', '#f59e0b', '#ef4444'][i] || COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Accuracy bar */}
        <div className="chart-card mb-4">
          <div className="chart-title">🎯 Accuracy Overview</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span>Overall Accuracy</span>
              <span style={{ color: 'var(--primary-light)', fontWeight: 700 }}>{data?.accuracy || 0}%</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${data?.accuracy || 0}%` }} />
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {data?.correct_answers || 0} correct out of {data?.total_answers || 0} total answers
            </div>
          </div>
        </div>

        {/* Recent games */}
        {data?.recent_games?.length > 0 && (
          <div className="chart-card">
            <div className="chart-title">🕹️ Recent Games</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {data.recent_games.map((game, i) => (
                <div
                  key={game.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem 1rem',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: 10,
                    gap: '0.75rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '1.1rem' }}>
                      {game.category === 'technology' ? '💻' : game.category === 'sports' ? '⚽' : game.category === 'science' ? '🔬' : '📖'}
                    </span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', textTransform: 'capitalize' }}>
                        {game.category} — {game.difficulty}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {new Date(game.played_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: 'var(--primary-light)' }}>+{game.total_score} pts</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {game.correct_answers}/{game.total_questions} correct
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data?.total_games === 0 && (
          <div className="card text-center mt-4">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎮</div>
            <h3 style={{ marginBottom: '0.5rem' }}>No games yet!</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Play your first game to start tracking your progress.
            </p>
            <a href="/game" className="btn btn-primary">Start Playing</a>
          </div>
        )}
      </div>
    </div>
  );
}
