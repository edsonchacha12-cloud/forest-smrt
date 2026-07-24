const coreApi = require("../services/coreApi");

// GET ALL ALERTS FROM CORE BACKEND
exports.getAlerts = async (req, res) => {
  try {
    const response = await coreApi.getAlerts();

    return res.status(response.status).json(response.data);
  } catch (err) {
    console.error("Get alerts error:", err.message);

    return res.status(err.response?.status || 500).json({
      success: false,
      message:
        err.response?.data?.message ||
        "Failed to fetch alerts from Core Backend",
    });
  }
};

// RESOLVE ALERT ON CORE BACKEND
exports.resolveAlert = async (req, res) => {
  try {
    const response = await coreApi.resolveAlert(req.params.id);

    return res.status(response.status).json(response.data);
  } catch (err) {
    console.error("Resolve alert error:", err.message);

    return res.status(err.response?.status || 500).json({
      success: false,
      message:
        err.response?.data?.message ||
        "Failed to resolve alert on Core Backend",
    });
  }
};