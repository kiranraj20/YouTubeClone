import express from 'express'
import { getHistoryByUserId, postHistory } from '../controllers/history.js';

const routes = express.Router();

routes.post('/post/:id',postHistory);
routes.get('/get/:id',getHistoryByUserId);


export default routes