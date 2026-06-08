import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'smartrx_secret_key_change_in_production';

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authorised — no token' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // Try DB first, fall back to token payload (offline mode)
    try {
      const user = await User.findByPk(decoded.id);
      if (user && user.isActive) {
        req.user = user;
        return next();
      }
    } catch (_) {
      // DB unavailable — use token payload
    }

    // Offline fallback
    req.user = {
      id:       decoded.id,
      _id:      decoded.id,
      name:     decoded.name  || 'User',
      role:     decoded.role  || 'doctor',
      email:    decoded.email || '',
      toSafeJSON: () => ({ id: decoded.id, name: decoded.name, role: decoded.role })
    };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export const generateToken = (userId, extra = {}) => {
  return jwt.sign({ id: userId, ...extra }, JWT_SECRET, { expiresIn: '7d' });
};
