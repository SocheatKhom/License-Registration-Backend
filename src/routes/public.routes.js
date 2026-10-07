import { Router } from 'express';
import licenseController from '../controllers/license.controller.js';

const router = Router();

// Public license verification endpoint (No authentication required)
router.get('/licenses/verify/:token', licenseController.verifyLicensePublic);

export default router;
