import { Router } from 'express';
import { noteController } from '../controllers/noteController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/roleGuard';
import { apiRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.get('/', apiRateLimiter, authenticate, noteController.getAll);
router.get('/:id', apiRateLimiter, authenticate, noteController.getById);
router.post('/', apiRateLimiter, authenticate, requireRole('teacher', 'hod', 'admin'), noteController.create);
router.put('/:id', apiRateLimiter, authenticate, noteController.update);
router.delete('/:id', apiRateLimiter, authenticate, noteController.delete);

export default router;
