import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import applicationRoutes from './application.routes.js';
import documentRoutes from './document.routes.js';
import licenseRoutes from './license.routes.js';
import publicRoutes from './public.routes.js';
import auditLogRoutes from './audit-log.routes.js';
import notificationRoutes from './notification.routes.js';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/applications', applicationRoutes);
apiRouter.use('/documents', documentRoutes);
apiRouter.use('/licenses', licenseRoutes);
apiRouter.use('/public', publicRoutes);
apiRouter.use('/audit-logs', auditLogRoutes);
apiRouter.use('/notifications', notificationRoutes);

export default apiRouter;
