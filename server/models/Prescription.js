import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Prescription = sequelize.define('Prescription', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  patientName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  patientAge: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  patientId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  prescriptionDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  source: {
    type: DataTypes.ENUM('manual', 'upload', 'live-scan'),
    defaultValue: 'manual'
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  rawText: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ocrConfidence: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  // Store arrays/objects as JSONB (PostgreSQL native JSON with indexing)
  drugs: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  interactions: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  ageWarnings: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  alerts: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    defaultValue: []
  },
  riskLevel: {
    type: DataTypes.ENUM('safe', 'warning', 'critical', 'info'),
    defaultValue: 'safe'
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: true
  }
}, {
  tableName: 'prescriptions',
  timestamps: true
});

export default Prescription;
