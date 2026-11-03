import { Router } from 'express';
import { analysisController } from '../controllers/analysisController';
import { requireAuth } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import { resumeAnalyzeRequestSchema } from '@ai-resume/shared';

const router = Router();

router.use(requireAuth);
router.post('/resume/:resumeId', validateBody(resumeAnalyzeRequestSchema), analysisController.analyzeResume);
router.get('/history', analysisController.getHistory);
router.get('/:id', analysisController.getAnalysis);
router.delete('/:id', analysisController.deleteAnalysis);

export default router;

