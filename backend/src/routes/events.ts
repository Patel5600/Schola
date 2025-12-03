import express from 'express';
import { authenticate } from '../middleware/auth';
import { getEvents, createEvent, registerEvent, getEventQR, markAttendance } from '../controllers/eventController';

const router = express.Router();

router.get('/', authenticate, getEvents);
router.post('/', authenticate, createEvent);
router.post('/:id/register', authenticate, registerEvent);
router.get('/:id/qr', authenticate, getEventQR);
router.post('/:id/attendance', authenticate, markAttendance);

export default router;

