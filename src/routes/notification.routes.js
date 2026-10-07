import { Router } from 'express';
import notificationController from '../controllers/notification.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
  validateNotificationId,
  validateNotificationQuery,
} from '../validators/notification.validator.js';

const router = Router();

// Notifications are accessible to authenticated users
router.use(authenticate);

router.get('/', validateNotificationQuery, notificationController.getMyNotifications);
router.patch('/read-all', notificationController.markAllAsRead);
router.patch('/:id/read', validateNotificationId, notificationController.markAsRead);

export default router;
