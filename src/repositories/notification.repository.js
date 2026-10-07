import Notification from '../models/notification.model.js';

class NotificationRepository {
  async create(data, options = {}) {
    return Notification.create(data, options);
  }

  async findByUserId(userId, { limit = 20, offset = 0 } = {}) {
    return Notification.findAndCountAll({
      where: { user_id: userId },
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });
  }
}

export default new NotificationRepository();
