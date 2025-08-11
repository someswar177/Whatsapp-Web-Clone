require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const connectDB = require('./config/database');
const app = express();
const { Server } = require('socket.io');
const run = require('./scripts/processPayloads');

app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));



const PORT = process.env.PORT || 8000;

// app.get('/', (req, res) => {
//     res.send("Hello from Backend");
// });

app.use('/api/webhook', require('./routes/webhook'));
app.use('/api/conversations', require('./routes/conversations'));
app.use('/api/messages', require('./routes/messages'));

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || '*', methods: ['GET','POST'] }
});

// attach io to app so controllers/services can emit
app.set('io', io);

// simple socket logic
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  // client can join rooms: { type: 'user', id: wa_id } or { type: 'conv', id: convId }
  socket.on('join', ({ type, id }) => {
    if (!type || !id) return;
    const room = type === 'user' ? `user_${id}` : `conv_${id}`;
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });

  socket.on('leave', ({ type, id }) => {
    if (!type || !id) return;
    const room = type === 'user' ? `user_${id}` : `conv_${id}`;
    socket.leave(room);
    console.log(`Socket ${socket.id} left room ${room}`);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});


connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`App listening on : http://localhost:${PORT}`);
        // run();
    });
}).catch((err) => {
    console.error("Failed to connect to the database:", err.message);
});