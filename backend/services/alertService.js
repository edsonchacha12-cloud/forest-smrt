const alertModel = require("../models/alertModel");
const { getIO } = require("../realtime/socket");

const createAndEmitAlert = async (payload) => {
  const alert = await alertModel.createAlert(payload);

  try {
    const io = getIO();
    io.emit("new_alert", alert);
  } catch (error) {
    console.log("Socket emit warning:", error.message);
  }

  return alert;
};

module.exports = {
  createAndEmitAlert,
};