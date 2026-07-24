const express = require("express");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const { login, getCurrentUser, changePassword } = require("../controllers/authController");

const router = express.Router();

router.post(
  "/login",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login,
);

router.get("/me", authMiddleware, getCurrentUser);

router.put(
  "/change-password",
  authMiddleware,
  [
    body("currentPassword").notEmpty().withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 4 })
      .withMessage("New password must be at least 4 characters"),
  ],
  changePassword,
);

module.exports = router;