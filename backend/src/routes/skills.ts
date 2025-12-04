import { Router } from 'express';
import { skillController } from '../controllers/skillController';
import { authenticate } from '../middleware/auth';
import { apiRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.get('/', apiRateLimiter, authenticate, skillController.getAll);
router.get('/:id', apiRateLimiter, authenticate, skillController.getById);
router.post('/', apiRateLimiter, authenticate, skillController.create);
router.put('/:id', apiRateLimiter, authenticate, skillController.update);
router.delete('/:id', apiRateLimiter, authenticate, skillController.delete);

export default router;
