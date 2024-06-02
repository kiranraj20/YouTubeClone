import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';

import userRoutes from './routes/user.js';
import videoRoutes from './routes/video.js';
import commentRoutes from './routes/comment.js';

dotenv.config();

const app = express();

// Configure CORS with detailed settings
const corsOptions = {
  origin: 'https://null-class-internship-client.vercel.app', // Your client domain
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight

app.use(bodyParser.json({ limit: '30mb' }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use('/uploads', express.static(path.join('uploads')));

app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

app.use('/user', userRoutes);
app.use('/video', videoRoutes);
app.use('/comment', commentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const DB_URL = process.env.CONNECTION_URL;

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log('Database connection successful');
}).catch((error) => {
  console.log('Database connection error:', error);
});
