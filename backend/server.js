// ============================================================
// VAMCC — Node.js/Express Backend
// Database: PostgreSQL
// Run: npm install && npm start
// ============================================================

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));

// ── PostgreSQL Connection ────────────────────────────────────
const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     process.env.DB_PORT     || 5432,
  database: process.env.DB_NAME     || 'church_db',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || 'yourpassword',
});

// ── Database Setup (run once) ────────────────────────────────
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS members (
      id          SERIAL PRIMARY KEY,
      name        VARCHAR(255) NOT NULL,
      email       VARCHAR(255) UNIQUE NOT NULL,
      phone       VARCHAR(50),
      address     TEXT,
      password    VARCHAR(255) NOT NULL,
      role        VARCHAR(50) DEFAULT 'Member',
      joined_date DATE DEFAULT CURRENT_DATE,
      created_at  TIMESTAMP DEFAULT NOW(),
      updated_at  TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log('✅ Database tables ready');
}

// ── Auth Middleware ──────────────────────────────────────────
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'church_secret_key');
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// ── Routes ───────────────────────────────────────────────────

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, address, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: 'Name, email, and password are required' });

    const exists = await pool.query('SELECT id FROM members WHERE email = $1', [email]);
    if (exists.rows.length > 0)
      return res.status(409).json({ error: 'An account with this email already exists' });

    const hashed = await bcrypt.hash(password, 12);
    const result = await pool.query(
      `INSERT INTO members (name, email, phone, address, password)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, phone, address, role, joined_date`,
      [name, email, phone || null, address || null, hashed]
    );

    const member = result.rows[0];
    const token = jwt.sign(
      { id: member.id, email: member.email, role: member.role },
      process.env.JWT_SECRET || 'church_secret_key',
      { expiresIn: '7d' }
    );

    res.status(201).json({ token, member });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required' });

    const result = await pool.query('SELECT * FROM members WHERE email = $1', [email]);
    const member = result.rows[0];

    if (!member || !(await bcrypt.compare(password, member.password)))
      return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign(
      { id: member.id, email: member.email, role: member.role },
      process.env.JWT_SECRET || 'church_secret_key',
      { expiresIn: '7d' }
    );

    const { password: _, ...safeUser } = member;
    res.json({ token, member: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// GET /api/members/me
app.get('/api/members/me', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, phone, address, role, joined_date FROM members WHERE id = $1',
      [req.user.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Member not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/members/:id  (update profile)
app.put('/api/members/:id', auth, async (req, res) => {
  try {
    if (req.user.id !== parseInt(req.params.id) && req.user.role !== 'Admin')
      return res.status(403).json({ error: 'Forbidden' });

    const { name, phone, address } = req.body;
    const result = await pool.query(
      `UPDATE members
       SET name=$1, phone=$2, address=$3, updated_at=NOW()
       WHERE id=$4
       RETURNING id, name, email, phone, address, role, joined_date`,
      [name, phone, address, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/members  (admin only — list all members)
app.get('/api/members', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Admin')
      return res.status(403).json({ error: 'Admin access required' });
    const result = await pool.query(
      'SELECT id, name, email, phone, role, joined_date FROM members ORDER BY joined_date DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date() }));

// ── Start ────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;
initDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Church API running on http://localhost:${PORT}`));
}).catch(err => {
  console.error('Failed to init DB:', err);
  process.exit(1);
});
