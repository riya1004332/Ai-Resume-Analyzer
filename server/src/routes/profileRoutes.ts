import { Router } from 'express';
import { profileController } from '../controllers/profileController';
import { requireAuth } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import { profileUpdateSchema } from '@ai-resume/shared';

const router = Router();

router.use(requireAuth);
router.get('/', profileController.getProfile);
router.put('/', validateBody(profileUpdateSchema), profileController.updateProfile);

export default router;

