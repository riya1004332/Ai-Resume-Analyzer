import { Router } from 'express';
import { advisoryController } from '../controllers/advisoryController';
import { requireAuth } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import {
  resumeImprovementRequestSchema,
  careerGuidanceRequestSchema,
  jobPreparationRequestSchema
} from '@ai-resume/shared';

const router = Router();

router.use(requireAuth);
router.post('/resume-improvement', validateBody(resumeImprovementRequestSchema), advisoryController.generateResumeImprovement);
router.post('/career-guidance', validateBody(careerGuidanceRequestSchema), advisoryController.generateCareerGuidance);
router.get('/career-guidance', advisoryController.getCareerGuidance);
router.post('/job-preparation', validateBody(jobPreparationRequestSchema), advisoryController.generateJobPreparation);
router.get('/job-preparation', advisoryController.getJobPreparation);

export default router;

