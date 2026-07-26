import axios from "axios";
import { getItem } from "../app/utils/storage";
import { getApiUrl } from "./config";

let API_URL = "http://localhost:3000/api";

export const initApi = async () => {
  API_URL = await getApiUrl();
  console.log("📡 API Service using:", API_URL);
};

const api = axios.create({
  baseURL: API_URL,
});

// Update baseURL dynamically
api.interceptors.request.use(async (config) => {
  // Ensure API_URL is set
  if (!API_URL || API_URL === "http://localhost:3000/api") {
    API_URL = await getApiUrl();
    config.baseURL = API_URL;
  }
  
  const token = await getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============ AUTH ============
export const loginRequest = (data) => api.post("/auth/login", data);
export const updatePasswordApi = async (payload) => {
  const res = await api.put("/auth/change-password", payload);
  return res.data || res.data;
};

// ============ USERS ============
export const getUsers = async () => {
  const res = await api.get("/users");
  return res.data.data || res.data;
};

export const createUserApi = async (payload) => {
  const res = await api.post("/users", payload);
  return res.data || res.data;
};

export const deleteUserApi = async (id) => {
  const res = await api.delete(`/users/${id}`);
  return res.data || res.data;
};

export const updateUsernameApi = async (payload) => {
  const res = await api.put("/users/me/username", payload);
  return res.data || res.data;
};

// ============ DEVICES ============
export const getDevices = async () => {
  const res = await api.get("/devices");
  return res.data.data || res.data;
};

export const createDeviceApi = async (payload) => {
  const res = await api.post("/devices", payload);
  return res.data || res.data;
};

export const deleteDeviceApi = async (id) => {
  const res = await api.delete(`/devices/${id}`);
  return res.data || res.data;
};

// ============ ALERTS ============
export const getAlerts = async () => {
  const res = await api.get("/alerts");
  return res.data.data || res.data;
};

export const resolveAlert = async (id) => {
  const res = await api.put(`/alerts/${id}/resolve`);
  return res.data || res.data;
};

// ============ MAP ============
export const getMapLocation = async () => {
  const res = await api.get("/map-location");
  return res.data.data || res.data;
};

// ============ ANALYTICS ============
export const getAdminStats = async () => {
  const res = await api.get("/analytics");
  return res.data.data || res.data;
};

// ============ SENSOR / IOT DATA ============
export const getSensorReadings = async (limit = 50) => {
  try {
    const res = await api.get(`/sensors?limit=${limit}`);
    return res.data.data || res.data;
  } catch (error) {
    console.error("Error fetching sensor readings:", error);
    return [];
  }
};

export const getDeviceSensorData = async (deviceCode, limit = 50) => {
  try {
    const res = await api.get(`/sensors/${deviceCode}?limit=${limit}`);
    return res.data.data || res.data;
  } catch (error) {
    console.error(`Error fetching sensor data for ${deviceCode}:`, error);
    return [];
  }
};

export const getLatestSensorData = async (deviceCode) => {
  try {
    const res = await api.get(`/sensors/latest/${deviceCode}`);
    return res.data.data || res.data;
  } catch (error) {
    console.error(`Error fetching latest data for ${deviceCode}:`, error);
    return null;
  }
};

// Get sensor summary for dashboard
export const getSensorSummary = async () => {
  try {
    const readings = await getSensorReadings(50);
    if (!readings || readings.length === 0) {
      return {
        totalReadings: 0,
        activeDevices: 0,
        averageSmoke: 0,
        averageSound: 0,
        averageTemperature: 0,
        latestReadings: [],
        devices: []
      };
    }

    const devices = [...new Set(readings.map(r => r.device_code))];
    const avgSmoke = readings.reduce((sum, r) => sum + (r.smoke || 0), 0) / readings.length;
    const avgSound = readings.reduce((sum, r) => sum + (r.sound || 0), 0) / readings.length;
    const avgTemp = readings.reduce((sum, r) => sum + (r.temperature || 0), 0) / readings.length;

    return {
      totalReadings: readings.length,
      activeDevices: devices.length,
      averageSmoke: Math.round(avgSmoke),
      averageSound: Math.round(avgSound),
      averageTemperature: Math.round(avgTemp * 10) / 10,
      latestReadings: readings.slice(0, 10),
      devices: devices
    };
  } catch (error) {
    console.error("Error getting sensor summary:", error);
    return null;
  }
};

export default api;
