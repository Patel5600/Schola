import express from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { getDashboard, markAttendance, createSurvey } from '../controllers/teacherController';

const router = express.Router();

router.use(authenticate);
router.use(authorize('teacher'));

router.get('/dashboard', getDashboard);
router.post('/attendance', markAttendance);
router.post('/surveys', createSurvey);

export default router;

