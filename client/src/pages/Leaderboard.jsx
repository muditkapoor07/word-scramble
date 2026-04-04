import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const MEDAL_COLORS = { 1: '#fbbf24', 2: '#94a3b8', 3: '#b45309' };

export default function Leaderboard() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/leaderboard')
      .then(res => {
        setData(res.data.leaderboard);
        setUserRank(res.data.userRank);
      })
      .catch(() => setError('Failed to load leaderboard'))
      .finally(() => setLoading(false));
  }, []);

  const getInitials = name => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  if (loading) {
    return (
      <div className="page flex-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container-md">
        <div className="page-header">
          <h1 className="page-title">🏆 Leaderboard</h1>
          <p className="page-subtitle">Top players ranked by total score</p>
        </div>

        {userRank && (
          <div className="card mb-3" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>📍</span>
              <div>
                <div style={{ fontWeight: 600 }}>Your Global Rank</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  You are ranked <strong style={{ color: 'var(--primary-light)' }}>#{userRank}</strong> out of all players
                </div>
              </div>
            </div>
          </div>
        )}

        {error && <div className="alert alert-error mb-3">{error}</div>}

        {/* Top 3 podium */}
        {data.length >= 3 && (
          <div className="mb-4" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '1rem' }}>
            {/* 2nd place */}
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <div className="player-avatar" style={{ width: 50, height: 50, fontSize: '1.1rem', margin: '0 auto', background: 'linear-gradient(135deg, #e2e8f0, #94a3b8)' }}>
                  {data[1]?.avatar_url ? <img src={data[1].avatar_url} alt="" /> : getInitials(data[1]?.name)}
                </div>
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>
                {data[1]?.name?.split(' ')[0]}
              </div>
              <div style={{
                background: 'linear-gradient(to top, #e2e8f0, #94a3b8)',
                color: '#1a1a1a',
                borderRadius: '8px 8px 0 0',
                padding: '1rem 0.5rem',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                fontSize: '1.1rem',
                height: 80,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}>
                🥈 {data[1]?.total_score}
              </div>
            </div>

            {/* 1st place */}
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>👑</div>
              <div style={{ marginBottom: '0.5rem' }}>
                <div className="player-avatar" style={{ width: 60, height: 60, fontSize: '1.3rem', margin: '0 auto', background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', boxShadow: '0 4px 20px rgba(251,191,36,0.4)' }}>
                  {data[0]?.avatar_url ? <img src={data[0].avatar_url} alt="" /> : getInitials(data[0]?.name)}
                </div>
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                {data[0]?.name?.split(' ')[0]}
              </div>
              <div style={{
                background: 'linear-gradient(to top, #fbbf24, #f59e0b)',
                color: '#1a1a1a',
                borderRadius: '8px 8px 0 0',
                padding: '1rem 0.5rem',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                fontSize: '1.2rem',
                height: 110,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}>
                🥇 {data[0]?.total_score}
              </div>
            </div>

            {/* 3rd place */}
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <div className="player-avatar" style={{ width: 46, height: 46, fontSize: '1rem', margin: '0 auto', background: 'linear-gradient(135deg, #c97b3f, #b45309)' }}>
                  {data[2]?.avatar_url ? <img src={data[2].avatar_url} alt="" /> : getInitials(data[2]?.name)}
                </div>
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>
                {data[2]?.name?.split(' ')[0]}
              </div>
              <div style={{
                background: 'linear-gradient(to top, #c97b3f, #b45309)',
                color: 'white',
                borderRadius: '8px 8px 0 0',
                padding: '1rem 0.5rem',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                fontSize: '1rem',
                height: 60,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}>
                🥉 {data[2]?.total_score}
              </div>
            </div>
          </div>
        )}

        {/* Full table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="leaderboard-row header">
            <div>Rank</div>
            <div>Player</div>
            <div>Score</div>
            <div>Accuracy</div>
          </div>

          {data.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No players yet. Be the first!
            </div>
          ) : (
            data.map((player, i) => {
              const rank = parseInt(player.rank);
              const isCurrentUser = player.id === user?.id;
              const accuracy = player.total_answers > 0
                ? Math.round((player.correct_answers / player.total_answers) * 100)
                : 0;

              return (
                <div
                  key={player.id}
                  className={`leaderboard-row${isCurrentUser ? ' current-user' : ''}`}
                >
                  <div>
                    {rank <= 3 ? (
                      <div className={`rank-badge rank-${rank}`}>{rank}</div>
                    ) : (
                      <div className="rank-badge rank-other">#{rank}</div>
                    )}
                  </div>
                  <div className="player-info">
                    <div className="player-avatar">
                      {player.avatar_url ? <img src={player.avatar_url} alt="" /> : getInitials(player.name)}
                    </div>
                    <div>
                      <div className="player-name">
                        {player.name}
                        {isCurrentUser && (
                          <span style={{ marginLeft: '0.4rem', fontSize: '0.75rem', background: 'rgba(99,102,241,0.2)', color: 'var(--primary-light)', padding: '0.1rem 0.4rem', borderRadius: 4 }}>
                            You
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="score-value">
                    ⭐ {player.total_score}
                  </div>
                  <div className="accuracy-value">
                    {accuracy}% ({player.correct_answers}/{player.total_answers})
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
