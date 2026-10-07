import fs from 'fs';
import path from 'path';
import documentRepository from '../repositories/document.repository.js';
import applicationRepository from '../repositories/application.repository.js';
import auditService from './audit.service.js';
import { BadRequestError, NotFoundError } from '../errors/api-error.js';
import { APPLICATION_STATUS } from '../constants/application-status.js';
import { AUDIT_ACTIONS } from '../constants/audit-actions.js';

class DocumentService {
  /**
   * Upload and register a document for an application
   */
  async uploadDocument(applicationId, file, { document_type }, currentUser, req = null) {
    const application = await applicationRepository.findById(applicationId);
    if (!application) {
      // Remove uploaded file if application does not exist
      if (file && fs.existsSync(file.path)) {
        await fs.promises.unlink(file.path).catch(() => {});
      }
      throw new NotFoundError('Application not found.', 'APPLICATION_NOT_FOUND');
    }

    // Guard: Only allow uploads in DRAFT or NEEDS_INFORMATION status
    const allowedStatuses = [APPLICATION_STATUS.DRAFT, APPLICATION_STATUS.NEEDS_INFORMATION];
    if (!allowedStatuses.includes(application.status)) {
      if (file && fs.existsSync(file.path)) {
        await fs.promises.unlink(file.path).catch(() => {});
      }
      throw new BadRequestError(
        `Cannot upload documents for an application in ${application.status} status. Documents can only be added to DRAFT or NEEDS_INFORMATION applications.`,
        'INVALID_STATUS'
      );
    }

    // Save document metadata
    const document = await documentRepository.create({
      application_id: applicationId,
      document_type,
      original_name: file.originalname,
      stored_name: file.filename,
      file_path: file.path,
      mime_type: file.mimetype,
      file_size: file.size,
      uploaded_at: new Date(),
    });

    // Record audit log
    await auditService.logAction({
      action: AUDIT_ACTIONS.DOCUMENT_UPLOADED,
      entityType: 'ApplicationDocument',
      entityId: document.id,
      newValues: {
        application_id: applicationId,
        document_type: document.document_type,
        original_name: document.original_name,
        stored_name: document.stored_name,
        file_size: document.file_size,
      },
      req,
    });

    return document;
  }

  /**
   * Get all documents associated with an application
   */
  async getDocumentsByApplication(applicationId) {
    const application = await applicationRepository.findById(applicationId);
    if (!application) {
      throw new NotFoundError('Application not found.', 'APPLICATION_NOT_FOUND');
    }

    return documentRepository.findByApplicationId(applicationId);
  }

  /**
   * Get document record and verify physical file exists
   */
  async getDocumentById(id) {
    const document = await documentRepository.findById(id);
    if (!document) {
      throw new NotFoundError('Document not found.', 'DOCUMENT_NOT_FOUND');
    }

    const absolutePath = path.resolve(document.file_path);
    if (!fs.existsSync(absolutePath)) {
      throw new NotFoundError('Physical document file not found on disk.', 'FILE_NOT_FOUND');
    }

    return {
      document,
      absolutePath,
    };
  }

  /**
   * Delete a document
   */
  async deleteDocument(id, currentUser, req = null) {
    const document = await documentRepository.findById(id);
    if (!document) {
      throw new NotFoundError('Document not found.', 'DOCUMENT_NOT_FOUND');
    }

    const application = await applicationRepository.findById(document.application_id);
    if (application) {
      const allowedStatuses = [APPLICATION_STATUS.DRAFT, APPLICATION_STATUS.NEEDS_INFORMATION];
      if (!allowedStatuses.includes(application.status)) {
        throw new BadRequestError(
          `Cannot delete documents for an application in ${application.status} status.`,
          'INVALID_STATUS'
        );
      }
    }

    // Delete physical file from disk
    if (document.file_path && fs.existsSync(document.file_path)) {
      await fs.promises.unlink(document.file_path).catch((err) => {
        console.error('[DocumentService] Failed to remove file from disk:', err.message);
      });
    }

    const oldValues = {
      id: document.id,
      application_id: document.application_id,
      document_type: document.document_type,
      original_name: document.original_name,
    };

    // Delete database record
    await documentRepository.delete(id);

    // Record audit log
    await auditService.logAction({
      action: AUDIT_ACTIONS.DOCUMENT_DELETED,
      entityType: 'ApplicationDocument',
      entityId: id,
      oldValues,
      req,
    });

    return oldValues;
  }
}

export default new DocumentService();
