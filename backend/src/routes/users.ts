import express from 'express';
import { authenticate } from '../middleware/auth';
import { getUserProfile, updateProfile } from '../controllers/userController';

const router = express.Router();

router.get('/profile', authenticate, getUserProfile);
router.put('/profile', authenticate, updateProfile);

export default router;

