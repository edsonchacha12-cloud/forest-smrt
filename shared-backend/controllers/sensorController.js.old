const { SensorReading, Device } = require('../models');
const { createAlertFromSensor } = require('../services/alertServices');
const { Op } = require('sequelize');

exports.addReading = async (req, res) => {
  try {
    const io = req.app.get('io');
    const data = req.body;

    // Validate required fields
    if (!data.device_code) {
      return res.status(400).json({ success: false, message: 'device_code is required' });
    }

    const reading = await SensorReading.create({
      device_code: data.device_code,
      smoke: data.smoke || 0,
      sound: data.sound || 0,
      temperature: data.temperature || 0,
      latitude: data.latitude || null,
      longitude: data.longitude || null,
    });

    // Update or create device
    await Device.upsert({
      device_code: data.device_code,
      last_seen: new Date(),
      status: 'online',
    });

    let alert = null;
    if (data.smoke > 70 || data.sound > 80) {
      alert = await createAlertFromSensor(data);
      if (alert) {
        io.emit('new_alert', alert.toJSON());
      }
    }

    res.json({
      success: true,
      reading: reading.toJSON(),
      alert: alert ? alert.toJSON() : null,
    });
  } catch (error) {
    console.error('Add reading error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getReadings = async (req, res) => {
  try {
    const readings = await SensorReading.findAll({
      order: [['createdAt', 'DESC']],
      limit: 20,
    });
    res.json(readings);
  } catch (error) {
    console.error('Get readings error:', error);
    res.status(500).json({ message: 'Failed to fetch readings' });
  }
};
