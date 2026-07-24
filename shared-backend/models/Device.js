const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Device = sequelize.define('Device', {
  device_code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'offline',
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  last_seen: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

module.exports = Device;
