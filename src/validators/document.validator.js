import { ValidationError } from '../errors/api-error.js';
import { DOCUMENT_TYPE_LIST } from '../constants/document-types.js';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Validate Document UUID param
 */
export const validateDocumentId = (req, res, next) => {
  const { id } = req.params;
  if (!id || !UUID_REGEX.test(id)) {
    return next(new ValidationError([{ field: 'id', message: 'Invalid document ID format. Must be a valid UUID.' }]));
  }
  next();
};

/**
 * Validate document upload payload
 */
export const validateDocumentUpload = (req, res, next) => {
  const errors = [];
  const { document_type } = req.body || {};

  if (!req.file) {
    errors.push({ field: 'file', message: 'File is required.' });
  }

  if (!document_type || !DOCUMENT_TYPE_LIST.includes(document_type)) {
    errors.push({
      field: 'document_type',
      message: `Document type is required and must be one of: ${DOCUMENT_TYPE_LIST.join(', ')}.`,
    });
  }

  if (errors.length > 0) {
    return next(new ValidationError(errors));
  }

  next();
};
