import express from 'express';
import { authenticate } from '../middleware/auth';
import { getNotes, uploadNote, deleteNote, downloadNote } from '../controllers/noteController';
import multer from 'multer';

const upload = multer({ dest: 'uploads/notes/' });
const router = express.Router();

router.get('/', authenticate, getNotes);
router.post('/', authenticate, upload.single('file'), uploadNote);
router.delete('/:id', authenticate, deleteNote);
router.get('/:id/download', authenticate, downloadNote);

export default router;

