const deviceModel = require("../models/deviceModel");
const alertModel = require("../models/alertModel");

const getAdminStats = async () => {
  const totalDevices = await deviceModel.countAllDevices();
  const onlineDevices = await deviceModel.countOnlineDevices();
  const activeAlerts = await alertModel.countActiveAlerts();

  return {
    totalDevices,
    activeAlerts,
    onlineDevices,
    protectedAreas: 0,
  };
};

module.exports = {
  getAdminStats,
};