const { Device } = require('../models');

exports.registerDevice = async (req, res) => {
  try {
    const { device_code, name, latitude, longitude } = req.body;
    const device = await Device.create({
      device_code,
      name,
      latitude,
      longitude,
      status: 'offline',
    });
    res.status(201).json(device);
  } catch (err) {
    res.status(500).json({ message: 'Failed to register device' });
  }
};

exports.getDevices = async (req, res) => {
  try {
    const devices = await Device.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.json(devices);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch devices' });
  }
};

exports.deleteDevice = async (req, res) => {
  try {
    const deleted = await Device.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ message: 'Device not found' });
    }
    res.json({ message: 'Device deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete device' });
  }
};
