import { Router } from 'express';
import applicationController from '../controllers/application.controller.js';
import documentController from '../controllers/document.controller.js';
import reviewController from '../controllers/review.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { uploadSingleDocument } from '../middlewares/upload.middleware.js';
import { ROLES } from '../constants/roles.js';
import {
  validateApplicationId,
  validateCreateApplication,
  validateUpdateApplication,
  validateApplicationQuery,
} from '../validators/application.validator.js';
import { validateDocumentUpload } from '../validators/document.validator.js';
import { validateReviewAction } from '../validators/review.validator.js';

const router = Router();

// All application endpoints require authentication
router.use(authenticate);

router.post('/', validateCreateApplication, applicationController.createApplication);
router.get('/', validateApplicationQuery, applicationController.listApplications);
router.get('/:id', validateApplicationId, applicationController.getApplicationById);
router.patch('/:id', validateApplicationId, validateUpdateApplication, applicationController.updateApplication);
router.post('/:id/submit', validateApplicationId, applicationController.submitApplication);

// Document endpoints under application
router.post(
  '/:id/documents',
  validateApplicationId,
  uploadSingleDocument('file'),
  validateDocumentUpload,
  documentController.uploadDocument
);
router.get('/:id/documents', validateApplicationId, documentController.getDocumentsByApplication);

// Review endpoint (ADMIN and SUPER_ADMIN only)
router.post(
  '/:id/review',
  validateApplicationId,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  validateReviewAction,
  reviewController.processReview
);

export default router;
