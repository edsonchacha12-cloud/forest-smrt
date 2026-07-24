const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Device = require('./Device');

const Alert = sequelize.define('Alert', {
  type: {
    type: DataTypes.STRING,
    allowNull: false, // fire, noise, illegal_activity
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  severity: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    defaultValue: 'medium',
  },
  status: {
    type: DataTypes.ENUM('active', 'resolved'),
    defaultValue: 'active',
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  device_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Alert.belongsTo(Device, { foreignKey: 'device_id' });
Device.hasMany(Alert, { foreignKey: 'device_id' });

module.exports = Alert;
