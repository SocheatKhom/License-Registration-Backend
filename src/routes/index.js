import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import applicationRoutes from './application.routes.js';
import documentRoutes from './document.routes.js';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/applications', applicationRoutes);
apiRouter.use('/documents', documentRoutes);

export default apiRouter;
