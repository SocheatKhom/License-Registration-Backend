import authService from '../services/auth.service.js';
import { sendSuccess } from '../utils/response.js';

class AuthController {
  /**
   * Handle user login
   */
  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);
      return sendSuccess(res, 'Login successful.', result, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle get current user profile
   */
  async me(req, res, next) {
    try {
      const profile = await authService.getProfile(req.user.id);
      return sendSuccess(res, 'User profile retrieved successfully.', profile, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle user logout
   */
  async logout(req, res, next) {
    try {
      // In JWT stateless auth, logout completes on client by discarding token.
      // Server acknowledges with standard success response.
      return sendSuccess(res, 'Logged out successfully.', null, 200);
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
