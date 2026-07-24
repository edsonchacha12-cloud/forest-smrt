require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const { initSocket } = require("./realtime/socket");
const { ensureAdminExists } = require("./controllers/authController");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    console.log("MongoDB connected");

    await ensureAdminExists();

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: { origin: "*" },
    });

    initSocket(io);

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
};

startServer();
