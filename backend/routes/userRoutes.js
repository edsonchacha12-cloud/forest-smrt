const express = require("express");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  getUsers,
  createUser,
  removeUser,
  updateUsername,
} = require("../controllers/userController");

const router = express.Router();

router.get("/", authMiddleware, roleMiddleware("admin"), getUsers);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("password")
      .isLength({ min: 4 })
      .withMessage("Password must be at least 4 characters"),
    body("role")
      .optional()
      .isIn(["admin", "officer"])
      .withMessage("Role must be admin or officer"),
  ],
  createUser,
);

router.delete("/:id", authMiddleware, roleMiddleware("admin"), removeUser);

router.put(
  "/me/username",
  authMiddleware,
  [body("username").notEmpty().withMessage("Username is required")],
  updateUsername,
);

module.exports = router;