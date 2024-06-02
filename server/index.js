import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';

import userRoutes from './routes/user.js';
import videoRoutes from './routes/video.js';
import commentRoutes from './routes/comment.js';

import path from 'path'


dotenv.config();

const app = express();

const corsOptions = {
  origin: 'https://null-class-internship-client.vercel.app/', // Replace with your frontend's origin
  methods: 'GET, POST, PATCH, DELETE',
};

app.use(cors(corsOptions));

app.use(express.json({limit:'30mb',extended:true}))
app.use(express.urlencoded({limit:'30mb',extended:true}))
app.use('/uploads',express.static(path.join('uploads')))

app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

app.use(bodyParser.json())

app.use('/user', userRoutes)
app.use('/video', videoRoutes)
app.use('/comment', commentRoutes)


const PORT = process.env.PORT;

app.listen(PORT,() => {
  console.log(`server is running on the port ${PORT}`)
})

const DB_URL = process.env.CONNECTION_URL;

mongoose.connect(DB_URL,{useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
  console.log("connection successful")
}).catch((error)=>{
  console.log(error)
})
