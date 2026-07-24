import axios from "axios";

import { getItem, removeItem, setItem } from "../app/utils/storage";
const API = "http://192.168.73.245:4000/api";

// LOGIN
export const loginUser = async (username, password) => {
  try {
    const res = await axios.post(`${API}/auth/login`, {
      username,
      password,
    });

    const { token, user } = res.data;

    if (token && user) {
      await setItem("token", token);
      await setItem("currentUser", user);
      return true;
    }

    return false;
  } catch (error) {
    console.log("Login error:", error.response?.data || error.message);
    return false;
  }
};

// GET CURRENT USER
export const getCurrentUser = async () => {
  return await getItem("currentUser");
};

// LOGOUT
export const logoutUser = async () => {
  await removeItem("token");
  await removeItem("currentUser");
};

// UPDATE PASSWORD
export const updatePassword = async (currentPassword, newPassword) => {
  try {
    const token = await getItem("token");

    const res = await axios.put(
      `${API}/auth/change-password`,
      { currentPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data.success === true;
  } catch (error) {
    console.log(
      "Update password error:",
      error.response?.data || error.message,
    );
    return false;
  }
};

// UPDATE USERNAME
export const updateUsername = async (newUsername) => {
  try {
    const token = await getItem("token");

    const res = await axios.put(
      `${API}/users/me/username`,
      { username: newUsername },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (res.data.success) {
      const currentUser = await getItem("currentUser");

      if (currentUser) {
        currentUser.username = newUsername;

        await setItem("currentUser", currentUser);
      }

      return true;
    }

    return false;
  } catch (error) {
    console.log(
      "Update username error:",
      error.response?.data || error.message,
    );
    return false;
  }
};
