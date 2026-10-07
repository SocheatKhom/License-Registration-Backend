import AuditLog from '../models/audit-log.model.js';

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
   * Find audit logs with pagination and filters
   * @param {object} options
   */
  async findAndCountAll(options = {}) {
    return AuditLog.findAndCountAll(options);
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
      order: [['created_at', 'DESC']],
    });
  }
}

export default new AuditLogRepository();
