import express from 'express'
import {uploadVideo,getAllVideos,updateVideoById } from '../controllers/video.js'
import upload from '../Helpers/fileHelpers.js'
import auth from '../middleware/auth.js';

const routes = express.Router();

routes.post('/uploadVideo',auth,upload.single('file'),uploadVideo)
routes.get('/getAllVideos',getAllVideos)
routes.patch('/update/:id', updateVideoById);

export default routes