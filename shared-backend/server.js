require('dotenv').config();
const http = require('http');
const app = require('./app');
const { Server } = require('socket.io');
const { sequelize, sync } = require('./models');

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
app.set('io', io);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connected');
    await sync();
    console.log('Database synced');
  } catch (err) {
    console.error('DB error:', err);
    process.exit(1);
  }
})();

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
