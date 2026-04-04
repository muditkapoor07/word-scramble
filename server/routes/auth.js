const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sql, setupDatabase } = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

let dbInitialized = false;
async function ensureDb() {
  if (!dbInitialized) {
    await setupDatabase();
    dbInitialized = true;
  }
}

router.post('/register', async (req, res) => {
  try {
    await ensureDb();
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = await sql`SELECT id FROM ws_users WHERE email = ${email}`;
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const password_hash = await bcrypt.hash(password, 12);
    const result = await sql`
      INSERT INTO ws_users (name, email, password_hash)
      VALUES (${name}, ${email}, ${password_hash})
      RETURNING id, name, email, created_at
    `;

    const user = result[0];
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    await ensureDb();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await sql`SELECT * FROM ws_users WHERE email = ${email}`;
    if (result.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await sql`
      SELECT id, name, email, avatar_url, created_at FROM ws_users WHERE id = ${req.user.id}
    `;
    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: result[0] });
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

module.exports = router;
