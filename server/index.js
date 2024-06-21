import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import userRoutes from './routes/user.js';
import videoRoutes from './routes/video.js';
import commentRoutes from './routes/comment.js';
import historyRoutes from './routes/history.js';
import signupRoutes from './routes/signup.js';
import messageRoutes from './routes/message.js';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://null-class-internship-client.vercel.app/',
    methods: ['GET', 'POST'],
  },
});

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(bodyParser.json({ limit: '30mb' }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

app.use('/uploads', express.static(path.join('uploads')));

app.use('/user', userRoutes);
app.use('/video', videoRoutes);
app.use('/comment', commentRoutes);
app.use('/history', historyRoutes);
app.use('/signup', signupRoutes);
app.use('/message', messageRoutes);

app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

const PORT = process.env.PORT || 5500;
const DB_URL = process.env.CONNECTION_URL;

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Database connection successful');
  })
  .catch((error) => {
    console.log('Database connection error:', error);
  });

io.on('connection', (socket) => {
  console.log(`Socket Connected`, socket.id);

  socket.on('room:join', (data) => {
    const { email, room } = data;
    emailToSocketIdMap.set(email, socket.id);
    socketIdToEmailMap.set(socket.id, email);
    io.to(room).emit('user:joined', { email, id: socket.id });
    socket.join(room);
    io.to(socket.id).emit('room:join', data);
  });

  socket.on('user:call', ({ to, offer }) => {
    io.to(to).emit('incoming:call', { from: socket.id, offer });
  });

  socket.on('call:accepted', ({ to, ans }) => {
    io.to(to).emit('call:accepted', { from: socket.id, ans });
  });

  socket.on('peer:nego:needed', ({ to, offer }) => {
    console.log('peer:nego:needed', offer);
    io.to(to).emit('peer:nego:needed', { from: socket.id, offer });
  });

  socket.on('peer:nego:done', ({ to, ans }) => {
    console.log('peer:nego:done', ans);
    io.to(to).emit('peer:nego:final', { from: socket.id, ans });
  });

  socket.on('screen:share', ({ to }) => {
    io.to(to).emit('screen:share', { from: socket.id });
  });

  socket.on('screen:stop', ({ to }) => {
    io.to(to).emit('screen:stop', { from: socket.id });
  });
});

// Configure CORS with detailed settings
app.use(cors({
  origin: '*', // Replace with your frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
  next();
});

// Body Parser Middleware
app.use(bodyParser.json({ limit: '30mb' }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

// Static Files Middleware
app.use('/uploads', express.static(path.join('uploads')));

// Routes
app.use('/user', userRoutes);
app.use('/video', videoRoutes);
app.use('/comment', commentRoutes);
app.use('/history', historyRoutes);
app.use('/signup', signupRoutes);
app.use('/message', messageRoutes);

app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Database Connection
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Database connection successful');
  })
  .catch((error) => {
    console.log('Database connection error:', error);
  });
