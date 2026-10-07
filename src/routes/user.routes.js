import { Router } from 'express';
import userController from '../controllers/user.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { ROLES } from '../constants/roles.js';
import {
  validateCreateUser,
  validateUpdateUser,
  validateChangeRole,
  validateChangeStatus,
  validateUserListQuery,
  validateUserId,
} from '../validators/user.validator.js';

const router = Router();

// All user management routes require authentication and SUPER_ADMIN role
router.use(authenticate, authorize(ROLES.SUPER_ADMIN));

router.post('/', validateCreateUser, userController.createUser);
router.get('/', validateUserListQuery, userController.listUsers);
router.get('/:id', validateUserId, userController.getUserById);
router.patch('/:id', validateUserId, validateUpdateUser, userController.updateUser);
router.patch('/:id/role', validateUserId, validateChangeRole, userController.changeRole);
router.patch('/:id/status', validateUserId, validateChangeStatus, userController.changeStatus);

export default router;
