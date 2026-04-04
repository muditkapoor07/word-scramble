import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', avatar_url: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/profile')
      .then(res => {
        setProfile(res.data);
        setForm({ name: res.data.name, avatar_url: res.data.avatar_url || '' });
      })
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const res = await api.put('/profile', form);
      setProfile(prev => ({ ...prev, ...res.data.user }));
      updateUser(res.data.user);
      setEditing(false);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = name => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  if (loading) {
    return <div className="page flex-center"><div className="spinner" /></div>;
  }

  const accuracy = profile?.total_answers > 0
    ? Math.round((profile.correct_answers / profile.total_answers) * 100)
    : 0;

  return (
    <div className="page">
      <div className="container-sm">
        <div className="page-header">
          <h1 className="page-title">👤 Profile</h1>
          <p className="page-subtitle">Manage your account and view your stats</p>
        </div>

        {message && <div className="alert alert-success mb-3">✅ {message}</div>}
        {error && <div className="alert alert-error mb-3">⚠️ {error}</div>}

        {/* Profile header */}
        <div className="profile-header-card mb-3">
          <div className="profile-avatar-large">
            {profile?.avatar_url
              ? <img src={profile.avatar_url} alt={profile.name} />
              : getInitials(profile?.name)
            }
          </div>
          <div style={{ flex: 1 }}>
            <div className="profile-name">{profile?.name}</div>
            <div className="profile-email">📧 {profile?.email}</div>
            <div className="profile-joined">
              🗓️ Member since {profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString('en', { month: 'long', year: 'numeric' })
                : 'recently'
              }
            </div>
          </div>
          {!editing && (
            <button className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}>
              ✏️ Edit
            </button>
          )}
        </div>

        {/* Edit form */}
        {editing && (
          <div className="card mb-3 animate-scale-in">
            <h3 style={{ marginBottom: '1.25rem', fontWeight: 600 }}>✏️ Edit Profile</h3>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Display Name</label>
                <input
                  type="text"
                  className="input"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Your name"
                  required
                  maxLength={100}
                />
              </div>
              <div className="form-group">
                <label>Avatar URL (optional)</label>
                <input
                  type="url"
                  className="input"
                  value={form.avatar_url}
                  onChange={e => setForm(f => ({ ...f, avatar_url: e.target.value }))}
                  placeholder="https://..."
                />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Link to a profile image (JPG, PNG, etc.)
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? '⏳ Saving...' : '💾 Save Changes'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => {
                  setEditing(false);
                  setForm({ name: profile?.name, avatar_url: profile?.avatar_url || '' });
                }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stats summary */}
        <div className="card mb-3">
          <h3 style={{ fontWeight: 600, marginBottom: '1.25rem' }}>📊 Your Statistics</h3>
          <div className="grid-2">
            <div style={{ padding: '0.75rem', background: 'rgba(99,102,241,0.08)', borderRadius: 10 }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Score</div>
              <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.5rem', color: 'var(--primary-light)' }}>
                ⭐ {profile?.total_score || 0}
              </div>
            </div>
            <div style={{ padding: '0.75rem', background: 'rgba(16,185,129,0.08)', borderRadius: 10 }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Accuracy</div>
              <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.5rem', color: '#10b981' }}>
                🎯 {accuracy}%
              </div>
            </div>
            <div style={{ padding: '0.75rem', background: 'rgba(245,158,11,0.08)', borderRadius: 10 }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Games Played</div>
              <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.5rem', color: '#f59e0b' }}>
                🎮 {profile?.total_games || 0}
              </div>
            </div>
            <div style={{ padding: '0.75rem', background: 'rgba(139,92,246,0.08)', borderRadius: 10 }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Correct Answers</div>
              <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.5rem', color: '#8b5cf6' }}>
                ✅ {profile?.correct_answers || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Accuracy progress bar */}
        <div className="card">
          <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>🎯 Accuracy Rate</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Overall accuracy</span>
            <span style={{ fontWeight: 700, color: 'var(--primary-light)' }}>{accuracy}%</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${accuracy}%` }} />
          </div>
          <div style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {profile?.correct_answers || 0} correct out of {profile?.total_answers || 0} total answers
          </div>

          {accuracy >= 90 && <div className="alert alert-success mt-2">🏆 Outstanding! You're a word master!</div>}
          {accuracy >= 70 && accuracy < 90 && <div className="alert alert-success mt-2">🌟 Great job! Keep it up!</div>}
          {accuracy >= 50 && accuracy < 70 && <div className="alert alert-warning mt-2">💪 Good progress! Practice more!</div>}
          {profile?.total_answers > 0 && accuracy < 50 && <div className="alert alert-warning mt-2">📚 Keep practicing to improve!</div>}
        </div>
      </div>
    </div>
  );
}
