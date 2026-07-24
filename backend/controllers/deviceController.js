const coreApi = require("../services/coreApi");

// GET ALL DEVICES FROM CORE BACKEND
exports.getDevices = async (req, res) => {
  try {
    const response = await coreApi.getDevices();

    console.log("CORE RESPONSE:");
    console.log(response.data);

    res.json(response.data);
  } catch (err) {
    console.error("DEVICE ERROR:", err.response?.data || err.message);

    res.status(500).json({
      message: "Failed to fetch devices",
    });
  }
};

// CREATE DEVICE ON CORE BACKEND
exports.createDevice = async (req, res) => {
  try {
    const response = await coreApi.createDevice(req.body);

    return res.status(response.status).json(response.data);
  } catch (err) {
    console.error("Create device error:", err.message);

    return res.status(err.response?.status || 500).json({
      success: false,
      message: err.response?.data?.message || "Failed to create device",
    });
  }
};

// DELETE DEVICE FROM CORE BACKEND
exports.removeDevice = async (req, res) => {
  try {
    const response = await coreApi.deleteDevice(req.params.id);

    return res.status(response.status).json(response.data);
  } catch (err) {
    console.error("Delete device error:", err.message);

    return res.status(err.response?.status || 500).json({
      success: false,
      message: err.response?.data?.message || "Failed to delete device",
    });
  }
};