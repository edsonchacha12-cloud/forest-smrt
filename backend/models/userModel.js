const User = require("./User"); // Mongoose model

// FIND BY USERNAME
const findByUsername = async (username) => {
  return await User.findOne({ username });
};

// FIND BY ID
const findById = async (id) => {
  return await User.findById(id);
};

// GET ALL USERS
const getAllUsers = async () => {
  return await User.find()
    .select("id username role createdAt")
    .sort({ _id: -1 });
};

// CREATE USER
const createUser = async ({ username, password, role = "officer" }) => {
  const user = await User.create({ username, password, role });

  return {
    id: user._id,
    username: user.username,
    role: user.role,
  };
};

// DELETE USER
const deleteUser = async (id) => {
  const result = await User.findByIdAndDelete(id);
  return !!result;
};

// UPDATE PASSWORD
const updatePassword = async (id, hashedPassword) => {
  try {
    const result = await User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true },
    );

    return !!result;
  } catch (error) {
    console.error("Update password error:", error);
    return false;
  }
};

// UPDATE USERNAME
const updateUsername = async (id, username) => {
  try {
    const result = await User.findByIdAndUpdate(
      id,
      { username },
      { new: true },
    );

    return !!result;
  } catch (error) {
    console.error("Update username error:", error);
    return false;
  }
};

// ENSURE DEFAULT ADMIN
const ensureDefaultAdmin = async (hashedPassword) => {
  let admin = await User.findOne({ username: "admin" });

  if (admin) return admin;

  admin = await User.create({
    username: "admin",
    password: hashedPassword,
    role: "admin",
  });

  return admin;
};

module.exports = {
  findByUsername,
  findById,
  getAllUsers,
  createUser,
  deleteUser,
  updatePassword,
  updateUsername,
  ensureDefaultAdmin,
};
