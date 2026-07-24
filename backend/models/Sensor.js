const mongoose = require('mongoose');

const SensorSchema = new mongoose.Schema({
  device_code: {
    type: String,
    required: true,
    index: true
  },
  smoke: {
    type: Number,
    default: 0
  },
  sound: {
    type: Number,
    default: 0
  },
  temperature: {
    type: Number,
    default: 0
  },
  latitude: {
    type: Number,
    default: null
  },
  longitude: {
    type: Number,
    default: null
  },
  received_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create compound index for faster queries
SensorSchema.index({ device_code: 1, received_at: -1 });

module.exports = mongoose.model('Sensor', SensorSchema);
