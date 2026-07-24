const coreApi = require("../services/coreApi");
const { successResponse, errorResponse } = require("../utils/response");

const getMapLocation = async (req, res) => {
  try {
    const [devicesRes, alertsRes] = await Promise.all([
      coreApi.getDevices(),
      coreApi.getAlerts(),
    ]);

    const devices = devicesRes?.data || [];
    const alerts = alertsRes?.data || [];

    // get latest device
    const latestDevice = devices.sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    )[0];

    // get latest alert
    const latestAlert = alerts.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )[0];

    if (!latestDevice) {
      return successResponse(res, "Map location fetched successfully", {
        connected: false,
        node: "No active node",
        event: "No detection",
        direction: "--",
        radius: "--",
        latitude: -6.7924,
        longitude: 39.2083,
      });
    }

    return successResponse(res, "Map location fetched successfully", {
      connected: latestDevice.status === "online",
      node: latestDevice.name,
      event: latestAlert ? latestAlert.type : "No detection",
      direction: "--",
      radius: "80m",
      latitude: Number(latestDevice.latitude),
      longitude: Number(latestDevice.longitude),
      last_seen: latestDevice.updatedAt,
    });

  } catch (error) {
    console.error("Map location error:", error.message);

    return errorResponse(res, "Server error", 500);
  }
};

module.exports = {
  getMapLocation,
};