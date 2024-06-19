import express from 'express'
import { message } from '../controllers/message.js';

const routes = express.Router();

routes.post('/post',message);


export default routes