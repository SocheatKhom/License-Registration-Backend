/**
 * Send standard success response
 * @param {import('express').Response} res
 * @param {string} message
 * @param {any} data
 * @param {number} statusCode
 * @param {object} [pagination]
 */
export const sendSuccess = (res, message = 'Success', data = {}, statusCode = 200, pagination = null) => {
  const payload = {
    success: true,
    message,
    data,
  };

  if (pagination) {
    payload.pagination = pagination;
  }

  return res.status(statusCode).json(payload);
};

/**
 * Send standard error response
 * @param {import('express').Response} res
 * @param {string} message
 * @param {number} statusCode
 * @param {string} code
 * @param {Array<{field: string, message: string}>} [errors]
 */
export const sendError = (res, message = 'An error occurred.', statusCode = 500, code = 'INTERNAL_ERROR', errors = null) => {
  if (errors && Array.isArray(errors) && errors.length > 0) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }

  return res.status(statusCode).json({
    success: false,
    message,
    error: {
      code,
    },
  });
};
