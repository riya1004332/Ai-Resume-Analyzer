import { Router } from 'express';
import { progressController } from '../controllers/progressController';
import { requireAuth } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import { createProgressTaskSchema, updateProgressTaskSchema } from '@ai-resume/shared';

const router = Router();

router.use(requireAuth);
router.post('/tasks', validateBody(createProgressTaskSchema), progressController.createTask);
router.get('/', progressController.listTasks);
router.patch('/tasks/:id', validateBody(updateProgressTaskSchema), progressController.updateTaskStatus);
router.delete('/tasks/:id', progressController.deleteTask);

export default router;

