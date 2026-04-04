import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  { icon: '🧩', title: 'Multiple Levels', desc: 'Progress from Easy to Hard as you improve your vocabulary and speed.' },
  { icon: '📚', title: 'Rich Categories', desc: 'Choose from General, Technology, Sports, Science and more.' },
  { icon: '🏆', title: 'Leaderboard', desc: 'Compete globally and claim your spot at the top of the rankings.' },
  { icon: '⏱️', title: 'Timed Challenges', desc: 'Race against the clock and earn bonus points for fast answers.' },
  { icon: '💡', title: 'Hint System', desc: 'Stuck? Use your daily hints wisely to reveal letters or definitions.' },
  { icon: '📊', title: 'Track Progress', desc: 'Detailed stats, streaks, and charts to visualize your improvement.' },
];

const STEPS = [
  { n: '1', title: 'Sign Up', desc: 'Create your free account in seconds' },
  { n: '2', title: 'Choose Category', desc: 'Pick your topic and difficulty level' },
  { n: '3', title: 'Unscramble', desc: 'Type the correct word before time runs out' },
  { n: '4', title: 'Compete', desc: 'Rack up points and climb the leaderboard' },
];

const TESTIMONIALS = [
  {
    text: '"I\'ve improved my vocabulary so much in just two weeks! The timed challenges keep me hooked."',
    name: 'Sarah M.', role: 'Student', initials: 'SM',
  },
  {
    text: '"The technology category is perfect for my CS revision. Great app for learning while having fun!"',
    name: 'James K.', role: 'Developer', initials: 'JK',
  },
  {
    text: '"Love the leaderboard feature. Nothing like a little competition to motivate you to play more!"',
    name: 'Priya R.', role: 'Teacher', initials: 'PR',
  },
];

const FLOAT_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const floatRef = useRef(null);

  useEffect(() => {
    if (user) { navigate('/game'); return; }

    const container = floatRef.current;
    if (!container) return;

    const letters = [];
    for (let i = 0; i < 15; i++) {
      const el = document.createElement('div');
      el.className = 'float-letter';
      el.textContent = FLOAT_LETTERS[Math.floor(Math.random() * FLOAT_LETTERS.length)];
      el.style.left = `${Math.random() * 100}%`;
      el.style.animationDuration = `${1.8 + Math.random() * 2.5}s`;
      el.style.animationDelay = `${Math.random() * 2}s`;
      el.style.fontSize = `${3 + Math.random() * 4}rem`;
      const colors = ['#a78bfa', '#818cf8', '#c4b5fd', '#7dd3fc', '#f0abfc'];
      el.style.color = colors[Math.floor(Math.random() * colors.length)];
      el.style.opacity = '0';
      container.appendChild(el);
      letters.push(el);
    }
    return () => letters.forEach(el => el.remove());
  }, [user, navigate]);

  return (
    <div className="landing">
      {/* Hero */}
      <section className="hero">
        <div className="floating-letters" ref={floatRef} />
        <div className="hero-content">
          <div className="hero-badge">
            <span>✨</span> Free to Play — No credit card required
          </div>
          <h1 className="hero-title">
            <span className="word-gradient">Word</span>{' '}
            <br />Scramble
          </h1>
          <p className="hero-tagline">Unscramble. Learn. Compete.</p>
          <div className="hero-cta">
            <Link to="/register" className="btn btn-primary btn-lg">
              🚀 Get Started Free
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Sign In
            </Link>
          </div>
        </div>
        <div className="hero-scroll">
          <span>Scroll to explore</span>
          <div className="scroll-dot" />
        </div>
      </section>

      {/* Features */}
      <section className="landing-section" style={{ background: 'rgba(0,0,0,0.2)' }}>
        <div className="container">
          <h2 className="section-title gradient-text">Everything You Need</h2>
          <p className="section-subtitle">Packed with features to make learning fun and addictive</p>
          <div className="grid-3">
            {FEATURES.map((f, i) => (
              <div className="feature-card animate-fade-in" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                <span className="feature-icon">{f.icon}</span>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="landing-section">
        <div className="container">
          <h2 className="section-title gradient-text">How It Works</h2>
          <p className="section-subtitle">Up and scrambling in under a minute</p>
          <div className="steps-container">
            {STEPS.map((s, i) => (
              <div className="step" key={i}>
                <div className="step-number">{s.n}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="landing-section" style={{ background: 'rgba(0,0,0,0.2)' }}>
        <div className="container">
          <h2 className="section-title gradient-text">What Players Say</h2>
          <p className="section-subtitle">Join thousands of word enthusiasts</p>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div className="testimonial-card" key={i}>
                <div className="testimonial-stars">★★★★★</div>
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.initials}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <div className="container">
          <h2 className="section-title" style={{ marginBottom: '1rem' }}>
            Ready to <span className="gradient-text">Unscramble?</span>
          </h2>
          <p className="section-subtitle">Start your word journey today — it's completely free</p>
          <Link to="/register" className="btn btn-primary btn-lg">
            🎮 Play Now — It's Free
          </Link>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="container">
          <p>🔤 Word Scramble — Unscramble. Learn. Compete.</p>
          <p style={{ marginTop: '0.5rem' }}>Made with ❤️ for word lovers everywhere</p>
        </div>
      </footer>
    </div>
  );
}
