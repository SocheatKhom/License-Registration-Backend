import { ValidationError } from '../errors/api-error.js';
import { ROLE_LIST } from '../constants/roles.js';
import { USER_STATUS_LIST } from '../constants/user-status.js';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate UUID in request params
 */
export const validateUserId = (req, res, next) => {
  const { id } = req.params;
  if (!id || !UUID_REGEX.test(id)) {
    return next(new ValidationError([{ field: 'id', message: 'Invalid user ID format. Must be a valid UUID.' }]));
  }
  next();
};

/**
 * Validate user creation
 */
export const validateCreateUser = (req, res, next) => {
  const { name, email, password, role } = req.body || {};
  const errors = [];

  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.push({ field: 'name', message: 'Name is required.' });
  } else if (name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters.' });
  }

  if (!email || typeof email !== 'string' || !email.trim()) {
    errors.push({ field: 'email', message: 'Email is required.' });
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.push({ field: 'email', message: 'Invalid email address.' });
  }

  if (!password || typeof password !== 'string') {
    errors.push({ field: 'password', message: 'Password is required.' });
  } else if (password.length < 8) {
    errors.push({ field: 'password', message: 'Password must be at least 8 characters.' });
  }

  if (role !== undefined && !ROLE_LIST.includes(role)) {
    errors.push({ field: 'role', message: `Role must be one of: ${ROLE_LIST.join(', ')}.` });
  }

  if (errors.length > 0) {
    return next(new ValidationError(errors));
  }

  next();
};

/**
 * Validate user update
 */
export const validateUpdateUser = (req, res, next) => {
  const { name } = req.body || {};
  const errors = [];

  if (name !== undefined) {
    if (typeof name !== 'string' || !name.trim()) {
      errors.push({ field: 'name', message: 'Name cannot be empty.' });
    } else if (name.trim().length < 2) {
      errors.push({ field: 'name', message: 'Name must be at least 2 characters.' });
    }
  } else {
    errors.push({ field: 'name', message: 'At least one field (name) must be provided for update.' });
  }

  if (errors.length > 0) {
    return next(new ValidationError(errors));
  }

  next();
};

/**
 * Validate changing role
 */
export const validateChangeRole = (req, res, next) => {
  const { role } = req.body || {};
  const errors = [];

  if (!role || !ROLE_LIST.includes(role)) {
    errors.push({ field: 'role', message: `Valid role is required. Allowed: ${ROLE_LIST.join(', ')}.` });
  }

  if (errors.length > 0) {
    return next(new ValidationError(errors));
  }

  next();
};

/**
 * Validate changing status
 */
export const validateChangeStatus = (req, res, next) => {
  const { status } = req.body || {};
  const errors = [];

  if (!status || !USER_STATUS_LIST.includes(status)) {
    errors.push({ field: 'status', message: `Valid status is required. Allowed: ${USER_STATUS_LIST.join(', ')}.` });
  }

  if (errors.length > 0) {
    return next(new ValidationError(errors));
  }

  next();
};

/**
 * Validate listing users query parameters
 */
export const validateUserListQuery = (req, res, next) => {
  const { page, limit, role, status, sortBy, sortOrder } = req.query;
  const errors = [];

  if (page !== undefined && (!Number.isInteger(Number(page)) || Number(page) < 1)) {
    errors.push({ field: 'page', message: 'Page must be a positive integer.' });
  }

  if (limit !== undefined && (!Number.isInteger(Number(limit)) || Number(limit) < 1 || Number(limit) > 100)) {
    errors.push({ field: 'limit', message: 'Limit must be an integer between 1 and 100.' });
  }

  if (role !== undefined && !ROLE_LIST.includes(role)) {
    errors.push({ field: 'role', message: `Role must be one of: ${ROLE_LIST.join(', ')}.` });
  }

  if (status !== undefined && !USER_STATUS_LIST.includes(status)) {
    errors.push({ field: 'status', message: `Status must be one of: ${USER_STATUS_LIST.join(', ')}.` });
  }

  const allowedSortFields = ['id', 'name', 'email', 'role', 'status', 'createdAt', 'updatedAt'];
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
