import { Router } from 'express';
import applicationController from '../controllers/application.controller.js';
import documentController from '../controllers/document.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { uploadSingleDocument } from '../middlewares/upload.middleware.js';
import {
  validateApplicationId,
  validateCreateApplication,
  validateUpdateApplication,
  validateApplicationQuery,
} from '../validators/application.validator.js';
import { validateDocumentUpload } from '../validators/document.validator.js';

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

export default router;
