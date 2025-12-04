import { Router } from 'express';
import { announcementController } from '../controllers/announcementController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/roleGuard';
import { apiRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.get('/', apiRateLimiter, authenticate, announcementController.getAll);
router.get('/:id', apiRateLimiter, authenticate, announcementController.getById);
router.post('/', apiRateLimiter, authenticate, requireRole('teacher', 'hod', 'admin'), announcementController.create);
router.put('/:id', apiRateLimiter, authenticate, announcementController.update);
router.delete('/:id', apiRateLimiter, authenticate, announcementController.delete);

export default router;
