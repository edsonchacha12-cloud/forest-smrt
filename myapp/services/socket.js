import { io } from "socket.io-client";

const socket = io("http://192.168.73.245:4000", {
  transports: ["websocket"],
});

// =======================
// ALERTS LIVE
// =======================
export const listenNewAlerts = (callback) => {
  socket.off("new_alert");
  socket.on("new_alert", (data) => {
    callback(data);
  });
};

// =======================
// SENSOR LIVE UPDATES
// =======================
export const listenSensorUpdates = (callback) => {
  socket.off("sensor_update");
  socket.on("sensor_update", (data) => {
    callback(data);
  });
};

export default socket;
