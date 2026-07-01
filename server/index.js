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
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    /\.vercel\.app$/,
    /\.github\.io$/
  ],
  credentials: true
}));
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
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// ── DB sync ───────────────────────────────────────────────────────────────────
const initDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected');
    await sequelize.sync({ alter: true });
    console.log('✅ Tables synced');
  } catch (err) {
    console.error('❌ DB failed:', err.message);
    console.log('⚠️  Offline mode — data will not persist');
  }
};

// Start server (local dev) or export for Vercel serverless
if (process.env.VERCEL) {
  // Vercel — init DB once and export app
  initDB();
} else {
  // Local — start server normally
  initDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 MediSafe server running on http://localhost:${PORT}`);
    });
  });
}

export default app;
