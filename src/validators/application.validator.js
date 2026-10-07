import { ValidationError } from '../errors/api-error.js';
import { APPLICATION_STATUS_LIST } from '../constants/application-status.js';
import { MEDIA_TYPE_LIST } from '../constants/media-types.js';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate Application UUID in route parameters
 */
export const validateApplicationId = (req, res, next) => {
  const { id } = req.params;
  if (!id || !UUID_REGEX.test(id)) {
    return next(new ValidationError([{ field: 'id', message: 'Invalid application ID format. Must be a valid UUID.' }]));
  }
  next();
};

/**
 * Validate application creation payload
 */
export const validateCreateApplication = (req, res, next) => {
  const { mediaOutlet, licensee } = req.body || {};
  const errors = [];

  // Media Outlet validation
  if (!mediaOutlet || typeof mediaOutlet !== 'object') {
    errors.push({ field: 'mediaOutlet', message: 'Media outlet details are required.' });
  } else {
    if (!mediaOutlet.name || typeof mediaOutlet.name !== 'string' || !mediaOutlet.name.trim()) {
      errors.push({ field: 'mediaOutlet.name', message: 'Media outlet name is required.' });
    }
    if (!mediaOutlet.media_type || !MEDIA_TYPE_LIST.includes(mediaOutlet.media_type)) {
      errors.push({
        field: 'mediaOutlet.media_type',
        message: `Media type must be one of: ${MEDIA_TYPE_LIST.join(', ')}.`,
      });
    }
    if (!mediaOutlet.address || typeof mediaOutlet.address !== 'string' || !mediaOutlet.address.trim()) {
      errors.push({ field: 'mediaOutlet.address', message: 'Media outlet address is required.' });
    }
    if (!mediaOutlet.phone || typeof mediaOutlet.phone !== 'string' || !mediaOutlet.phone.trim()) {
      errors.push({ field: 'mediaOutlet.phone', message: 'Media outlet phone number is required.' });
    }
    if (!mediaOutlet.email || typeof mediaOutlet.email !== 'string' || !mediaOutlet.email.trim()) {
      errors.push({ field: 'mediaOutlet.email', message: 'Media outlet email is required.' });
    } else if (!EMAIL_REGEX.test(mediaOutlet.email.trim())) {
      errors.push({ field: 'mediaOutlet.email', message: 'Invalid media outlet email address.' });
    }
  }

  // Licensee validation
  if (!licensee || typeof licensee !== 'object') {
    errors.push({ field: 'licensee', message: 'Licensee details are required.' });
  } else {
    if (!licensee.full_name || typeof licensee.full_name !== 'string' || !licensee.full_name.trim()) {
      errors.push({ field: 'licensee.full_name', message: 'Licensee full name is required.' });
    }
    if (!licensee.national_id || typeof licensee.national_id !== 'string' || !licensee.national_id.trim()) {
      errors.push({ field: 'licensee.national_id', message: 'Licensee national ID is required.' });
    }
    if (!licensee.position || typeof licensee.position !== 'string' || !licensee.position.trim()) {
      errors.push({ field: 'licensee.position', message: 'Licensee position is required.' });
    }
  }

  if (errors.length > 0) {
    return next(new ValidationError(errors));
  }

  next();
};

/**
 * Validate application update payload
 */
export const validateUpdateApplication = (req, res, next) => {
  const { mediaOutlet, licensee } = req.body || {};
  const errors = [];

  if (!mediaOutlet && !licensee) {
    errors.push({
      field: 'body',
      message: 'At least mediaOutlet or licensee details must be provided for update.',
    });
  }

  if (mediaOutlet) {
    if (typeof mediaOutlet !== 'object') {
      errors.push({ field: 'mediaOutlet', message: 'mediaOutlet must be an object.' });
    } else {
      if (mediaOutlet.media_type && !MEDIA_TYPE_LIST.includes(mediaOutlet.media_type)) {
        errors.push({
          field: 'mediaOutlet.media_type',
          message: `Media type must be one of: ${MEDIA_TYPE_LIST.join(', ')}.`,
        });
      }
      if (mediaOutlet.email && !EMAIL_REGEX.test(mediaOutlet.email.trim())) {
        errors.push({ field: 'mediaOutlet.email', message: 'Invalid media outlet email address.' });
      }
    }
  }

  if (licensee && typeof licensee !== 'object') {
    errors.push({ field: 'licensee', message: 'licensee must be an object.' });
  }

  if (errors.length > 0) {
    return next(new ValidationError(errors));
  }

  next();
};

/**
 * Validate listing applications query
 */
export const validateApplicationQuery = (req, res, next) => {
  const { page, limit, status, mediaType, dateFrom, dateTo, sortBy, sortOrder } = req.query;
  const errors = [];

  if (page !== undefined && (!Number.isInteger(Number(page)) || Number(page) < 1)) {
    errors.push({ field: 'page', message: 'Page must be a positive integer.' });
  }

  if (limit !== undefined && (!Number.isInteger(Number(limit)) || Number(limit) < 1 || Number(limit) > 100)) {
    errors.push({ field: 'limit', message: 'Limit must be an integer between 1 and 100.' });
  }

  if (status !== undefined && !APPLICATION_STATUS_LIST.includes(status)) {
    errors.push({ field: 'status', message: `Status must be one of: ${APPLICATION_STATUS_LIST.join(', ')}.` });
  }

  if (mediaType !== undefined && !MEDIA_TYPE_LIST.includes(mediaType)) {
    errors.push({ field: 'mediaType', message: `MediaType must be one of: ${MEDIA_TYPE_LIST.join(', ')}.` });
  }

  if (dateFrom && isNaN(Date.parse(dateFrom))) {
    errors.push({ field: 'dateFrom', message: 'dateFrom must be a valid ISO date.' });
  }

  if (dateTo && isNaN(Date.parse(dateTo))) {
    errors.push({ field: 'dateTo', message: 'dateTo must be a valid ISO date.' });
  }

  const allowedSortFields = ['createdAt', 'submittedAt', 'applicationNumber', 'status'];
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
