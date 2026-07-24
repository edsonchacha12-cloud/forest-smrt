const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// HASH PASSWORD
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// COMPARE PASSWORD
const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

// GENERATE JWT TOKEN
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
};