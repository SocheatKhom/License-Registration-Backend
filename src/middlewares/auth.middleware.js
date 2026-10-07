import { UnauthorizedError, ForbiddenError } from '../errors/api-error.js';
import { verifyToken } from '../utils/jwt.js';
import userRepository from '../repositories/user.repository.js';
import { USER_STATUS } from '../constants/user-status.js';

/**
 * Authenticate JWT token middleware
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication token missing or invalid.', 'TOKEN_MISSING');
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      throw new UnauthorizedError('Token is invalid or expired.', 'TOKEN_EXPIRED');
    }

    const user = await userRepository.findById(decoded.id);
    if (!user) {
      throw new UnauthorizedError('User account not found.', 'USER_NOT_FOUND');
    }

    if (user.status !== USER_STATUS.ACTIVE) {
      throw new UnauthorizedError('User account is inactive.', 'ACCOUNT_INACTIVE');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Role-based authorization middleware
 * @param  {...string} allowedRoles
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError('User is not authenticated.', 'UNAUTHORIZED'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError('You do not have permission to access this resource.', 'FORBIDDEN'));
    }

    next();
  };
};
