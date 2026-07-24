const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
  {
    name: String,
    device_code: { type: String, unique: true },

    status: { type: String, default: "offline" },
    latitude: Number,
    longitude: Number,

    smoke_sensor: Number,
    sound_sensor: Number,
    esp32_status: Number,
    gps_status: Number,
    buzzer_status: Number
  },
  { timestamps: true }
);

// ✔ SAFE REUSE (IMPORTANT FIX)
module.exports =
  mongoose.models.Device || mongoose.model("Device", deviceSchema);