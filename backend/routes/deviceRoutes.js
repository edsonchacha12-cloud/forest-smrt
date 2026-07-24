const express = require("express");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  getDevices,
  createDevice,
  removeDevice,
  updateDeviceRealtime,
} = require("../controllers/deviceController");

const router = express.Router();

router.get("/", authMiddleware, getDevices);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  [
    body("name").notEmpty().withMessage("Device name is required"),
    body("device_code").notEmpty().withMessage("device_code is required"),
  ],
  createDevice,
);

router.delete("/:id", authMiddleware, roleMiddleware("admin"), removeDevice);


module.exports = router;