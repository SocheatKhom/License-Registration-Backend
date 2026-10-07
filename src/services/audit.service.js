import { Op } from 'sequelize';
import auditLogRepository from '../repositories/audit-log.repository.js';
import { NotFoundError } from '../errors/api-error.js';

class AuditService {
  /**
   * Record an audit log entry
   */
  async logAction({
    userId = null,
    action,
    entityType,
    entityId = null,
    oldValues = null,
    newValues = null,
    req = null,
    options = {},
  }) {
    try {
      const ipAddress = req
        ? req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress
        : null;
      const userAgent = req ? req.headers['user-agent'] : null;

      const resolvedUserId = userId || (req?.user ? req.user.id : null);

      return await auditLogRepository.create(
        {
          user_id: resolvedUserId,
          action,
          entity_type: entityType,
          entity_id: entityId,
          old_values: oldValues,
          new_values: newValues,
          ip_address: ipAddress ? String(ipAddress).slice(0, 45) : null,
          user_agent: userAgent || null,
        },
        options
      );
    } catch (err) {
      console.error('[AuditService Error]: Failed to create audit log:', err.message);
      return null;
    }
  }

  /**
   * List audit logs with filters and pagination (SUPER_ADMIN only)
   */
  async listAuditLogs(query = {}) {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
    const offset = (page - 1) * limit;

    const where = {};

    if (query.userId) {
      where.user_id = query.userId;
    }

    if (query.action) {
      where.action = query.action;
    }

    if (query.entityType) {
      where.entity_type = query.entityType;
    }

    if (query.entityId) {
      where.entity_id = query.entityId;
    }

    if (query.dateFrom || query.dateTo) {
      where.created_at = {};
      if (query.dateFrom) where.created_at[Op.gte] = new Date(query.dateFrom);
      if (query.dateTo) where.created_at[Op.lte] = new Date(query.dateTo);
    }

    const sortFieldMap = {
      createdAt: 'created_at',
      action: 'action',
      entityType: 'entity_type',
    };
    const sortBy = sortFieldMap[query.sortBy] || 'created_at';
    const sortOrder = query.sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const { count, rows } = await auditLogRepository.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortBy, sortOrder]],
    });

    const totalPages = Math.ceil(count / limit) || 1;

    return {
      auditLogs: rows,
      pagination: {
        page,
        limit,
        totalItems: count,
        totalPages,
      },
    };
  }

  /**
   * Get single audit log record by ID
   */
  async getAuditLogById(id) {
    const log = await auditLogRepository.findById(id);
    if (!log) {
      throw new NotFoundError('Audit log entry not found.', 'AUDIT_LOG_NOT_FOUND');
    }
    return log;
  }
}

export default new AuditService();
