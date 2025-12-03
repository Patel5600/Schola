import express from 'express';
import { authenticate } from '../middleware/auth';
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../controllers/announcementController';

const router = express.Router();

router.get('/', authenticate, getAnnouncements);
router.post('/', authenticate, createAnnouncement);
router.put('/:id', authenticate, updateAnnouncement);
router.delete('/:id', authenticate, deleteAnnouncement);

export default router;

