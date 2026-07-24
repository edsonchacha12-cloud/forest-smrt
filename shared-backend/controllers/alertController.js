const { Alert } = require('../models');
const { forwardAlertToMain } = require('../services/alertServices');

exports.getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.json(alerts);
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.resolveAlert = async (req, res) => {
  try {
    const alert = await Alert.findByPk(req.params.id);
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    alert.status = 'resolved';
    await alert.save();

    const io = req.app.get('io');
    io.emit('alert_resolved', alert.toJSON());

    await forwardAlertToMain(alert);

    res.json(alert);
  } catch (error) {
    console.error('Resolve alert error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
