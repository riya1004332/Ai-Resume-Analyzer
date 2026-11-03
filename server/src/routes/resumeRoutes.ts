import { Router } from 'express';
import { resumeController } from '../controllers/resumeController';
import { requireAuth } from '../middleware/auth';
import { resumeUploadMiddleware } from '../middleware/upload';

const router = Router();

router.use(requireAuth);
router.post('/upload', resumeUploadMiddleware, resumeController.uploadResume);
router.get('/', resumeController.listResumes);
router.get('/:id', resumeController.getResume);
router.delete('/:id', resumeController.deleteResume);

export default router;

