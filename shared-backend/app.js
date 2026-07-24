const express = require('express');
const cors = require('cors');
const deviceRoutes = require('./routes/devices');
const sensorRoutes = require('./routes/sensors');
const alertRoutes = require('./routes/alerts');
const analyticsRoutes = require('./routes/analytics');
const { sequelize } = require('./models');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is working 🚀');
});

app.use('/api/devices', deviceRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/db-status', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = app;
