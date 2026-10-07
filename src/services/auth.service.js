import userRepository from '../repositories/user.repository.js';
import { comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import { UnauthorizedError, NotFoundError } from '../errors/api-error.js';
import { USER_STATUS } from '../constants/user-status.js';

class AuthService {
  /**
   * Authenticate user with email and password
   * @param {{ email: string, password: string }} credentials
   * @returns {Promise<{ token: string, user: object }>}
   */
  async login({ email, password }) {
    const normalizedEmail = email.trim().toLowerCase();

    // Retrieve user including password_hash for credential check
    const user = await userRepository.findByEmail(normalizedEmail, { includePassword: true });
    if (!user) {
      throw new UnauthorizedError('Invalid email or password.', 'INVALID_CREDENTIALS');
    }

    // Verify user is active
    if (user.status !== USER_STATUS.ACTIVE) {
      throw new UnauthorizedError('Your account is deactivated. Please contact an administrator.', 'ACCOUNT_INACTIVE');
    }

    // Verify password hash
    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password.', 'INVALID_CREDENTIALS');
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: user.toJSON(),
    };
  }

  /**
   * Get current authenticated user profile
   * @param {string} userId
   * @returns {Promise<object>}
   */
  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User profile not found.', 'USER_NOT_FOUND');
    }
    return user.toJSON();
  }
}

export default new AuthService();
