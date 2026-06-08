import express from 'express';
import { Op } from 'sequelize';
import Patient from '../models/Patient.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

const isDbReady = async () => {
  try {
    const { default: sequelize } = await import('../db.js');
    await sequelize.authenticate();
    return true;
  } catch { return false; }
};

const getUserId = (req) => req.user.id || req.user._id;

// POST /api/patients
router.post('/', async (req, res) => {
  try {
    const { name, age, gender, phone, allergies } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Patient name is required' });

    if (await isDbReady()) {
      const patient = await Patient.create({ name, age, gender, phone, allergies, createdBy: getUserId(req) });
      return res.status(201).json({ success: true, data: patient });
    }
    res.status(201).json({ success: true, data: { id: Date.now().toString(), name, age, gender, phone, allergies } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/patients
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    if (await isDbReady()) {
      const where = { createdBy: getUserId(req) };
      if (search) where.name = { [Op.iLike]: `%${search}%` };
      const patients = await Patient.findAll({ where, order: [['name', 'ASC']] });
      return res.json({ success: true, data: patients });
    }
    res.json({ success: true, data: [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/patients/:id
router.get('/:id', async (req, res) => {
  try {
    if (await isDbReady()) {
      const patient = await Patient.findOne({ where: { id: req.params.id, createdBy: getUserId(req) } });
      if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
      return res.json({ success: true, data: patient });
    }
    res.status(404).json({ success: false, message: 'Patient not found' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/patients/:id
router.delete('/:id', async (req, res) => {
  try {
    if (await isDbReady()) {
      await Patient.destroy({ where: { id: req.params.id, createdBy: getUserId(req) } });
    }
    res.json({ success: true, message: 'Patient deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
