import { router } from "expo-router";
import { removeItem } from "./storage";

export const logout = async () => {
  try {
    await removeItem("token");
    await removeItem("currentUser");
    router.replace("/");
  } catch (error) {
    console.log("Logout error:", error);
    router.replace("/");
  }
};