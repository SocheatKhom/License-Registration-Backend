import notificationRepository from '../repositories/notification.repository.js';

class NotificationService {
  /**
   * Create a notification record for a user
   * @param {object} params
   * @param {string} params.userId
   * @param {string} params.type
   * @param {string} params.title
   * @param {string} params.message
   * @param {object} [options]
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
}

export default new NotificationService();
