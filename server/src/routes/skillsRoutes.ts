import { Router } from 'express';
import { skillsController } from '../controllers/skillsController';
import { requireAuth } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import { skillGapSchema, learningSchema } from '@ai-resume/shared';

const router = Router();

router.use(requireAuth);
router.post('/gap-analysis', validateBody(skillGapSchema), skillsController.generateSkillGap);
router.get('/gap-analysis/:id', skillsController.getSkillGap);
router.get('/', skillsController.getUserSkills);
router.post('/improvement', validateBody(learningSchema), skillsController.generateRoadmap);
router.get('/roadmaps', skillsController.listRoadmaps);
router.get('/roadmaps/:id', skillsController.getRoadmap);

export default router;

