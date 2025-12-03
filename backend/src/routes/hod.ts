import express from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { getDashboard, approveAnnouncement, createSchedule } from '../controllers/hodController';

const router = express.Router();

router.use(authenticate);
router.use(authorize('hod'));

router.get('/dashboard', getDashboard);
router.post('/announcements/:id/approve', approveAnnouncement);
router.post('/schedules', createSchedule);

export default router;

