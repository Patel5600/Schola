import { Router } from 'express';
import { authController } from '../controllers/authController';
import { authRateLimiter } from '../middleware/rateLimiter';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', authRateLimiter, authController.register);
router.post('/login', authRateLimiter, authController.login);
router.post('/refresh', authController.refresh);
router.post('/request-password-reset', authRateLimiter, authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);
router.get('/verify-email', authController.verifyEmail);
router.get('/me', authenticate, authController.getMe);

export default router;
