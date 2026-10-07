import { AuditLog, User } from '../models/index.js';

class AuditLogRepository {
  /**
   * Create an audit log record
   * @param {object} logData
   * @param {object} [options]
   */
  async create(logData, options = {}) {
    return AuditLog.create(logData, options);
  }

  /**
   * Find audit log by ID
   * @param {string} id
   */
  async findById(id) {
    return AuditLog.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'role'],
        },
      ],
    });
  }

  /**
   * Find audit logs with pagination and filters
   * @param {object} options
   */
  async findAndCountAll({ where = {}, limit = 20, offset = 0, order = [['created_at', 'DESC']] } = {}) {
    return AuditLog.findAndCountAll({
      where,
      limit,
      offset,
      order,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'role'],
        },
      ],
    });
  }

  /**
   * Find audit logs for a specific entity
   * @param {string} entityType
   * @param {string} entityId
   */
  async findByEntity(entityType, entityId) {
    return AuditLog.findAll({
      where: {
        entity_type: entityType,
        entity_id: entityId,
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'role'],
        },
      ],
      order: [['created_at', 'DESC']],
    });
  }
}

export default new AuditLogRepository();
