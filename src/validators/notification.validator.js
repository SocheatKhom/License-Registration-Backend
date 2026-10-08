import { ValidationError } from '../errors/api-error.js';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const validateNotificationId = (req, res, next) => {
  const { id } = req.params;
  if (!id || !UUID_REGEX.test(id)) {
    return next(new ValidationError([{ field: 'id', message: 'Invalid notification ID format. Must be a valid UUID.' }]));
  }
  next();
};

export const validateNotificationQuery = (req, res, next) => {
  const { page, limit, isRead } = req.query;
  const errors = [];

  if (page !== undefined && (!Number.isInteger(Number(page)) || Number(page) < 1)) {
    errors.push({ field: 'page', message: 'Page must be a positive integer.' });
  }

  if (limit !== undefined && (!Number.isInteger(Number(limit)) || Number(limit) < 1 || Number(limit) > 100)) {
    errors.push({ field: 'limit', message: 'Limit must be an integer between 1 and 100.' });
  }

  if (isRead !== undefined && isRead !== 'true' && isRead !== 'false') {
    errors.push({ field: 'isRead', message: 'isRead must be either "true" or "false".' });
  }

  if (errors.length > 0) {
    return next(new ValidationError(errors));
  }

  next();
};
