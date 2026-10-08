import userService from '../services/user.service.js';
import { sendSuccess } from '../utils/response.js';

class UserController {
  /**
   * POST /api/v1/users
   */
  async createUser(req, res, next) {
    try {
      const user = await userService.createUser(req.body, req);
      return sendSuccess(res, 'User created successfully.', user, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/users
   */
  async listUsers(req, res, next) {
    try {
      const result = await userService.listUsers(req.query);
      return sendSuccess(
        res,
        'Users retrieved successfully.',
        result.users,
        200,
        result.pagination
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/users/:id
   */
  async getUserById(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id);
      return sendSuccess(res, 'User retrieved successfully.', user, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/users/:id
   */
  async updateUser(req, res, next) {
    try {
      const updatedUser = await userService.updateUser(req.params.id, req.body, req);
      return sendSuccess(res, 'User updated successfully.', updatedUser, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/users/:id/role
   */
  async changeRole(req, res, next) {
    try {
      const updatedUser = await userService.changeRole(req.params.id, req.body, req);
      return sendSuccess(res, 'User role updated successfully.', updatedUser, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/users/:id/status
   */
  async changeStatus(req, res, next) {
    try {
      const updatedUser = await userService.changeStatus(req.params.id, req.body, req);
      return sendSuccess(res, 'User status updated successfully.', updatedUser, 200);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
