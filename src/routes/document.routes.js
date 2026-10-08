import { Router } from 'express';
import documentController from '../controllers/document.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validateDocumentId } from '../validators/document.validator.js';

const router = Router();

// All document operations require authentication
router.use(authenticate);

router.get('/:id', validateDocumentId, documentController.getDocument);
router.delete('/:id', validateDocumentId, documentController.deleteDocument);

export default router;
