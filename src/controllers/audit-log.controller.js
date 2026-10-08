import auditService from '../services/audit.service.js';
import { sendSuccess } from '../utils/response.js';

class AuditLogController {
  /**
   * GET /api/v1/audit-logs
   */
  async listAuditLogs(req, res, next) {
    try {
      const result = await auditService.listAuditLogs(req.query);
      return sendSuccess(
        res,
        'Audit logs retrieved successfully.',
        result.auditLogs,
        200,
        result.pagination
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/audit-logs/:id
   */
  async getAuditLogById(req, res, next) {
    try {
      const log = await auditService.getAuditLogById(req.params.id);
      return sendSuccess(res, 'Audit log retrieved successfully.', log, 200);
    } catch (error) {
      next(error);
    }
  }
}

export default new AuditLogController();
