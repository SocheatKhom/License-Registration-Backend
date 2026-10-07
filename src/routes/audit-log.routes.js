import { Router } from 'express';
import auditLogController from '../controllers/audit-log.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { ROLES } from '../constants/roles.js';
import {
  validateAuditLogId,
  validateAuditLogQuery,
} from '../validators/audit-log.validator.js';

const router = Router();

// Audit log endpoints are strictly for SUPER_ADMIN
router.use(authenticate, authorize(ROLES.SUPER_ADMIN));

router.get('/', validateAuditLogQuery, auditLogController.listAuditLogs);
router.get('/:id', validateAuditLogId, auditLogController.getAuditLogById);

export default router;
