import express from 'express';
import { authenticate } from '../middleware/auth';
import { getSkills, addSkill, updateSkill, deleteSkill } from '../controllers/skillController';

const router = express.Router();

router.get('/', authenticate, getSkills);
router.post('/', authenticate, addSkill);
router.put('/:id', authenticate, updateSkill);
router.delete('/:id', authenticate, deleteSkill);

export default router;

