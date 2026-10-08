import { Notification } from '../models/index.js';

class NotificationRepository {
  async create(data, options = {}) {
    return Notification.create(data, options);
  }

  async findById(id) {
    return Notification.findByPk(id);
  }

  async findAndCountAllByUserId(userId, { isRead = undefined, limit = 20, offset = 0 } = {}) {
    const where = { user_id: userId };
    if (isRead !== undefined) {
      where.is_read = isRead;
    }

    return Notification.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });
  }

  async countUnread(userId) {
    return Notification.count({
      where: {
        user_id: userId,
        is_read: false,
      },
    });
  }

  async markAsRead(id) {
    const notification = await Notification.findByPk(id);
    if (!notification) return null;
    return notification.update({
      is_read: true,
      read_at: new Date(),
    });
  }

  async markAllAsRead(userId) {
    return Notification.update(
      {
        is_read: true,
        read_at: new Date(),
      },
      {
        where: {
          user_id: userId,
          is_read: false,
        },
      }
    );
  }
}

export default new NotificationRepository();
