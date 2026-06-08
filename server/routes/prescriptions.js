import express from 'express';
import { Op } from 'sequelize';
import Prescription from '../models/Prescription.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

// In-memory fallback
const memPrescriptions = [];

const isDbReady = async () => {
  try {
    const { default: sequelize } = await import('../db.js');
    await sequelize.authenticate();
    return true;
  } catch { return false; }
};

const getUserId = (req) => req.user.id || req.user._id;

// POST /api/prescriptions
router.post('/', async (req, res) => {
  try {
    const data = { ...req.body, createdBy: getUserId(req) };

    if (await isDbReady()) {
      const prescription = await Prescription.create(data);
      return res.status(201).json({ success: true, data: prescription });
    }

    // Offline fallback
    const prescription = {
      ...data,
      id: Date.now().toString(),
      _id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    memPrescriptions.unshift(prescription);
    return res.status(201).json({ success: true, data: prescription });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/prescriptions
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 100, riskLevel, source, search } = req.query;
    const userId = getUserId(req);

    if (await isDbReady()) {
      const where = { createdBy: userId };
      if (riskLevel && riskLevel !== 'all') where.riskLevel = riskLevel;
      if (source    && source    !== 'all') where.source    = source;
      if (search) {
        where[Op.or] = [
          { patientName: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const { count, rows } = await Prescription.findAndCountAll({
        where,
        order: [['createdAt', 'DESC']],
        limit: Number(limit),
        offset: (page - 1) * limit
      });

      return res.json({
        success: true,
        data: rows,
        pagination: { total: count, page: Number(page), pages: Math.ceil(count / limit) }
      });
    }

    // Offline fallback
    let data = memPrescriptions.filter(p => String(p.createdBy) === String(userId));
    if (riskLevel && riskLevel !== 'all') data = data.filter(p => p.riskLevel === riskLevel);
    if (source    && source    !== 'all') data = data.filter(p => p.source    === source);
    if (search) data = data.filter(p =>
      p.patientName?.toLowerCase().includes(search.toLowerCase()) ||
      p.drugs?.some(d => d.name?.toLowerCase().includes(search.toLowerCase()))
    );
    return res.json({ success: true, data, pagination: { total: data.length, page: 1, pages: 1 } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/prescriptions/stats
router.get('/stats', async (req, res) => {
  try {
    const userId = getUserId(req);

    if (await isDbReady()) {
      const [total, safe, warning, critical] = await Promise.all([
        Prescription.count({ where: { createdBy: userId } }),
        Prescription.count({ where: { createdBy: userId, riskLevel: 'safe' } }),
        Prescription.count({ where: { createdBy: userId, riskLevel: 'warning' } }),
        Prescription.count({ where: { createdBy: userId, riskLevel: 'critical' } }),
      ]);

      // Last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      const recent = await Prescription.findAll({
        where: { createdBy: userId, createdAt: { [Op.gte]: sevenDaysAgo } },
        attributes: ['riskLevel', 'createdAt']
      });

      // Group by date
      const dailyMap = {};
      recent.forEach(p => {
        const day = new Date(p.createdAt).toISOString().split('T')[0];
        if (!dailyMap[day]) dailyMap[day] = { scans: 0, alerts: 0 };
        dailyMap[day].scans++;
        if (p.riskLevel !== 'safe') dailyMap[day].alerts++;
      });
      const daily = Object.entries(dailyMap)
        .map(([_id, v]) => ({ _id, ...v }))
        .sort((a, b) => a._id.localeCompare(b._id));

      return res.json({ success: true, data: { total, safe, warning, critical, daily } });
    }

    // Offline fallback
    const data = memPrescriptions.filter(p => String(p.createdBy) === String(userId));
    return res.json({ success: true, data: {
      total:    data.length,
      safe:     data.filter(p => p.riskLevel === 'safe').length,
      warning:  data.filter(p => p.riskLevel === 'warning').length,
      critical: data.filter(p => p.riskLevel === 'critical').length,
      daily: []
    }});
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/prescriptions/:id
router.get('/:id', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (await isDbReady()) {
      const prescription = await Prescription.findOne({
        where: { id: req.params.id, createdBy: userId }
      });
      if (!prescription)
        return res.status(404).json({ success: false, message: 'Prescription not found' });
      return res.json({ success: true, data: prescription });
    }
    const prescription = memPrescriptions.find(p => p.id === req.params.id);
    if (!prescription)
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    res.json({ success: true, data: prescription });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/prescriptions/:id/notes
router.put('/:id/notes', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (await isDbReady()) {
      await Prescription.update(
        { notes: req.body.notes },
        { where: { id: req.params.id, createdBy: userId } }
      );
      const prescription = await Prescription.findByPk(req.params.id);
      return res.json({ success: true, data: prescription });
    }
    const p = memPrescriptions.find(p => p.id === req.params.id);
    if (p) p.notes = req.body.notes;
    res.json({ success: true, data: p });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/prescriptions/:id
router.delete('/:id', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (await isDbReady()) {
      await Prescription.destroy({ where: { id: req.params.id, createdBy: userId } });
      return res.json({ success: true, message: 'Prescription deleted' });
    }
    const idx = memPrescriptions.findIndex(p => p.id === req.params.id);
    if (idx !== -1) memPrescriptions.splice(idx, 1);
    res.json({ success: true, message: 'Prescription deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
