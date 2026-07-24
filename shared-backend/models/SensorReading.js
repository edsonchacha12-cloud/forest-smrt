const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Device = require('./Device');

const SensorReading = sequelize.define('SensorReading', {
  smoke: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sound: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  temperature: {
    type: DataTypes.FLOAT,
    allowNull: true,
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

SensorReading.belongsTo(Device, { foreignKey: 'device_id' });
Device.hasMany(SensorReading, { foreignKey: 'device_id' });

module.exports = SensorReading;
