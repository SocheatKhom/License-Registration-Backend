import auditLogRepository from '../repositories/audit-log.repository.js';

class AuditService {
  /**
   * Record an audit log entry
   * @param {object} params
   * @param {string} [params.userId]
   * @param {string} params.action
   * @param {string} params.entityType
   * @param {string} [params.entityId]
   * @param {object} [params.oldValues]
   * @param {object} [params.newValues]
   * @param {import('express').Request} [params.req]
   * @param {object} [params.options]
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

      // Extract user ID from req if not explicitly provided
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
      // Audit logging should not crash business operations if database logging fails,
      // but error should be logged
      console.error('[AuditService Error]: Failed to create audit log:', err.message);
      return null;
    }
  }
}

export default new AuditService();
