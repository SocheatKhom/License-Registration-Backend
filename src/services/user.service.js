import { Op } from 'sequelize';
import userRepository from '../repositories/user.repository.js';
import auditService from './audit.service.js';
import { hashPassword } from '../utils/password.js';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from '../errors/api-error.js';
import { ROLES } from '../constants/roles.js';
import { USER_STATUS } from '../constants/user-status.js';
import { AUDIT_ACTIONS } from '../constants/audit-actions.js';

class UserService {
  /**
   * Create a new user (Super Admin only)
   */
  async createUser({ name, email, password, role = ROLES.ADMIN }, req = null) {
    const normalizedEmail = email.trim().toLowerCase();

    // Check if email already exists
    const existingUser = await userRepository.findByEmail(normalizedEmail);
    if (existingUser) {
      throw new ConflictError('A user with this email address already exists.', 'EMAIL_ALREADY_EXISTS');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user record
    const user = await userRepository.create({
      name: name.trim(),
      email: normalizedEmail,
      password_hash: hashedPassword,
      role,
      status: USER_STATUS.ACTIVE,
    });

    // Record audit log
    await auditService.logAction({
      action: AUDIT_ACTIONS.USER_CREATED,
      entityType: 'User',
      entityId: user.id,
      newValues: {
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
      req,
    });

    return user.toJSON();
  }

  /**
   * List users with search, filtering, sorting, and pagination
   */
  async listUsers(query = {}) {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
    const offset = (page - 1) * limit;

    const where = {};

    // Search by name or email
    if (query.search && query.search.trim()) {
      const searchPattern = `%${query.search.trim()}%`;
      where[Op.or] = [
        { name: { [Op.iLike]: searchPattern } },
        { email: { [Op.iLike]: searchPattern } },
      ];
    }

    // Filter by role
    if (query.role) {
      where.role = query.role;
    }

    // Filter by status
    if (query.status) {
      where.status = query.status;
    }

    // Sorting
    const sortFieldMap = {
      id: 'id',
      name: 'name',
      email: 'email',
      role: 'role',
      status: 'status',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    };

    const sortBy = sortFieldMap[query.sortBy] || 'created_at';
    const sortOrder = query.sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const { count, rows } = await userRepository.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortBy, sortOrder]],
    });

    const totalPages = Math.ceil(count / limit) || 1;

    return {
      users: rows.map((u) => u.toJSON()),
      pagination: {
        page,
        limit,
        totalItems: count,
        totalPages,
      },
    };
  }

  /**
   * Get single user by ID
   */
  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User not found.', 'USER_NOT_FOUND');
    }
    return user.toJSON();
  }

  /**
   * Update user basic details (e.g. name)
   */
  async updateUser(id, updateData, req = null) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User not found.', 'USER_NOT_FOUND');
    }

    const oldValues = { name: user.name };
    const fieldsToUpdate = {};

    if (updateData.name && updateData.name.trim()) {
      fieldsToUpdate.name = updateData.name.trim();
    }

    await user.update(fieldsToUpdate);

    // Record audit log
    await auditService.logAction({
      action: AUDIT_ACTIONS.USER_UPDATED,
      entityType: 'User',
      entityId: user.id,
      oldValues,
      newValues: { name: user.name },
      req,
    });

    return user.toJSON();
  }

  /**
   * Change user role (Super Admin only)
   */
  async changeRole(id, { role }, req = null) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User not found.', 'USER_NOT_FOUND');
    }

    if (user.role === role) {
      throw new BadRequestError(`User already has the role ${role}.`, 'SAME_ROLE');
    }

    // Guard: Prevent demoting the last active Super Admin
    if (user.role === ROLES.SUPER_ADMIN && role !== ROLES.SUPER_ADMIN) {
      const activeSuperAdminCount = await userRepository.count({
        where: { role: ROLES.SUPER_ADMIN, status: USER_STATUS.ACTIVE },
      });
      if (activeSuperAdminCount <= 1) {
        throw new BadRequestError('Cannot demote the last remaining active Super Admin.', 'LAST_SUPER_ADMIN');
      }
    }

    const oldValues = { role: user.role };
    await user.update({ role });

    // Record audit log
    await auditService.logAction({
      action: AUDIT_ACTIONS.USER_ROLE_CHANGED,
      entityType: 'User',
      entityId: user.id,
      oldValues,
      newValues: { role: user.role },
      req,
    });

    return user.toJSON();
  }

  /**
   * Change user status (Super Admin only)
   */
  async changeStatus(id, { status }, req = null) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User not found.', 'USER_NOT_FOUND');
    }

    if (user.status === status) {
      throw new BadRequestError(`User status is already ${status}.`, 'SAME_STATUS');
    }

    // Guard: Prevent user from deactivating themselves
    if (req?.user && req.user.id === user.id && status === USER_STATUS.INACTIVE) {
      throw new BadRequestError('You cannot deactivate your own account.', 'CANNOT_DEACTIVATE_SELF');
    }

    // Guard: Prevent deactivating the last active Super Admin
    if (user.role === ROLES.SUPER_ADMIN && status === USER_STATUS.INACTIVE) {
      const activeSuperAdminCount = await userRepository.count({
        where: { role: ROLES.SUPER_ADMIN, status: USER_STATUS.ACTIVE },
      });
      if (activeSuperAdminCount <= 1) {
        throw new BadRequestError('Cannot deactivate the last remaining active Super Admin.', 'LAST_SUPER_ADMIN');
      }
    }

    const oldValues = { status: user.status };
    await user.update({ status });

    const auditAction =
      status === USER_STATUS.ACTIVE
        ? AUDIT_ACTIONS.USER_ACTIVATED
        : AUDIT_ACTIONS.USER_DEACTIVATED;

    // Record audit log
    await auditService.logAction({
      action: auditAction,
      entityType: 'User',
      entityId: user.id,
      oldValues,
      newValues: { status: user.status },
      req,
    });

    return user.toJSON();
  }
}

export default new UserService();
