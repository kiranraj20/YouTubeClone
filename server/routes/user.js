import express from 'express';

import {login} from '../controllers/auth.js';
import {updateChannelData,getChannelById, likedVideo, savedVideo} from '../controllers/channel.js';
import auth from '../middleware/auth.js';

const routes = express.Router();

routes.post('/login',login)
routes.patch('/update/:id',updateChannelData)
routes.get('/getChannelById/:id',getChannelById)
routes.post('/like/:Vid',auth, likedVideo)
routes.post('/save/:Vid',auth, savedVideo)

export default routes;