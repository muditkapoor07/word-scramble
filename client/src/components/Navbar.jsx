import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/game', icon: '🎮', label: 'Play' },
  { to: '/progress', icon: '📊', label: 'Progress' },
  { to: '/leaderboard', icon: '🏆', label: 'Leaderboard' },
  { to: '/profile', icon: '👤', label: 'Profile' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <NavLink to="/game" className="navbar-brand" onClick={() => setMobileOpen(false)}>
            <div className="navbar-brand-icon">🔤</div>
            Word Scramble
          </NavLink>

          <ul className="navbar-nav">
            {navItems.map(item => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li>
              <button className="nav-link btn" style={{ cursor: 'pointer' }} onClick={handleLogout}>
                <span>🚪</span>
                Logout
              </button>
            </li>
          </ul>

          <button
            className="navbar-hamburger"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span className="hamburger-line" style={{ transform: mobileOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} />
            <span className="hamburger-line" style={{ opacity: mobileOpen ? 0 : 1 }} />
            <span className="hamburger-line" style={{ transform: mobileOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
          </button>
        </div>
      </nav>

      <div className={`navbar-mobile${mobileOpen ? ' open' : ''}`}>
        <div style={{ marginBottom: '1rem', padding: '0 0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Signed in as <strong style={{ color: 'var(--text-primary)' }}>{user?.name}</strong>
        </div>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
        <button className="nav-link btn" style={{ cursor: 'pointer', justifyContent: 'flex-start' }} onClick={handleLogout}>
          <span>🚪</span>
          Logout
        </button>
      </div>
    </>
  );
}
