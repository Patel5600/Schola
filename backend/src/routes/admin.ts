import express from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { getDashboard, createUser, getUsers, getAnalytics, getAuditLogs } from '../controllers/adminController';

const router = express.Router();

router.use(authenticate);
router.use(authorize('admin'));

router.get('/dashboard', getDashboard);
router.post('/users', createUser);
router.get('/users', getUsers);
router.get('/analytics', getAnalytics);
router.get('/audit-logs', getAuditLogs);

export default router;

