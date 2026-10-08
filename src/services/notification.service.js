import notificationRepository from '../repositories/notification.repository.js';
import { NotFoundError, ForbiddenError } from '../errors/api-error.js';

class NotificationService {
  /**
   * Create a notification record for a user
   */
  async notify({ userId, type, title, message, options = {} }) {
    try {
      return await notificationRepository.create(
        {
          user_id: userId,
          type,
          title,
          message,
        },
        options
      );
    } catch (error) {
      console.error('[NotificationService Error]: Failed to create notification:', error.message);
      return null;
    }
  }

  /**
   * List notifications for a specific user with pagination and unread counts
   */
  async listUserNotifications(userId, query = {}) {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
    const offset = (page - 1) * limit;

    let isReadFilter = undefined;
    if (query.isRead === 'true') isReadFilter = true;
    if (query.isRead === 'false') isReadFilter = false;

    const [{ count, rows }, unreadCount] = await Promise.all([
      notificationRepository.findAndCountAllByUserId(userId, {
        isRead: isReadFilter,
        limit,
        offset,
      }),
      notificationRepository.countUnread(userId),
    ]);

    const totalPages = Math.ceil(count / limit) || 1;

    return {
      notifications: rows,
      unreadCount,
      pagination: {
        page,
        limit,
        totalItems: count,
        totalPages,
      },
    };
  }

  /**
   * Mark a single notification as read
   */
  async markNotificationAsRead(id, userId) {
    const notification = await notificationRepository.findById(id);
    if (!notification) {
      throw new NotFoundError('Notification not found.', 'NOTIFICATION_NOT_FOUND');
    }

    // Verify ownership
    if (notification.user_id !== userId) {
      throw new ForbiddenError('You can only modify your own notifications.', 'FORBIDDEN');
    }

    return notificationRepository.markAsRead(id);
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllNotificationsAsRead(userId) {
    await notificationRepository.markAllAsRead(userId);
    return { success: true, message: 'All notifications marked as read.' };
  }
}

export default new NotificationService();
