const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    device_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
      default: null
    },

    type: {
      type: String,
      required: true
    },

    message: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      default: "active"
    },

    latitude: Number,
    longitude: Number
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Alert", alertSchema);