import { Router } from 'express';
import profileRoutes from './profileRoutes';
import resumeRoutes from './resumeRoutes';
import analysisRoutes from './analysisRoutes';
import skillsRoutes from './skillsRoutes';
import advisoryRoutes from './advisoryRoutes';
import progressRoutes from './progressRoutes';
import dashboardRoutes from './dashboardRoutes';

const apiRouter = Router();

apiRouter.use('/profile', profileRoutes);
apiRouter.use('/resumes', resumeRoutes);
apiRouter.use('/analysis', analysisRoutes);
apiRouter.use('/skills', skillsRoutes);
apiRouter.use('/advisory', advisoryRoutes);
apiRouter.use('/progress', progressRoutes);
apiRouter.use('/dashboard', dashboardRoutes);

export default apiRouter;

