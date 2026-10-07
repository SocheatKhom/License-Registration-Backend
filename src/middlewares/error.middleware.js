import { ApiError } from '../errors/api-error.js';
import { sendError } from '../utils/response.js';

/**
 * Global error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  // If headers already sent, delegate to default express error handler
  if (res.headersSent) {
    return next(err);
  }

  // Handle custom API errors
  if (err instanceof ApiError) {
    return sendError(res, err.message, err.statusCode, err.code, err.errors);
  }

  // Handle Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return sendError(res, 'Validation failed.', 422, 'VALIDATION_ERROR', formattedErrors);
  }

  // Handle Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path,
      message: `${e.path} already exists.`,
    }));
    return sendError(res, 'Duplicate record found.', 409, 'DUPLICATE_ENTRY', formattedErrors);
  }

  // Handle JWT errors if passed through
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return sendError(res, 'Token is invalid or expired.', 401, 'INVALID_TOKEN');
  }

  // Log unexpected errors for internal debugging
  console.error('[Unhandled Error]:', err);

  // Return generic 500 error adhering to doc standard
  return sendError(
    res,
    process.env.NODE_ENV === 'production' ? 'An unexpected error occurred.' : err.message,
    500,
    'INTERNAL_SERVER_ERROR'
  );
};
