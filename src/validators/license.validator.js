import { ValidationError } from '../errors/api-error.js';
import { LICENSE_STATUS_LIST } from '../constants/license-status.js';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const validateLicenseId = (req, res, next) => {
  const { id } = req.params;
  if (!id || !UUID_REGEX.test(id)) {
    return next(new ValidationError([{ field: 'id', message: 'Invalid license ID format. Must be a valid UUID.' }]));
  }
  next();
};

export const validateRevokeLicense = (req, res, next) => {
  const { reason } = req.body || {};
  const errors = [];

  if (!reason || typeof reason !== 'string' || !reason.trim()) {
    errors.push({ field: 'reason', message: 'Revocation reason is required.' });
  }

  if (errors.length > 0) {
    return next(new ValidationError(errors));
  }

  next();
};

export const validateLicenseQuery = (req, res, next) => {
  const { page, limit, status, sortBy, sortOrder } = req.query;
  const errors = [];

  if (page !== undefined && (!Number.isInteger(Number(page)) || Number(page) < 1)) {
    errors.push({ field: 'page', message: 'Page must be a positive integer.' });
  }

  if (limit !== undefined && (!Number.isInteger(Number(limit)) || Number(limit) < 1 || Number(limit) > 100)) {
    errors.push({ field: 'limit', message: 'Limit must be an integer between 1 and 100.' });
  }

  if (status !== undefined && !LICENSE_STATUS_LIST.includes(status)) {
    errors.push({ field: 'status', message: `Status must be one of: ${LICENSE_STATUS_LIST.join(', ')}.` });
  }

  const allowedSortFields = ['createdAt', 'issuedAt', 'expiresAt', 'licenseNumber', 'status'];
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
