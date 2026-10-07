import licenseService from '../services/license.service.js';
import { sendSuccess } from '../utils/response.js';

class LicenseController {
  /**
   * GET /api/v1/licenses
   */
  async listLicenses(req, res, next) {
    try {
      const result = await licenseService.listLicenses(req.query);
      return sendSuccess(res, 'Licenses retrieved successfully.', result.licenses, 200, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/licenses/:id
   */
  async getLicenseById(req, res, next) {
    try {
      const license = await licenseService.getLicenseById(req.params.id);
      return sendSuccess(res, 'License retrieved successfully.', license, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/licenses/:id/revoke
   */
  async revokeLicense(req, res, next) {
    try {
      const license = await licenseService.revokeLicense(req.params.id, req.body, req.user, req);
      return sendSuccess(res, 'License revoked successfully.', license, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/public/licenses/verify/:token
   */
  async verifyLicensePublic(req, res, next) {
    try {
      const verificationResult = await licenseService.verifyLicensePublic(req.params.token);
      return sendSuccess(res, 'License verified successfully.', verificationResult, 200);
    } catch (error) {
      next(error);
    }
  }
}

export default new LicenseController();
