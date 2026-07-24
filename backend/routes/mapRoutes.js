const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getMapLocation } = require("../controllers/mapController");

const router = express.Router();

router.get("/map-location", authMiddleware, getMapLocation);

module.exports = router;