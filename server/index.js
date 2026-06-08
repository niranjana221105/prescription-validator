import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './db.js';
import authRoutes from './routes/auth.js';
import prescriptionRoutes from './routes/prescriptions.js';
import patientRoutes from './routes/patients.js';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001'], credentials: true }));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',          authRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/patients',      patientRoutes);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  let dbStatus = 'disconnected';
  try { await sequelize.authenticate(); dbStatus = 'connected'; } catch (_) {}
  res.json({
    status: 'ok',
    message: 'MediSafe API running',
    timestamp: new Date().toISOString(),
    database: `PostgreSQL — ${dbStatus}`
  });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal server error' });
});

// ── Sync DB then start ────────────────────────────────────────────────────────
const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected');
    // sync({ alter: true }) updates tables to match models without dropping data
    await sequelize.sync({ alter: true });
    console.log('✅ Tables synced');
  } catch (err) {
    console.error('❌ PostgreSQL connection failed:', err.message);
    console.log('⚠️  Starting in offline mode — data will not persist to database');
  }

  app.listen(PORT, () => {
    console.log(`🚀 MediSafe server running on http://localhost:${PORT}`);
  });
};

start();

export default app;
