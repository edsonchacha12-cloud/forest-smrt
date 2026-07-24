const { SensorReading, Device } = require('../models');
const { createAlertFromSensor } = require('../services/alertServices');
const moberForwarder = require('../services/moberForwarder');

exports.addReading = async (req, res) => {
  try {
    const io = req.app.get('io');
    const data = req.body;

    // Validate required fields
    if (!data.device_code) {
      return res.status(400).json({ success: false, message: 'device_code is required' });
    }

    console.log(`📥 Received from IoT: ${data.device_code}`);

    // 1. Save locally in PostgreSQL
    const reading = await SensorReading.create({
      device_code: data.device_code,
      smoke: data.smoke || 0,
      sound: data.sound || 0,
      temperature: data.temperature || 0,
      latitude: data.latitude || null,
      longitude: data.longitude || null,
    });

    // 2. Update device
    await Device.upsert({
      device_code: data.device_code,
      last_seen: new Date(),
      status: 'online',
    });

    // 3. Process alerts
    let alert = null;
    if (data.smoke > 70 || data.sound > 80) {
      alert = await createAlertFromSensor(data);
      if (alert) {
        io.emit('new_alert', alert.toJSON());
        console.log(`🔔 Alert generated: ${alert.type} for ${data.device_code}`);
      }
    }

    // 4. 🔥 FORWARD TO MAIN BACKEND (MOBER)
    let forwarded = false;
    let forwardError = null;
    try {
      console.log(`🔄 Attempting to forward to Mober...`);
      await moberForwarder.forwardToMober(data);
      forwarded = true;
      console.log(`✅ Forwarded ${data.device_code} to Mober`);
    } catch (error) {
      forwardError = error.message;
      console.error(`❌ Failed to forward ${data.device_code}:`, error.message);
    }

    // Send response with forwarding info
    res.json({
      success: true,
      reading: reading.toJSON(),
      alert: alert ? alert.toJSON() : null,
      forwarded: forwarded,
      forward_error: forwardError,
      mober_url: process.env.MAIN_BACKEND_URL
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
