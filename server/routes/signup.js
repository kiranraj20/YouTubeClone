import express from 'express';
import { verifyEmail, verifyOTP } from '../controllers/signup.js';
// import { verifyOTP } from '../controllers/signup'; // Uncomment this if you have verifyOTP function

const router = express.Router();

router.post('/email', verifyEmail);
router.post('/otp', verifyOTP);

export default router;
