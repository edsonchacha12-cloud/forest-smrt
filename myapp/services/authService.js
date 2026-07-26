import axios from "axios";
import { getItem, removeItem, setItem } from "../app/utils/storage";
import { getApiUrl } from "./config";

// Store the API URL
let API_URL = "http://localhost:3000/api";

// Initialize API URL
export const initAuthService = async () => {
  API_URL = await getApiUrl();
  console.log("🔑 Auth Service using API:", API_URL);
};

// LOGIN
export const loginUser = async (username, password) => {
  try {
    // Ensure API_URL is set
    if (!API_URL || API_URL === "http://localhost:3000/api") {
      API_URL = await getApiUrl();
    }
    
    console.log("🔑 Login attempt with:", username);
    console.log("📡 Using API:", API_URL);
    
    const response = await axios.post(`${API_URL}/auth/login`, {
      username,
      password,
    });

    console.log("Login response:", response.data);

    const data = response.data;
    
    if (data.success === true && data.data) {
      const token = data.data.token;
      const user = data.data;
      
      if (token) {
        await setItem("token", token);
        await setItem("currentUser", user);
        console.log("✅ Login successful, token saved");
        return true;
      }
      return false;
    }
    
    if (data.token) {
      await setItem("token", data.token);
      await setItem("currentUser", data.user || data.data || { username });
      console.log("✅ Login successful, token saved");
      return true;
    }

    if (data.message) {
      console.log("Login error:", data.message);
    }
    
    return false;
  } catch (error) {
    console.log("Login error:", error.response?.data || error.message);
    return false;
  }
};

// GET CURRENT USER
export const getCurrentUser = async () => {
  try {
    const user = await getItem("currentUser");
    return user || null;
  } catch (error) {
    console.log("Get current user error:", error);
    return null;
  }
};

// GET TOKEN
export const getToken = async () => {
  try {
    return await getItem("token");
  } catch (error) {
    console.log("Get token error:", error);
    return null;
  }
};

// LOGOUT
export const logoutUser = async () => {
  try {
    await removeItem("token");
    await removeItem("currentUser");
    console.log("✅ Logout successful");
    return true;
  } catch (error) {
    console.log("Logout error:", error);
    return false;
  }
};

// UPDATE PASSWORD
export const updatePassword = async (currentPassword, newPassword) => {
  try {
    const token = await getItem("token");
    const response = await axios.put(
      `${API_URL}/auth/change-password`,
      { currentPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.success === true;
  } catch (error) {
    console.log("Update password error:", error.response?.data || error.message);
    return false;
  }
};

// UPDATE USERNAME
export const updateUsername = async (newUsername) => {
  try {
    const token = await getItem("token");
    const response = await axios.put(
      `${API_URL}/users/me/username`,
      { username: newUsername },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      const currentUser = await getItem("currentUser");
      if (currentUser) {
        currentUser.username = newUsername;
        await setItem("currentUser", currentUser);
      }
      return true;
    }
    return false;
  } catch (error) {
    console.log("Update username error:", error.response?.data || error.message);
    return false;
  }
};

export default {
  loginUser,
  getCurrentUser,
  getToken,
  logoutUser,
  updatePassword,
  updateUsername,
  initAuthService
};
