import express from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { getDashboard, getPortfolio } from '../controllers/studentController';

const router = express.Router();

router.use(authenticate);
router.use(authorize('student'));

router.get('/dashboard', getDashboard);
router.get('/portfolio', getPortfolio);

export default router;

