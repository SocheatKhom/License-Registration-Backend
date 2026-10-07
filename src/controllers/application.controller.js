import applicationService from '../services/application.service.js';
import { sendSuccess } from '../utils/response.js';

class ApplicationController {
  /**
   * POST /api/v1/applications
   */
  async createApplication(req, res, next) {
    try {
      const application = await applicationService.createApplication(req.body, req.user, req);
      return sendSuccess(res, 'Application created successfully.', application, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/applications
   */
  async listApplications(req, res, next) {
    try {
      const result = await applicationService.listApplications(req.query);
      return sendSuccess(
        res,
        'Applications retrieved successfully.',
        result.applications,
        200,
        result.pagination
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/applications/:id
   */
  async getApplicationById(req, res, next) {
    try {
      const application = await applicationService.getApplicationById(req.params.id);
      return sendSuccess(res, 'Application retrieved successfully.', application, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/applications/:id
   */
  async updateApplication(req, res, next) {
    try {
      const application = await applicationService.updateApplication(req.params.id, req.body, req.user, req);
      return sendSuccess(res, 'Application updated successfully.', application, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/applications/:id/submit
   */
  async submitApplication(req, res, next) {
    try {
      const application = await applicationService.submitApplication(req.params.id, req.user, req);
      return sendSuccess(res, 'Application submitted successfully.', application, 200);
    } catch (error) {
      next(error);
    }
  }
}

export default new ApplicationController();
