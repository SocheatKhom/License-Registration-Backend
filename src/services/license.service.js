import { Op } from 'sequelize';
import licenseRepository from '../repositories/license.repository.js';
import auditService from './audit.service.js';
import { NotFoundError, BadRequestError } from '../errors/api-error.js';
import { LICENSE_STATUS } from '../constants/license-status.js';
import { AUDIT_ACTIONS } from '../constants/audit-actions.js';

class LicenseService {
  /**
   * List licenses with search, status filtering, and pagination
   */
  async listLicenses(query = {}) {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
    const offset = (page - 1) * limit;

    const where = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.search && query.search.trim()) {
      where.license_number = {
        [Op.iLike]: `%${query.search.trim()}%`,
      };
    }

    const sortFieldMap = {
      createdAt: 'created_at',
      issuedAt: 'issued_at',
      expiresAt: 'expires_at',
      licenseNumber: 'license_number',
      status: 'status',
    };
    const sortBy = sortFieldMap[query.sortBy] || 'created_at';
    const sortOrder = query.sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const { count, rows } = await licenseRepository.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortBy, sortOrder]],
    });

    const totalPages = Math.ceil(count / limit) || 1;

    return {
      licenses: rows,
      pagination: {
        page,
        limit,
        totalItems: count,
        totalPages,
      },
    };
  }

  /**
   * Get license by ID with full associations
   */
  async getLicenseById(id) {
    const license = await licenseRepository.findById(id);
    if (!license) {
      throw new NotFoundError('License not found.', 'LICENSE_NOT_FOUND');
    }
    return license;
  }

  /**
   * Revoke an active license
   */
  async revokeLicense(id, { reason }, reviewer, req = null) {
    const license = await licenseRepository.findById(id);
    if (!license) {
      throw new NotFoundError('License not found.', 'LICENSE_NOT_FOUND');
    }

    if (license.status === LICENSE_STATUS.REVOKED) {
      throw new BadRequestError('License has already been revoked.', 'ALREADY_REVOKED');
    }

    const oldValues = { status: license.status };
    await license.update({ status: LICENSE_STATUS.REVOKED });

    // Record audit log
    await auditService.logAction({
      action: AUDIT_ACTIONS.LICENSE_REVOKED,
      entityType: 'License',
      entityId: license.id,
      oldValues,
      newValues: { status: LICENSE_STATUS.REVOKED, reason: reason.trim() },
      req,
    });

    return license;
  }

  /**
   * Public license verification by token (safe data exposure only)
   */
  async verifyLicensePublic(token) {
    const license = await licenseRepository.findByVerificationToken(token);
    if (!license) {
      throw new NotFoundError('Invalid verification token or license does not exist.', 'LICENSE_NOT_FOUND');
    }

    // Check expiration dynamically
    const now = new Date();
    const isExpired = now > new Date(license.expires_at);
    let publicStatus = license.status;
    if (license.status === LICENSE_STATUS.ACTIVE && isExpired) {
      publicStatus = LICENSE_STATUS.EXPIRED;
    }

    const outlet = license.application?.mediaOutlet;
    const licensee = license.application?.licensee;

    // Return only safe fields as required by docs/09-license-management.md & docs/12-security.md
    return {
      license_number: license.license_number,
      status: publicStatus,
      issued_at: license.issued_at,
      expires_at: license.expires_at,
      media_outlet: outlet
        ? {
            name: outlet.name,
            media_type: outlet.media_type,
            address: outlet.address,
            phone: outlet.phone,
            email: outlet.email,
          }
        : null,
      licensee_name: licensee?.full_name || null,
    };
  }
}

export default new LicenseService();
