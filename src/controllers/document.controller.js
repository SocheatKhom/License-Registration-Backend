import documentService from '../services/document.service.js';
import { sendSuccess } from '../utils/response.js';

class DocumentController {
  /**
   * POST /api/v1/applications/:id/documents
   */
  async uploadDocument(req, res, next) {
    try {
      const document = await documentService.uploadDocument(
        req.params.id,
        req.file,
        req.body,
        req.user,
        req
      );
      return sendSuccess(res, 'Document uploaded successfully.', document, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/applications/:id/documents
   */
  async getDocumentsByApplication(req, res, next) {
    try {
      const documents = await documentService.getDocumentsByApplication(req.params.id);
      return sendSuccess(res, 'Documents retrieved successfully.', documents, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/documents/:id
   * Supports:
   * - default: returns metadata
   * - ?download=true: downloads the file
   * - ?view=true: streams the file to browser
   */
  async getDocument(req, res, next) {
    try {
      const { document, absolutePath } = await documentService.getDocumentById(req.params.id);

      if (req.query.download === 'true') {
        return res.download(absolutePath, document.original_name);
      }

      if (req.query.view === 'true') {
        res.setHeader('Content-Type', document.mime_type);
        res.setHeader('Content-Disposition', `inline; filename="${document.original_name}"`);
        return res.sendFile(absolutePath);
      }

      return sendSuccess(res, 'Document retrieved successfully.', document, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/documents/:id
   */
  async deleteDocument(req, res, next) {
    try {
      const result = await documentService.deleteDocument(req.params.id, req.user, req);
      return sendSuccess(res, 'Document deleted successfully.', result, 200);
    } catch (error) {
      next(error);
    }
  }
}

export default new DocumentController();
