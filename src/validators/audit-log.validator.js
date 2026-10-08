import { ValidationError } from '../errors/api-error.js';
import { AUDIT_ACTION_LIST } from '../constants/audit-actions.js';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const validateAuditLogId = (req, res, next) => {
  const { id } = req.params;
  if (!id || !UUID_REGEX.test(id)) {
    return next(new ValidationError([{ field: 'id', message: 'Invalid audit log ID format. Must be a valid UUID.' }]));
  }
  next();
};

export const validateAuditLogQuery = (req, res, next) => {
  const { page, limit, action, entityId, dateFrom, dateTo, sortBy, sortOrder } = req.query;
  const errors = [];

  if (page !== undefined && (!Number.isInteger(Number(page)) || Number(page) < 1)) {
    errors.push({ field: 'page', message: 'Page must be a positive integer.' });
  }

  if (limit !== undefined && (!Number.isInteger(Number(limit)) || Number(limit) < 1 || Number(limit) > 100)) {
    errors.push({ field: 'limit', message: 'Limit must be an integer between 1 and 100.' });
  }

  if (action !== undefined && !AUDIT_ACTION_LIST.includes(action)) {
    errors.push({ field: 'action', message: `Action must be one of: ${AUDIT_ACTION_LIST.join(', ')}.` });
  }

  if (entityId !== undefined && !UUID_REGEX.test(entityId)) {
    errors.push({ field: 'entityId', message: 'entityId must be a valid UUID.' });
  }

  if (dateFrom && isNaN(Date.parse(dateFrom))) {
    errors.push({ field: 'dateFrom', message: 'dateFrom must be a valid ISO date.' });
  }

  if (dateTo && isNaN(Date.parse(dateTo))) {
    errors.push({ field: 'dateTo', message: 'dateTo must be a valid ISO date.' });
  }

  const allowedSortFields = ['createdAt', 'action', 'entityType'];
  if (sortBy !== undefined && !allowedSortFields.includes(sortBy)) {
    errors.push({ field: 'sortBy', message: `SortBy must be one of: ${allowedSortFields.join(', ')}.` });
  }

  if (sortOrder !== undefined && !['ASC', 'DESC'].includes(sortOrder.toUpperCase())) {
    errors.push({ field: 'sortOrder', message: 'SortOrder must be ASC or DESC.' });
  }

  if (errors.length > 0) {
    return next(new ValidationError(errors));
  }

  next();
};
