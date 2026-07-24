import AsyncStorage from "@react-native-async-storage/async-storage";

export const setItem = async (key, value) => {
  if (typeof value === "string") {
    await AsyncStorage.setItem(key, value);
  } else {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  }
};

export const getItem = async (key) => {
  const data = await AsyncStorage.getItem(key);

  if (!data) return null;

  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
};

export const removeItem = async (key) => {
  await AsyncStorage.removeItem(key);
};

