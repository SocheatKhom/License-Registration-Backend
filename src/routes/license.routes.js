import { Router } from 'express';
import licenseController from '../controllers/license.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { ROLES } from '../constants/roles.js';
import {
  validateLicenseId,
  validateRevokeLicense,
  validateLicenseQuery,
} from '../validators/license.validator.js';

const router = Router();

// License management routes require authentication
router.use(authenticate);

router.get(
  '/',
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  validateLicenseQuery,
  licenseController.listLicenses
);
router.get('/:id', validateLicenseId, licenseController.getLicenseById);
router.post(
  '/:id/revoke',
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  validateLicenseId,
  validateRevokeLicense,
  licenseController.revokeLicense
);

export default router;
