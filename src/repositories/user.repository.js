import User from '../models/user.model.js';

class UserRepository {
  async findByEmail(email, { includePassword = false } = {}) {
    if (includePassword) {
      return User.findOne({ where: { email } });
    }
    return User.findOne({
      where: { email },
      attributes: { exclude: ['password_hash'] },
    });
  }

  async findById(id, { includePassword = false } = {}) {
    if (includePassword) {
      return User.findByPk(id);
    }
    return User.findByPk(id, {
      attributes: { exclude: ['password_hash'] },
    });
  }

  async create(userData, options = {}) {
    return User.create(userData, options);
  }

  async count(options = {}) {
    return User.count(options);
  }

  async update(id, updateData, options = {}) {
    const user = await User.findByPk(id);
    if (!user) return null;
    return user.update(updateData, options);
  }
}

export default new UserRepository();
