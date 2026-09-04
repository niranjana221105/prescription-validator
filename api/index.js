import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'smartrx_secret';
const memUsers = [];
const memPrescriptions = [];

const generateToken = (id, extra = {}) =>
  jwt.sign({ id, ...extra }, JWT_SECRET, { expiresIn: '7d' });

const getUser = (req) => {
  try {
    const h = req.headers.authorization;
    if (!h) return null;
    return jwt.verify(h.split(' ')[1], JWT_SECRET);
  } catch { return null; }
};

// ── DB setup ──────────────────────────────────────────────────────────────────
let User = null;
let Prescription = null;
let dbReady = false;

const initDB = async () => {
  if (dbReady || !process.env.DATABASE_URL) return;
  try {
    const { default: sequelize } = await import('../server/db.js');
    await sequelize.authenticate();
    const U = (await import('../server/models/User.js')).default;
    const P = (await import('../server/models/Prescription.js')).default;
    await sequelize.sync({ alter: true });
    User = U;
    Prescription = P;
    dbReady = true;
    console.log('DB ready');
  } catch (e) {
    console.log('DB offline:', e.message);
  }
};

initDB();

// ── Health ────────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: dbReady ? 'connected' : 'offline' });
});

// ── Auth ──────────────────────────────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  try {
    await initDB();
    const { name, email, password, role, hospital } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'Name, email and password required' });

    if (User) {
      const existing = await User.findOne({ where: { email } });
      if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });
      const user = await User.create({ name, email, password, role: role||'doctor', hospital });
      const token = generateToken(user.id, { name: user.name, role: user.role, email: user.email });
      return res.status(201).json({ success: true, token, user: user.toSafeJSON() });
    }

    if (memUsers.find(u => u.email === email))
      return res.status(400).json({ success: false, message: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 12);
    const user = { id: Date.now().toString(), name, email, password: hashed, role: role||'doctor', hospital:hospital||'' };
    memUsers.push(user);
    const token = generateToken(user.id, { name, role: role||'doctor', email });
    const { password: _, ...safe } = user;
    return res.status(201).json({ success: true, token, user: safe });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    await initDB();
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required' });

    if (User) {
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password' });
      const ok = await user.comparePassword(password);
      if (!ok) return res.status(401).json({ success: false, message: 'Invalid email or password' });
      const token = generateToken(user.id, { name: user.name, role: user.role, email: user.email });
      return res.json({ success: true, token, user: user.toSafeJSON() });
    }

    const user = memUsers.find(u => u.email === email);
    if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ success: false, message: 'Invalid email or password' });
    const token = generateToken(user.id, { name: user.name, role: user.role, email: user.email });
    const { password: _, ...safe } = user;
    return res.json({ success: true, token, user: safe });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.get('/api/auth/me', (req, res) => {
  const user = getUser(req);
  if (!user) return res.status(401).json({ success: false, message: 'Not authorised' });
  res.json({ success: true, user });
});

// ── Prescriptions ─────────────────────────────────────────────────────────────
app.post('/api/prescriptions', async (req, res) => {
  try {
    await initDB();
    const user = getUser(req);
    if (!user) return res.status(401).json({ success: false, message: 'Not authorised' });
    const data = { ...req.body, createdBy: user.id };

    if (Prescription) {
      const p = await Prescription.create(data);
      return res.status(201).json({ success: true, data: p });
    }
    const p = { ...data, id: Date.now().toString(), createdAt: new Date().toISOString() };
    memPrescriptions.unshift(p);
    return res.status(201).json({ success: true, data: p });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.get('/api/prescriptions', async (req, res) => {
  try {
    await initDB();
    const user = getUser(req);
    if (!user) return res.status(401).json({ success: false, message: 'Not authorised' });

    if (Prescription) {
      const { Op } = await import('sequelize');
      const where = { createdBy: user.id };
      if (req.query.riskLevel && req.query.riskLevel !== 'all') where.riskLevel = req.query.riskLevel;
      const rows = await Prescription.findAll({ where, order: [['createdAt', 'DESC']], limit: 100 });
      return res.json({ success: true, data: rows });
    }
    const data = memPrescriptions.filter(p => String(p.createdBy) === String(user.id));
    return res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.get('/api/prescriptions/stats', async (req, res) => {
  try {
    await initDB();
    const user = getUser(req);
    if (!user) return res.status(401).json({ success: false, message: 'Not authorised' });

    if (Prescription) {
      const [total, safe, warning, critical] = await Promise.all([
        Prescription.count({ where: { createdBy: user.id } }),
        Prescription.count({ where: { createdBy: user.id, riskLevel: 'safe' } }),
        Prescription.count({ where: { createdBy: user.id, riskLevel: 'warning' } }),
        Prescription.count({ where: { createdBy: user.id, riskLevel: 'critical' } }),
      ]);
      return res.json({ success: true, data: { total, safe, warning, critical, daily: [] } });
    }
    const data = memPrescriptions.filter(p => String(p.createdBy) === String(user.id));
    return res.json({ success: true, data: {
      total: data.length,
      safe: data.filter(p => p.riskLevel === 'safe').length,
      warning: data.filter(p => p.riskLevel === 'warning').length,
      critical: data.filter(p => p.riskLevel === 'critical').length,
      daily: []
    }});
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.delete('/api/prescriptions/:id', async (req, res) => {
  try {
    await initDB();
    const user = getUser(req);
    if (!user) return res.status(401).json({ success: false, message: 'Not authorised' });
    if (Prescription) {
      await Prescription.destroy({ where: { id: req.params.id, createdBy: user.id } });
    }
    res.json({ success: true, message: 'Deleted' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// ── Patients ──────────────────────────────────────────────────────────────────
app.get('/api/patients', (req, res) => {
  const user = getUser(req);
  if (!user) return res.status(401).json({ success: false, message: 'Not authorised' });
  res.json({ success: true, data: [] });
});

export default app;
