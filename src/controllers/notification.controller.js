import notificationService from '../services/notification.service.js';
import { sendSuccess } from '../utils/response.js';

class NotificationController {
  /**
   * GET /api/v1/notifications
   */
  async getMyNotifications(req, res, next) {
    try {
      const result = await notificationService.listUserNotifications(req.user.id, req.query);
      const data = {
        notifications: result.notifications,
        unreadCount: result.unreadCount,
      };
      return sendSuccess(res, 'Notifications retrieved successfully.', data, 200, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/notifications/:id/read
   */
  async markAsRead(req, res, next) {
    try {
      const notification = await notificationService.markNotificationAsRead(req.params.id, req.user.id);
      return sendSuccess(res, 'Notification marked as read.', notification, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/notifications/read-all
   */
  async markAllAsRead(req, res, next) {
    try {
      const result = await notificationService.markAllNotificationsAsRead(req.user.id);
      return sendSuccess(res, 'All notifications marked as read.', result, 200);
    } catch (error) {
      next(error);
    }
  }
}

export default new NotificationController();
