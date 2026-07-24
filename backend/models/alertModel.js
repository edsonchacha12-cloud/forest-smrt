const Alert = require("./Alert");
const Device = require("./Device");

// GET ALL ALERTS
const getAllAlerts = async () => {
  return await Alert.find()
    .populate("device_id", "name")
    .sort({ detected_at: -1, _id: -1 });
};

// CREATE ALERT
const createAlert = async ({
  device_id = null,
  type,
  message = "",
  status = "active",
  latitude = null,
  longitude = null,
}) => {
  const alert = await Alert.create({
    device_id,
    type,
    message,
    status,
    latitude,
    longitude,
  });

  // populate device info manually (like JOIN in SQL)
  const fullAlert = await Alert.findById(alert._id).populate(
    "device_id",
    "name"
  );

  return fullAlert;
};

// RESOLVE ALERT
const resolveAlert = async (id) => {
  const result = await Alert.findByIdAndUpdate(id, {
    status: "resolved",
    resolved_at: new Date(),
  });

  return !!result;
};

// COUNT ACTIVE ALERTS
const countActiveAlerts = async () => {
  return await Alert.countDocuments({ status: "active" });
};

// GET LATEST ALERT
const getLatestAlert = async () => {
  return await Alert.findOne().sort({ detected_at: -1, _id: -1 });
};

module.exports = {
  getAllAlerts,
  createAlert,
  resolveAlert,
  countActiveAlerts,
  getLatestAlert,
};