import { Router } from 'express';
import { eventController } from '../controllers/eventController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/roleGuard';
import { apiRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.get('/', apiRateLimiter, authenticate, eventController.getAll);
router.get('/:id', apiRateLimiter, authenticate, eventController.getById);
router.post('/', apiRateLimiter, authenticate, requireRole('teacher', 'hod', 'admin'), eventController.create);
router.put('/:id', apiRateLimiter, authenticate, eventController.update);
router.delete('/:id', apiRateLimiter, authenticate, eventController.delete);
router.post('/:id/register', apiRateLimiter, authenticate, eventController.register);
router.post('/:id/attendance', apiRateLimiter, authenticate, requireRole('teacher', 'hod', 'admin'), eventController.markAttendance);

export default router;
