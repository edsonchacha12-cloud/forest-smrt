const express = require('express');
const router = express.Router();
const Sensor = require('../models/Sensor');

// POST - Receive IoT data from shared backend (NO AUTH NEEDED)
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    
    console.log('📥 Received IoT data from shared backend:');
    console.log(`   Device: ${data.device_code}`);
    console.log(`   Smoke: ${data.smoke}`);
    console.log(`   Sound: ${data.sound}`);
    console.log(`   Temperature: ${data.temperature}`);
    
    // Validate required field
    if (!data.device_code) {
      return res.status(400).json({
        success: false,
        message: 'device_code is required'
      });
    }
    
    // Save to MongoDB
    const sensorData = new Sensor({
      device_code: data.device_code,
      smoke: data.smoke || 0,
      sound: data.sound || 0,
      temperature: data.temperature || 0,
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      received_at: new Date()
    });
    
    await sensorData.save();
    
    console.log(`✅ Data saved to MongoDB for ${data.device_code}`);
    
    res.status(200).json({
      success: true,
      message: 'IoT data received and saved',
      data: sensorData
    });
    
  } catch (error) {
    console.error('❌ Error saving IoT data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save IoT data',
      error: error.message
    });
  }
});

// GET - Retrieve recent sensor data
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const sensors = await Sensor.find()
      .sort({ received_at: -1 })
      .limit(limit);
    
    res.status(200).json({
      success: true,
      count: sensors.length,
      data: sensors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve sensor data',
      error: error.message
    });
  }
});

// GET - Get data for specific device
router.get('/:device_code', async (req, res) => {
  try {
    const { device_code } = req.params;
    const sensors = await Sensor.find({ device_code })
      .sort({ received_at: -1 })
      .limit(50);
    
    res.status(200).json({
      success: true,
      count: sensors.length,
      data: sensors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve device data',
      error: error.message
    });
  }
});

// GET - Latest data for a device
router.get('/latest/:device_code', async (req, res) => {
  try {
    const { device_code } = req.params;
    const sensor = await Sensor.findOne({ device_code })
      .sort({ received_at: -1 });
    
    if (!sensor) {
      return res.status(404).json({
        success: false,
        message: 'No data found for this device'
      });
    }
    
    res.status(200).json({
      success: true,
      data: sensor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve latest data',
      error: error.message
    });
  }
});

module.exports = router;
