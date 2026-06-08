import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken, protect } from '../middleware/auth.js';

const router = express.Router();

// In-memory fallback store (used when PostgreSQL is offline)
const memUsers = [];

const isDbReady = async () => {
  try {
    const { default: sequelize } = await import('../db.js');
    await sequelize.authenticate();
    return true;
  } catch { return false; }
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, hospital } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });

    if (await isDbReady()) {
      const existing = await User.findOne({ where: { email } });
      if (existing)
        return res.status(400).json({ success: false, message: 'Email already registered' });

      const user = await User.create({ name, email, password, role: role || 'doctor', hospital });
      const token = generateToken(user.id, { name: user.name, role: user.role, email: user.email });
      return res.status(201).json({ success: true, message: 'Account created', token, user: user.toSafeJSON() });
    }

    // Offline fallback
    if (memUsers.find(u => u.email === email))
      return res.status(400).json({ success: false, message: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 12);
    const user = {
      id: Date.now().toString(), _id: Date.now().toString(),
      name, email, password: hashed,
      role: role || 'doctor', hospital: hospital || ''
    };
    memUsers.push(user);
    const token = generateToken(user.id, { name: user.name, role: user.role, email: user.email });
    const { password: _, ...safeUser } = user;
    return res.status(201).json({ success: true, message: 'Account created (offline mode)', token, user: safeUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required' });

    if (await isDbReady()) {
      const user = await User.findOne({ where: { email } });
      if (!user)
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      const isMatch = await user.comparePassword(password);
      if (!isMatch)
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      const token = generateToken(user.id, { name: user.name, role: user.role, email: user.email });
      return res.json({ success: true, message: 'Login successful', token, user: user.toSafeJSON() });
    }

    // Offline fallback
    const user = memUsers.find(u => u.email === email);
    if (!user)
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    const token = generateToken(user.id, { name: user.name, role: user.role, email: user.email });
    const { password: _, ...safeUser } = user;
    return res.json({ success: true, message: 'Login successful (offline mode)', token, user: safeUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', protect, (req, res) => {
  const user = req.user.toSafeJSON ? req.user.toSafeJSON() : req.user;
  res.json({ success: true, user });
});

// PUT /api/auth/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, hospital, role } = req.body;
    if (await isDbReady()) {
      await User.update({ name, hospital, role }, { where: { id: req.user.id } });
      const user = await User.findByPk(req.user.id);
      return res.json({ success: true, user: user.toSafeJSON() });
    }
    res.json({ success: true, user: req.user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
