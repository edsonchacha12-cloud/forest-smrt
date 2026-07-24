const { validationResult } = require("express-validator");
const userModel = require("../models/userModel");
const { hashPassword } = require("../services/authService");
const { successResponse, errorResponse } = require("../utils/response");

const getUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    return successResponse(res, "Users fetched successfully", users);
  } catch (error) {
    console.error("Get users error:", error);
    return errorResponse(res, "Server error", 500);
  }
};

const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation error", 422, errors.array());
    }

    const { username, password, role = "officer" } = req.body;

    const existingUser = await userModel.findByUsername(username);
    if (existingUser) {
      return errorResponse(res, "Username already exists", 409);
    }

    const hashedPassword = await hashPassword(password);

    const user = await userModel.createUser({
      username,
      password: hashedPassword,
      role,
    });

    return successResponse(res, "User created successfully", user);

  } catch (error) {
    console.error("Create user error:", error);
    return errorResponse(res, "Server error", 500);
  }
};
const removeUser = async (req, res) => {
  try {
    const userId = req.params.id; // FIX: MongoDB ObjectId ni string

    if (req.user.id === userId) {
      return errorResponse(res, "You cannot delete your own account", 400);
    }

    const deleted = await userModel.deleteUser(userId);

    if (!deleted) {
      return errorResponse(res, "User not found", 404);
    }

    return successResponse(res, "User deleted successfully");
  } catch (error) {
    console.error("Delete user error:", error);
    return errorResponse(res, "Server error", 500);
  }
};

const updateUsername = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation error", 422, errors.array());
    }

    const { username } = req.body;

    const existingUser = await userModel.findByUsername(username);
    if (existingUser && existingUser.id !== req.user.id) {
      return errorResponse(res, "Username already taken", 409);
    }

    await userModel.updateUsername(req.user.id, username);

    return successResponse(res, "Username updated successfully", {
      username,
    });
  } catch (error) {
    console.error("Update username error:", error);
    return errorResponse(res, "Server error", 500);
  }
};

module.exports = {
  getUsers,
  createUser,
  removeUser,
  updateUsername,
};
