const coreApi = require("../services/coreApi");

exports.getAnalytics = async (req, res) => {
  try {
    const response = await coreApi.getAnalytics();

    return res.status(response.status).json(response.data);
  } catch (err) {
    console.error("Analytics error:", err.message);

    return res.status(err.response?.status || 500).json({
      success: false,
      message:
        err.response?.data?.message ||
        "Failed to fetch analytics from Core Backend",
    });
  }
};