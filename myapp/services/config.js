import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Network from 'expo-network';

// Default to localhost (works for emulator)
let API_URL = 'http://localhost:3000/api';
let SOCKET_URL = 'http://localhost:3000';

// Function to get the local IP address
export const getLocalIP = async () => {
  try {
    const ip = await Network.getIpAddressAsync();
    console.log('📡 Local IP detected:', ip);
    return ip;
  } catch (error) {
    console.log('Error getting IP:', error);
    return null;
  }
};

// Function to get the API URL based on platform and network
export const getApiUrl = async () => {
  // If running on web, use localhost
  if (Platform.OS === 'web') {
    return 'http://localhost:3000/api';
  }

  // For iOS emulator, use localhost
  if (Platform.OS === 'ios' && !Constants.isDevice) {
    return 'http://localhost:3000/api';
  }

  // For Android emulator, use 10.0.2.2
  if (Platform.OS === 'android' && !Constants.isDevice) {
    return 'http://10.0.2.2:3000/api';
  }

  // For physical device, try to get the local IP
  try {
    const ip = await getLocalIP();
    if (ip) {
      // Use the IP address
      return `http://${ip}:3000/api`;
    }
  } catch (error) {
    console.log('Error getting IP for API:', error);
  }

  // Fallback to localhost
  return 'http://localhost:3000/api';
};

// Function to get Socket URL
export const getSocketUrl = async () => {
  if (Platform.OS === 'web') {
    return 'http://localhost:3000';
  }

  if (Platform.OS === 'ios' && !Constants.isDevice) {
    return 'http://localhost:3000';
  }

  if (Platform.OS === 'android' && !Constants.isDevice) {
    return 'http://10.0.2.2:3000';
  }

  try {
    const ip = await getLocalIP();
    if (ip) {
      return `http://${ip}:3000`;
    }
  } catch (error) {
    console.log('Error getting IP for Socket:', error);
  }

  return 'http://localhost:3000';
};

// Export a function to initialize the config
export const initConfig = async () => {
  const apiUrl = await getApiUrl();
  const socketUrl = await getSocketUrl();
  API_URL = apiUrl;
  SOCKET_URL = socketUrl;
  console.log('📡 API URL set to:', API_URL);
  console.log('📡 Socket URL set to:', SOCKET_URL);
  return { API_URL, SOCKET_URL };
};

export { API_URL, SOCKET_URL };
export default { API_URL, SOCKET_URL, getApiUrl, getSocketUrl, initConfig, getLocalIP };
