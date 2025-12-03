import express from 'express';
import { login, register, verifyOTP, resendOTP, logout } from '../controllers/authController';
import { loginRateLimiter } from '../middleware/rateLimiter';

const router = express.Router();

router.post('/register', register);
router.post('/login', loginRateLimiter, login);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/logout', logout);

export default router;

