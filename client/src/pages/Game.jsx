import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactConfetti from 'react-confetti';
import api from '../utils/api';

const CATEGORIES = [
  {
    id: 'general', icon: '📖', name: 'General', desc: 'Everyday words',
    color: '#818cf8', border: 'rgba(129,140,248,0.6)',
    gradient: 'linear-gradient(135deg, rgba(99,102,241,0.35) 0%, rgba(139,92,246,0.25) 100%)',
    bgIcons: ['📖', '✏️', '💬', '🔤'], bgGlow: 'rgba(99,102,241,0.25)',
  },
  {
    id: 'technology', icon: '💻', name: 'Technology', desc: 'Tech & coding',
    color: '#22d3ee', border: 'rgba(6,182,212,0.6)',
    gradient: 'linear-gradient(135deg, rgba(6,182,212,0.3) 0%, rgba(14,165,233,0.2) 100%)',
    bgIcons: ['💻', '⌨️', '🖥️', '📡'], bgGlow: 'rgba(6,182,212,0.25)',
  },
  {
    id: 'sports', icon: '⚽', name: 'Sports', desc: 'Athletic terms',
    color: '#34d399', border: 'rgba(16,185,129,0.6)',
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.3) 0%, rgba(5,150,105,0.2) 100%)',
    bgIcons: ['⚽', '🏆', '🏅', '🎽'], bgGlow: 'rgba(16,185,129,0.25)',
  },
  {
    id: 'science', icon: '🔬', name: 'Science', desc: 'Scientific words',
    color: '#fbbf24', border: 'rgba(245,158,11,0.6)',
    gradient: 'linear-gradient(135deg, rgba(245,158,11,0.3) 0%, rgba(217,119,6,0.2) 100%)',
    bgIcons: ['🔬', '⚗️', '🧬', '🔭'], bgGlow: 'rgba(245,158,11,0.25)',
  },
];

const DIFFICULTIES = [
  { id: 'easy', label: 'Easy', icon: '🌱', desc: '4–5 letters', color: '#10b981' },
  { id: 'medium', label: 'Medium', icon: '⚡', desc: '6–8 letters', color: '#f59e0b' },
  { id: 'hard', label: 'Hard', icon: '🔥', desc: '9+ letters', color: '#ef4444' },
];

const QUESTION_COUNT = 10;
const MAX_SKIPS = 3;
const TIME_CONFIG  = { easy: 30, medium: 45, hard: 60 };
const HINTS_CONFIG = { easy: 2,  medium: 3,  hard: 4  };

function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    if (type === 'correct') {
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start(); osc.stop(ctx.currentTime + 0.5);
    } else if (type === 'wrong') {
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.setValueAtTime(200, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start(); osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'tick') {
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start(); osc.stop(ctx.currentTime + 0.05);
    } else if (type === 'place') {
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start(); osc.stop(ctx.currentTime + 0.08);
    }
  } catch { /* ignore */ }
}

