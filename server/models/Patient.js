import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Patient = sequelize.define('Patient', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  age: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other', ''),
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  allergies: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: true
  }
}, {
  tableName: 'patients',
  timestamps: true
});

export default Patient;
