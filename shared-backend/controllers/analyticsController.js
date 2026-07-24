const { SensorReading, Alert } = require('../models');

exports.getAnalytics = async (req, res) => {
  try {
    const totalReadings = await SensorReading.count();
    const activeAlerts = await Alert.count({ where: { status: 'active' } });
    const resolvedAlerts = await Alert.count({ where: { status: 'resolved' } });
    res.json({
      totalReadings,
      activeAlerts,
      resolvedAlerts,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get analytics' });
  }
};
