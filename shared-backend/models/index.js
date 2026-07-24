const sequelize = require('../config/database');
const Device = require('./Device');
const SensorReading = require('./SensorReading');
const Alert = require('./Alert');

const db = {
  sequelize,
  Device,
  SensorReading,
  Alert,
};

db.sync = async () => {
  await sequelize.sync({ alter: true });
  console.log('PostgreSQL tables synced');
};

module.exports = db;
