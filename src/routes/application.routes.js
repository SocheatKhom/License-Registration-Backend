import { Router } from 'express';
import applicationController from '../controllers/application.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
  validateApplicationId,
  validateCreateApplication,
  validateUpdateApplication,
  validateApplicationQuery,
} from '../validators/application.validator.js';

const router = Router();

// All application endpoints require authentication
router.use(authenticate);

router.post('/', validateCreateApplication, applicationController.createApplication);
router.get('/', validateApplicationQuery, applicationController.listApplications);
router.get('/:id', validateApplicationId, applicationController.getApplicationById);
router.patch('/:id', validateApplicationId, validateUpdateApplication, applicationController.updateApplication);
router.post('/:id/submit', validateApplicationId, applicationController.submitApplication);

export default router;
