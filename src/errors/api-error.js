export class ApiError extends Error {
  constructor(statusCode, message, code = 'INTERNAL_ERROR', errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends ApiError {
  constructor(message = 'Bad request', code = 'BAD_REQUEST') {
    super(400, message, code);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized', code = 'UNAUTHORIZED') {
    super(401, message, code);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden access', code = 'FORBIDDEN') {
    super(403, message, code);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found', code = 'NOT_FOUND') {
    super(404, message, code);
  }
}

export class ConflictError extends ApiError {
  constructor(message = 'Resource conflict', code = 'CONFLICT') {
    super(409, message, code);
  }
}

export class ValidationError extends ApiError {
  constructor(errors = [], message = 'Validation failed.') {
    super(422, message, 'VALIDATION_ERROR', errors);
  }
}