/* ─── GAME SETUP ─── */
function GameSetup({ onStart }) {
  const [category, setCategory] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const canStart = category !== null && difficulty !== null;

  return (
    <div className="game-setup">
      <h1 className="game-setup-title gradient-text">🎮 Start a Game</h1>
      <p className="game-setup-subtitle">Choose your category and difficulty to begin</p>

      {/* Category */}
      <div className="card mb-3">
        <h3 style={{ marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          📚 Select Category
        </h3>
        <div className="selector-grid">
          {CATEGORIES.map(cat => {
            const isSelected = category === cat.id;
            return (
              <div
                key={cat.id}
                className="selector-card category-card"
                onClick={() => setCategory(cat.id)}
                style={{
                  background: cat.gradient,
                  borderColor: isSelected ? cat.border : cat.border.replace('0.6', '0.15'),
                  boxShadow: isSelected
                    ? `0 0 28px ${cat.bgGlow}, inset 0 0 40px ${cat.bgGlow}`
                    : `inset 0 0 20px ${cat.bgGlow}`,
                  position: 'relative', overflow: 'hidden', minHeight: 130,
                  transform: isSelected ? 'translateY(-3px) scale(1.02)' : '',
                  transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                }}
              >
                {cat.bgIcons.map((ico, i) => (
                  <span key={i} style={{
                    position: 'absolute',
                    fontSize: i === 0 ? '5rem' : '2.5rem',
                    opacity: i === 0 ? 0.13 : 0.07,
                    top: i === 0 ? '-10px' : `${[55, 5, 60][i - 1]}%`,
                    right: i === 0 ? '-10px' : `${[5, 60, 55][i - 1]}%`,
                    transform: `rotate(${[-15, 20, -10, 15][i]}deg)`,
                    userSelect: 'none', pointerEvents: 'none', lineHeight: 1,
                  }}>{ico}</span>
                ))}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <span className="selector-icon" style={{ fontSize: '2.2rem' }}>{cat.icon}</span>
                  <div className="selector-name" style={{ color: cat.color }}>{cat.name}</div>
                  <div className="selector-desc">{cat.desc}</div>
                </div>
                {isSelected && (
                  <div style={{
                    position: 'absolute', top: 8, right: 10,
                    background: cat.color, color: '#000',
                    borderRadius: '50%', width: 22, height: 22,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700, zIndex: 2,
                  }}>✓</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Difficulty */}
      <div className="card mb-4">
        <h3 style={{ marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          ⚙️ Select Difficulty
        </h3>
        <div className="difficulty-grid">
          {DIFFICULTIES.map(diff => {
            const isSelected = difficulty === diff.id;
            return (
              <div
                key={diff.id}
                className={`difficulty-card ${diff.id}`}
                onClick={() => setDifficulty(diff.id)}
                style={{
                  borderColor: isSelected ? diff.color : `${diff.color}44`,
                  background: isSelected ? `${diff.color}22` : `${diff.color}0d`,
                  boxShadow: isSelected ? `0 0 22px ${diff.color}44` : 'none',
                  transform: isSelected ? 'translateY(-3px) scale(1.04)' : '',
                  transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                  position: 'relative',
                }}
              >
                <div style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>{diff.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: isSelected ? diff.color : 'var(--text-primary)' }}>{diff.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{diff.desc}</div>
                {isSelected && (
                  <div style={{
                    position: 'absolute', top: 6, right: 8,
                    background: diff.color, color: '#000',
                    borderRadius: '50%', width: 20, height: 20,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: 700,
                  }}>✓</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button
          className="btn btn-primary btn-lg"
          onClick={() => onStart(category, difficulty)}
          disabled={!canStart}
          style={{ opacity: canStart ? 1 : 0.45, cursor: canStart ? 'pointer' : 'not-allowed' }}
        >
          🚀 Start Game ({QUESTION_COUNT} Words)
        </button>
        {!canStart && (
          <p style={{ marginTop: '0.6rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            👆 Select a category and difficulty to begin
          </p>
        )}
        {canStart && (
          <p style={{ marginTop: '0.6rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            ⏱️ {TIME_CONFIG[difficulty]}s per word • {MAX_SKIPS} skips allowed
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── DRAG + CLICK LETTER BUILDER ─── */
function LetterBuilder({ scrambled, onAnswerChange }) {
  const wordLen = scrambled.length;
  const [available, setAvailable] = useState(() =>
    scrambled.split('').map((l, i) => ({ id: i, letter: l }))
  );
  const [slots, setSlots] = useState(() => Array(wordLen).fill(null));
  const [dragSrc, setDragSrc] = useState(null); // { type:'avail'|'slot', id, slotIndex }
  const [dragOverSlot, setDragOverSlot] = useState(null);

  useEffect(() => {
    const word = slots.map(s => s?.letter || '').join('');
    onAnswerChange(word);
  }, [slots]);

  useEffect(() => {
    setAvailable(scrambled.split('').map((l, i) => ({ id: i, letter: l })));
    setSlots(Array(wordLen).fill(null));
  }, [scrambled]);

  /* ── Click handlers ── */
  const clickAvail = (item) => {
    const nextEmpty = slots.findIndex(s => s === null);
    if (nextEmpty === -1) return;
    playSound('place');
    setAvailable(prev => prev.filter(a => a.id !== item.id));
    setSlots(prev => { const n = [...prev]; n[nextEmpty] = item; return n; });
  };

  const clickSlot = (si) => {
    const item = slots[si];
    if (!item) return;
    playSound('place');
    setSlots(prev => { const n = [...prev]; n[si] = null; return n; });
    setAvailable(prev => [...prev, item]);
  };

  /* ── Drag from available tile ── */
  const onDragStartAvail = (e, item) => {
    setDragSrc({ type: 'avail', id: item.id, letter: item.letter });
    e.dataTransfer.effectAllowed = 'move';
  };

  /* ── Drag from slot tile ── */
  const onDragStartSlot = (e, si) => {
    const item = slots[si];
    if (!item) return;
    setDragSrc({ type: 'slot', id: item.id, letter: item.letter, slotIndex: si });
    e.dataTransfer.effectAllowed = 'move';
  };

  /* ── Drop onto a slot ── */
  const onDropSlot = (e, si) => {
    e.preventDefault();
    setDragOverSlot(null);
    if (!dragSrc) return;

    if (dragSrc.type === 'avail') {
      const item = { id: dragSrc.id, letter: dragSrc.letter };
      const displaced = slots[si];
      setAvailable(prev => {
        const next = prev.filter(a => a.id !== item.id);
        return displaced ? [...next, displaced] : next;
      });
      setSlots(prev => { const n = [...prev]; n[si] = item; return n; });
    } else {
      const fromSi = dragSrc.slotIndex;
      if (fromSi === si) return;
      setSlots(prev => {
        const n = [...prev];
        const displaced = n[si];
        n[si] = n[fromSi];
        n[fromSi] = displaced;
        return n;
      });
    }
    playSound('place');
    setDragSrc(null);
  };

  /* ── Drop back to available pool ── */
  const onDropAvailPool = (e) => {
    e.preventDefault();
    if (!dragSrc || dragSrc.type !== 'slot') return;
    const si = dragSrc.slotIndex;
    const item = slots[si];
    if (!item) return;
    setSlots(prev => { const n = [...prev]; n[si] = null; return n; });
    setAvailable(prev => [...prev, item]);
    playSound('place');
    setDragSrc(null);
  };

  const clearAll = () => {
    setAvailable(scrambled.split('').map((l, i) => ({ id: i, letter: l })));
    setSlots(Array(wordLen).fill(null));
  };

  return (
    <div>
      {/* Answer slots */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>
          Your answer:
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {slots.map((item, si) => (
            <div
              key={si}
              onDragOver={e => { e.preventDefault(); setDragOverSlot(si); }}
              onDragLeave={() => setDragOverSlot(null)}
              onDrop={e => onDropSlot(e, si)}
              onClick={() => clickSlot(si)}
              draggable={!!item}
              onDragStart={item ? e => onDragStartSlot(e, si) : undefined}
              style={{
                width: 52, height: 62,
                border: `2px dashed ${item ? '#6366f1' : dragOverSlot === si ? '#a78bfa' : 'rgba(255,255,255,0.2)'}`,
                borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: item
                  ? 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))'
                  : dragOverSlot === si ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.03)',
                cursor: item ? 'pointer' : 'default',
                transition: 'all 0.15s ease',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '1.4rem', fontWeight: 700,
                color: item ? '#fff' : 'transparent',
                boxShadow: item ? '0 2px 12px rgba(99,102,241,0.3)' : 'none',
                userSelect: 'none',
              }}
            >
              {item?.letter}
            </div>
          ))}
        </div>
      </div>

      {/* Available scrambled letters */}
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={onDropAvailPool}
        style={{ minHeight: 80 }}
      >
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>
          Scrambled letters — click or drag:
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', minHeight: 70 }}>
          {available.map(item => (
            <div
              key={item.id}
              draggable
              onDragStart={e => onDragStartAvail(e, item)}
              onDragEnd={() => setDragSrc(null)}
              onClick={() => clickAvail(item)}
              style={{
                width: 52, height: 62,
                background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))',
                border: '2px solid rgba(99,102,241,0.4)',
                borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '1.4rem', fontWeight: 700,
                color: '#c4b5fd',
                cursor: 'grab',
                transition: 'all 0.15s ease',
                userSelect: 'none',
                animation: 'letterDrop 0.3s ease forwards',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.08)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.5)';
                e.currentTarget.style.borderColor = 'rgba(99,102,241,0.8)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '';
                e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)';
              }}
            >
              {item.letter}
            </div>
          ))}
          {available.length === 0 && (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', alignSelf: 'center' }}>
              All letters placed ✓
            </div>
          )}
        </div>
      </div>

      {/* Clear button */}
      {slots.some(s => s !== null) && (
        <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={clearAll}>
            🔄 Clear
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── GAME BOARD ─── */
function GameBoard({ category, difficulty, onGameEnd }) {
  const TIME_PER_Q = TIME_CONFIG[difficulty] || 30;
  const MAX_HINTS  = HINTS_CONFIG[difficulty] || 2;

  // ── UI state (triggers re-renders) ──
  const [wordQueue,    setWordQueue]    = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputMode,   setInputMode]    = useState('tiles');
  const [tileAnswer,  setTileAnswer]   = useState('');
  const [textAnswer,  setTextAnswer]   = useState('');
  const [score,       setScore]        = useState(0);
  const [timeLeft,    setTimeLeft]     = useState(TIME_PER_Q);
  const [skipsLeft,   setSkipsLeft]    = useState(MAX_SKIPS);
  const [hintsLeft,   setHintsLeft]    = useState(MAX_HINTS);
  const [showHint,    setShowHint]     = useState(false);
  const [roundPhase,  setRoundPhase]   = useState('answering'); // 'answering'|'correct_flash'|'revealed'
  const [revealedWord, setRevealedWord] = useState('');
  const [loading,     setLoading]      = useState(true);
  const [initError,   setInitError]    = useState(null);

  // ── Refs (no re-render needed) ──
  const timerRef       = useRef(null);
  const gameIdRef      = useRef(null);
  const scoreRef       = useRef(0);
  const resultsRef     = useRef([]);
  const indexRef       = useRef(0);   // always mirrors currentIndex without stale closure risk
  const wordQueueRef   = useRef([]);
  const timeLeftRef    = useRef(TIME_PER_Q);
  const textInputRef   = useRef(null);
  const submittingRef  = useRef(false);

  const currentWord = wordQueue[currentIndex] || null;
  const answer      = inputMode === 'tiles' ? tileAnswer : textAnswer;
  const locked      = roundPhase !== 'answering';

  /* ── Helpers that use refs (no stale closures) ── */
  const startTimer = () => {
    clearInterval(timerRef.current);
    timeLeftRef.current = TIME_PER_Q;
    setTimeLeft(TIME_PER_Q);
    timerRef.current = setInterval(() => {
      timeLeftRef.current -= 1;
      const t = timeLeftRef.current;
      if (t <= 4 && t > 0) playSound('tick');
      setTimeLeft(t);
      if (t <= 0) clearInterval(timerRef.current);
    }, 1000);
  };

  const advanceToNext = () => {
    const idx = indexRef.current;
    setRoundPhase('answering');
    setRevealedWord('');
    setShowHint(false);
    setTileAnswer('');
    setTextAnswer('');
    submittingRef.current = false;

    if (idx + 1 >= QUESTION_COUNT) {
      onGameEnd({ score: scoreRef.current, results: resultsRef.current });
    } else {
      indexRef.current = idx + 1;
      setCurrentIndex(idx + 1);
      startTimer();
      setTimeout(() => textInputRef.current?.focus(), 100);
    }
  };

  /* ── Init ── */
  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      try {
        const [gameRes, wordsRes] = await Promise.all([
          api.post('/game/start', { category, difficulty }),
          api.get(`/game/words?category=${category}&difficulty=${difficulty}&count=15`),
        ]);
        if (cancelled) return;
        gameIdRef.current = gameRes.data.game_id;

        const allWords = Array.isArray(wordsRes.data) ? wordsRes.data : [];

        // Rotate words: prioritise ones not used in the last game
        const storageKey = `ws_used_${category}_${difficulty}`;
        const recentlyUsed = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const fresh = allWords.filter(w => !recentlyUsed.includes(w.word));
        const stale = allWords.filter(w => recentlyUsed.includes(w.word));
        // shuffle each group
        const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
        const ordered = [...shuffle(fresh), ...shuffle(stale)];
        const selected = ordered.slice(0, QUESTION_COUNT);

        wordQueueRef.current = selected;
        setWordQueue(selected);
        startTimer();
        setTimeout(() => textInputRef.current?.focus(), 100);
      } catch (err) {
        console.error('Game init error:', err);
        if (!cancelled) setInitError(err?.response?.data?.error || err.message || 'Failed to load game');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    init();
    return () => { cancelled = true; clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Timeout handler ── */
  useEffect(() => {
    if (timeLeft <= 0 && !loading && roundPhase === 'answering') {
      const word = wordQueueRef.current[indexRef.current];
      if (!word) return;
      clearInterval(timerRef.current);
      playSound('wrong');
      resultsRef.current = [...resultsRef.current, { word: word.word, correct: false, score: 0, timedOut: true }];
      setRevealedWord(word.word);
      setRoundPhase('revealed');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  /* ── Submit ── */
  const handleSubmit = async () => {
    const word = wordQueueRef.current[indexRef.current];
    if (!word || locked || !answer.trim() || submittingRef.current) return;
    submittingRef.current = true;
    clearInterval(timerRef.current);

    const timeTaken = TIME_PER_Q - timeLeftRef.current;
    try {
      const res = await api.post('/game/submit', {
        word: word.word, answer,
        time_taken: timeTaken, category, difficulty,
        game_id: gameIdRef.current,
      });
      const { correct, score: pts } = res.data;
      const newScore = scoreRef.current + (correct ? pts : 0);
      scoreRef.current = newScore;
      setScore(newScore);
      resultsRef.current = [...resultsRef.current, { word: word.word, correct, score: pts, timeTaken }];
      playSound(correct ? 'correct' : 'wrong');

      if (correct) {
        setRoundPhase('correct_flash');
        setTimeout(() => advanceToNext(), 1200);
      } else {
        setRevealedWord(word.word);
        setRoundPhase('revealed');
        submittingRef.current = false;
      }
    } catch (err) {
      console.error('Submit error:', err);
      submittingRef.current = false;
    }
  };

  /* ── Skip ── */
  const handleSkip = () => {
    if (skipsLeft <= 0 || locked) return;
    clearInterval(timerRef.current);
    setSkipsLeft(s => s - 1);
    const word = wordQueueRef.current[indexRef.current];
    resultsRef.current = [...resultsRef.current, { word: word?.word, correct: false, score: 0, skipped: true }];
    advanceToNext();
  };

  /* ── Hint ── */
  const handleHint = async () => {
    if (hintsLeft <= 0 || showHint || locked) return;
    try {
      await api.post('/game/hint', { difficulty });
      setHintsLeft(h => h - 1);
      setShowHint(true);
    } catch { setHintsLeft(0); }
  };

  /* ── Render ── */
  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: 300, flexDirection: 'column', gap: '1rem' }}>
        <div className="spinner" />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading words…</p>
      </div>
    );
  }

  if (initError || wordQueue.length === 0) {
    return (
      <div className="flex-center" style={{ minHeight: 300, flexDirection: 'column', gap: '1rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem' }}>⚠️</div>
        <p style={{ color: '#ef4444', fontWeight: 600 }}>Failed to start game</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{initError || 'No words returned from server'}</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Make sure the server is running on port 5001</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>🔄 Try Again</button>
      </div>
    );
  }

  const catInfo  = CATEGORIES.find(c => c.id === category);
  const diffInfo = DIFFICULTIES.find(d => d.id === difficulty);
  const progress = (currentIndex / QUESTION_COUNT) * 100;

  return (
    <div className="game-board">
      {roundPhase === 'correct_flash' && (
        <div className="feedback-overlay">
          <div className="feedback-popup correct">✅ Correct!</div>
        </div>
      )}

      {/* Header */}
      <div className="game-header">
        <div className="game-meta">
          <div className={`game-timer${timeLeft <= 10 && roundPhase === 'answering' ? ' warning' : ''}`}>
            ⏱️ {roundPhase === 'revealed' ? '0' : timeLeft}s
          </div>
          <div className="game-score-display">⭐ {score} pts</div>
          <span className="badge" style={{ background: catInfo?.bgGlow, color: catInfo?.color, border: `1px solid ${catInfo?.border}` }}>
            {catInfo?.icon} {category}
          </span>
          <span className="badge" style={{ background: `${diffInfo?.color}22`, color: diffInfo?.color, border: `1px solid ${diffInfo?.color}44` }}>
            {diffInfo?.label}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <span>💡 {hintsLeft}/{MAX_HINTS}</span>
          <span>⏭️ {skipsLeft}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-bar-container mb-3" style={{ height: 6 }}>
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Word card */}
      <div className="scramble-card">
        <div className="question-counter">Question {currentIndex + 1} of {QUESTION_COUNT}</div>
        <div className="scramble-label">Unscramble this word:</div>

        {currentWord && (
          <div className="scramble-word" style={{ marginBottom: '0.5rem' }}>
            {currentWord.scrambled.split('').map((letter, i) => (
              <div key={i} className="letter-tile" style={{ animationDelay: `${i * 0.05}s` }}>{letter}</div>
            ))}
          </div>
        )}

        {showHint && currentWord && (
          <div className="hint-text">💡 Hint: {currentWord.hint}</div>
        )}

        {/* Reveal correct answer */}
        {roundPhase === 'revealed' && revealedWord && (
          <div style={{
            marginTop: '1rem', padding: '0.875rem 1.25rem',
            background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.4)',
            borderRadius: 12, animation: 'fadeIn 0.3s ease',
          }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              The correct answer was:
            </div>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.75rem', fontWeight: 800, color: '#818cf8', letterSpacing: '0.12em' }}>
              {revealedWord}
            </div>
          </div>
        )}
      </div>

      {/* Mode toggle */}
      {roundPhase === 'answering' && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          {['tiles', 'text'].map(mode => (
            <button key={mode} className="btn btn-sm" onClick={() => setInputMode(mode)} style={{
              background: inputMode === mode ? 'var(--gradient)' : 'rgba(255,255,255,0.06)',
              color: inputMode === mode ? 'white' : 'var(--text-muted)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
              {mode === 'tiles' ? '🧩 Drag & Click' : '⌨️ Type'}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      {roundPhase === 'answering' && currentWord && (
        <div className="card mb-3" style={{ padding: '1.5rem' }}>
          {inputMode === 'tiles' ? (
            <LetterBuilder
              key={`${currentWord.word}-${currentIndex}`}
              scrambled={currentWord.scrambled}
              onAnswerChange={setTileAnswer}
            />
          ) : (
            <input
              ref={textInputRef}
              type="text" className="input game-input"
              placeholder="Type your answer..."
              value={textAnswer}
              onChange={e => setTextAnswer(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              autoComplete="off" autoCorrect="off" spellCheck="false"
            />
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="game-actions">
        {roundPhase === 'answering' ? (
          <>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={!answer.trim()}>
              ✅ Submit
            </button>
            <button className="btn btn-secondary" onClick={handleHint} disabled={hintsLeft <= 0 || showHint}>
              💡 Hint ({hintsLeft})
            </button>
            <button className="btn btn-secondary" onClick={handleSkip} disabled={skipsLeft <= 0}>
              ⏭️ Skip ({skipsLeft})
            </button>
          </>
        ) : roundPhase === 'revealed' ? (
          <button className="btn btn-primary btn-lg" onClick={advanceToNext} style={{ minWidth: 180 }}>
            {indexRef.current + 1 >= QUESTION_COUNT ? '🏁 See Results' : '➡️ Next Word'}
          </button>
        ) : null}
      </div>
    </div>
  );
}

/* ─── GAME OVER ─── */
function GameOver({ result, onPlayAgain, onGoHome }) {
  const { score, results } = result;
  const correct = results.filter(r => r.correct).length;
  const accuracy = results.length > 0 ? Math.round((correct / results.length) * 100) : 0;

  return (
    <div className="game-board animate-scale-in">
      {accuracy >= 70 && <ReactConfetti recycle={false} numberOfPieces={250} gravity={0.3} />}

      <div className="game-over-card card">
        <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>
          {accuracy >= 90 ? '🏆' : accuracy >= 70 ? '🎉' : accuracy >= 50 ? '😊' : '💪'}
        </div>
        <div className="game-over-title">Game Over!</div>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          {accuracy >= 90 ? 'Outstanding!' : accuracy >= 70 ? 'Great job!' : accuracy >= 50 ? 'Good effort!' : 'Keep practicing!'}
        </p>

        <div className="final-stats">
          <div className="final-stat">
            <div className="final-stat-value">{score}</div>
            <div className="final-stat-label">Score</div>
          </div>
          <div className="final-stat">
            <div className="final-stat-value">{correct}/{results.length}</div>
            <div className="final-stat-label">Correct</div>
          </div>
          <div className="final-stat">
            <div className="final-stat-value">{accuracy}%</div>
            <div className="final-stat-label">Accuracy</div>
          </div>
        </div>

        <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.6rem' }}>WORD REVIEW</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: 200, overflowY: 'auto' }}>
            {results.map((r, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.5rem 0.75rem',
                background: r.correct ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                borderRadius: 8, fontSize: '0.875rem',
              }}>
                <span style={{ fontWeight: 600 }}>{r.word}</span>
                <span>{r.skipped ? '⏭️ Skipped' : r.correct ? `✅ +${r.score}pts` : '❌'}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={onPlayAgain}>🔄 Play Again</button>
          <button className="btn btn-secondary" onClick={onGoHome}>🏠 Change Settings</button>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN ─── */
export default function Game() {
  const [phase, setPhase] = useState('setup');
  const [gameConfig, setGameConfig] = useState(null);
  const [gameResult, setGameResult] = useState(null);

  const handleStart = (category, difficulty) => {
    setGameConfig({ category, difficulty });
    setPhase('playing');
  };

  const handleGameEnd = (result) => {
    setGameResult(result);
    setPhase('over');
    const saved = JSON.parse(localStorage.getItem('ws_progress') || '[]');
    saved.push({ ...result, date: new Date().toISOString(), ...gameConfig });
    localStorage.setItem('ws_progress', JSON.stringify(saved.slice(-20)));

    // Remember which words were used so next game avoids them
    if (gameConfig) {
      const storageKey = `ws_used_${gameConfig.category}_${gameConfig.difficulty}`;
      const usedWords = result.results.map(r => r.word).filter(Boolean);
      localStorage.setItem(storageKey, JSON.stringify(usedWords));
    }
  };

  return (
    <div className="game-page">
      <div className="container-md">
        {phase === 'setup' && <GameSetup onStart={handleStart} />}
        {phase === 'playing' && gameConfig && (
          <GameBoard
            key={`${gameConfig.category}-${gameConfig.difficulty}-${Date.now()}`}
            category={gameConfig.category}
            difficulty={gameConfig.difficulty}
            onGameEnd={handleGameEnd}
          />
        )}
        {phase === 'over' && gameResult && (
          <GameOver
            result={gameResult}
            onPlayAgain={() => { setGameResult(null); setPhase('playing'); }}
            onGoHome={() => { setGameResult(null); setGameConfig(null); setPhase('setup'); }}
          />
        )}
      </div>
    </div>
  );
}
