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

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tblMember (
      memberID          SERIAL PRIMARY KEY,
      fullName          VARCHAR(255) NOT NULL,
      countryCode       VARCHAR(5) NOT NULL,
      phoneNumber       VARCHAR(20) NOT NULL,
      email             VARCHAR(255) NOT NULL,
      dateOfBirthMonth  INT,
      dateOfBirthDate   INT,
      parishName        VARCHAR(255),
      city              VARCHAR(100),
      state             VARCHAR(100),
      createdAt         TIMESTAMP DEFAULT NOW(),
      updatedAt         TIMESTAMP DEFAULT NOW(),
      UNIQUE (countryCode, phoneNumber)
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

// ── Member Registration Chatbot Routes ──────────────

// POST /api/members/register - Register new member via chatbot
app.post('/api/members/register', async (req, res) => {
  try {
    const { fullName, countryCode, phoneNumber, email, dateOfBirthMonth, dateOfBirthDate, parishName, city, state } = req.body;

    // Validation
    if (!fullName || !countryCode || !phoneNumber || !email)
      return res.status(400).json({ error: 'Full Name, Country Code, Phone Number, and Email are required' });

    if (dateOfBirthMonth < 1 || dateOfBirthMonth > 12 || dateOfBirthDate < 1 || dateOfBirthDate > 31)
      return res.status(400).json({ error: 'Invalid date of birth' });

    // Check for duplicate phone number
    const duplicate = await pool.query(
      'SELECT memberID FROM tblMember WHERE countryCode = $1 AND phoneNumber = $2',
      [countryCode, phoneNumber]
    );

    if (duplicate.rows.length > 0) {
      return res.status(409).json({
        error: 'Phone number already exists! Would you like to view and update your record?',
        memberID: duplicate.rows[0].memberid,
        isDuplicate: true
      });
    }

    // Insert new member
    const result = await pool.query(
      `INSERT INTO tblMember (fullName, countryCode, phoneNumber, email, dateOfBirthMonth, dateOfBirthDate, parishName, city, state)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING memberID, fullName, email, countryCode, phoneNumber, dateOfBirthMonth, dateOfBirthDate, parishName, city, state, createdAt`,
      [fullName, countryCode, phoneNumber, email, dateOfBirthMonth, dateOfBirthDate, parishName || null, city || null, state || null]
    );

    res.status(201).json({
      success: true,
      member: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    if (err.code === '23505') { // UNIQUE constraint violation
      return res.status(409).json({ error: 'This phone number is already registered' });
    }
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// GET /api/members/by-phone - Get member by phone number (for update flow)
app.get('/api/members/by-phone', async (req, res) => {
  try {
    const { countryCode, phoneNumber } = req.query;

    if (!countryCode || !phoneNumber)
      return res.status(400).json({ error: 'Country Code and Phone Number are required' });

    const result = await pool.query(
      'SELECT memberID, fullName, countryCode, phoneNumber, email, dateOfBirthMonth, dateOfBirthDate, parishName, city, state FROM tblMember WHERE countryCode = $1 AND phoneNumber = $2',
      [countryCode, phoneNumber]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Member not found' });

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/members/:memberID - Update existing member
app.put('/api/members/:memberID', async (req, res) => {
  try {
    const { memberID } = req.params;
    const { fullName, countryCode, phoneNumber, email, dateOfBirthMonth, dateOfBirthDate, parishName, city, state } = req.body;

    if (!fullName || !countryCode || !phoneNumber || !email)
      return res.status(400).json({ error: 'Full Name, Country Code, Phone Number, and Email are required' });

    // Check if trying to change phone to an existing one (excluding current member)
    const duplicate = await pool.query(
      'SELECT memberID FROM tblMember WHERE countryCode = $1 AND phoneNumber = $2 AND memberID != $3',
      [countryCode, phoneNumber, memberID]
    );

    if (duplicate.rows.length > 0)
      return res.status(409).json({ error: 'This phone number is already registered by another member' });

    const result = await pool.query(
      `UPDATE tblMember
       SET fullName=$1, countryCode=$2, phoneNumber=$3, email=$4, dateOfBirthMonth=$5, dateOfBirthDate=$6, parishName=$7, city=$8, state=$9, updatedAt=NOW()
       WHERE memberID=$10
       RETURNING memberID, fullName, email, countryCode, phoneNumber, dateOfBirthMonth, dateOfBirthDate, parishName, city, state, updatedAt`,
      [fullName, countryCode, phoneNumber, email, dateOfBirthMonth, dateOfBirthDate, parishName || null, city || null, state || null, memberID]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Member not found' });

    res.json({ success: true, member: result.rows[0] });
  } catch (err) {
    console.error(err);
    if (err.code === '23505') { // UNIQUE constraint violation
      return res.status(409).json({ error: 'This phone number is already registered' });
    }
    res.status(500).json({ error: 'Server error during update' });
  }
});

// GET /api/events - Get upcoming events (placeholder data)
app.get('/api/events', (req, res) => {
  const upcomingEvents = [
    { id: 1, title: 'Sunday Mass', date: '2026-02-22', time: '10:00 AM', description: 'Weekly Sunday Service' },
    { id: 2, title: 'Bible Study', date: '2026-02-23', time: '7:00 PM', description: 'Join us for Bible study and discussion' },
    { id: 3, title: 'Choir Practice', date: '2026-02-24', time: '6:00 PM', description: 'Weekly choir rehearsal' },
    { id: 4, title: 'Sunday Mass', date: '2026-02-29', time: '10:00 AM', description: 'Weekly Sunday Service' },
    { id: 5, title: 'Community Outreach', date: '2026-03-01', time: '9:00 AM', description: 'Help serve the community' },
    { id: 6, title: 'Confession', date: '2026-03-02', time: '4:00 PM', description: 'Sacrament of Reconciliation' },
    { id: 7, title: 'Young Adults Group', date: '2026-03-03', time: '7:30 PM', description: 'Social gathering for young adults' },
    { id: 8, title: 'Sunday Mass', date: '2026-03-08', time: '10:00 AM', description: 'Weekly Sunday Service' },
    { id: 9, title: 'Prayer Circle', date: '2026-03-09', time: '6:00 PM', description: 'Evening prayer and fellowship' },
    { id: 10, title: 'Baptism Class', date: '2026-03-10', time: '7:00 PM', description: 'Preparation for Baptism' }
  ];
  res.json(upcomingEvents);
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
