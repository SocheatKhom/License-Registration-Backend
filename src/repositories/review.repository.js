import { Review, User } from '../models/index.js';

class ReviewRepository {
  async create(data, options = {}) {
    return Review.create(data, options);
  }

  async findByApplicationId(applicationId, options = {}) {
    return Review.findAll({
      where: { application_id: applicationId },
      include: [
        {
          model: User,
          as: 'reviewer',
          attributes: ['id', 'name', 'email', 'role'],
        },
      ],
      order: [['created_at', 'ASC']],
      ...options,
    });
  }
}

export default new ReviewRepository();
