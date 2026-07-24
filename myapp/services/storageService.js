import AsyncStorage from "@react-native-async-storage/async-storage";

// =====================
// USERS
// =====================
export const getUsers = async () => {
  const data = await AsyncStorage.getItem("users");
  return data ? JSON.parse(data) : [];
};

export const saveUsers = async (users) => {
  await AsyncStorage.setItem("users", JSON.stringify(users));
};

// Add User
export const addUser = async (user) => {
  const users = await getUsers();
  users.push(user);
  await saveUsers(users);
};

// Delete User
export const deleteUser = async (username) => {
  const users = await getUsers();
  const updated = users.filter((u) => u.username !== username);
  await saveUsers(updated);
};

// =====================
// DEVICES
// =====================
export const getDevices = async () => {
  const data = await AsyncStorage.getItem("devices");
  return data ? JSON.parse(data) : [];
};

export const saveDevices = async (devices) => {
  await AsyncStorage.setItem("devices", JSON.stringify(devices));
};

// Add Device
export const addDevice = async (device) => {
  const devices = await getDevices();
  devices.push(device);
  await saveDevices(devices);
};

// Remove Device
export const removeDevice = async (deviceId) => {
  const devices = await getDevices();
  const updated = devices.filter((d) => d.id !== deviceId);
  await saveDevices(updated);
};

// =====================
// SESSION (CURRENT USER)
// =====================

export const setCurrentUser = async (user) => {
  await AsyncStorage.setItem("currentUser", JSON.stringify(user));
};

export const getCurrentUser = async () => {
  const data = await AsyncStorage.getItem("currentUser");
  return data ? JSON.parse(data) : null;
};

export const clearCurrentUser = async () => {
  await AsyncStorage.removeItem("currentUser");
};
// =====================
// AUTH COMPATIBILITY FIX
// =====================

// allow login system to use users from ManageUsers
export const findUser = async (username, password) => {
  const users = await getUsers();
  return users.find(
    (u) => u.username === username && u.password === password
  );
};