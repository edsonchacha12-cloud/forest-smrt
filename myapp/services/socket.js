import { io } from "socket.io-client";
import { getSocketUrl } from "./config";

let SOCKET_URL = "http://localhost:3000";
let socketInstance = null;

export const initSocket = async () => {
  SOCKET_URL = await getSocketUrl();
  console.log("📡 Socket connecting to:", SOCKET_URL);
  
  if (socketInstance) {
    socketInstance.disconnect();
  }
  
  socketInstance = io(SOCKET_URL, {
    transports: ["websocket"],
  });
  
  return socketInstance;
};

export const getSocket = () => {
  if (!socketInstance) {
    // Create a default connection
    socketInstance = io(SOCKET_URL, {
      transports: ["websocket"],
    });
  }
  return socketInstance;
};

// =======================
// ALERTS LIVE
// =======================
export const listenNewAlerts = (callback) => {
  const socket = getSocket();
  socket.off("new_alert");
  socket.on("new_alert", (data) => {
    callback(data);
  });
};

// =======================
// SENSOR LIVE UPDATES
// =======================
export const listenSensorUpdates = (callback) => {
  const socket = getSocket();
  socket.off("sensor_update");
  socket.on("sensor_update", (data) => {
    callback(data);
  });
};

export default socketInstance;
