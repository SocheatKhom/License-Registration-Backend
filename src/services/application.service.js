import { Op } from 'sequelize';
import sequelize from '../config/database.js';
import applicationRepository from '../repositories/application.repository.js';
import auditService from './audit.service.js';
import notificationService from './notification.service.js';
import { generateApplicationNumber } from '../utils/generator.js';
import { BadRequestError, NotFoundError } from '../errors/api-error.js';
import { APPLICATION_STATUS } from '../constants/application-status.js';
import { AUDIT_ACTIONS } from '../constants/audit-actions.js';
import { NOTIFICATION_TYPES } from '../constants/notification-types.js';

class ApplicationService {
  /**
   * Create an application in DRAFT status
   */
  async createApplication({ mediaOutlet, licensee }, currentUser, req = null) {
    return sequelize.transaction(async (t) => {
      // 1. Generate unique human-readable application number
      const applicationNumber = await generateApplicationNumber(t);

      // 2. Create Media Outlet
      const createdOutlet = await applicationRepository.createMediaOutlet(
        {
          name: mediaOutlet.name.trim(),
          media_type: mediaOutlet.media_type,
          address: mediaOutlet.address.trim(),
          phone: mediaOutlet.phone.trim(),
          email: mediaOutlet.email.trim().toLowerCase(),
        },
        { transaction: t }
      );

      // 3. Create Application
      const application = await applicationRepository.createApplication(
        {
          application_number: applicationNumber,
          user_id: currentUser.id,
          media_outlet_id: createdOutlet.id,
          status: APPLICATION_STATUS.DRAFT,
        },
        { transaction: t }
      );

      // 4. Create Licensee
      await applicationRepository.createLicensee(
        {
          application_id: application.id,
          full_name: licensee.full_name.trim(),
          national_id: licensee.national_id.trim(),
          nationality: licensee.nationality?.trim() || 'Cambodian',
          position: licensee.position.trim(),
        },
        { transaction: t }
      );

      // 5. Create Initial Status History Record
      await applicationRepository.createStatusHistory(
        {
          application_id: application.id,
          from_status: null,
          to_status: APPLICATION_STATUS.DRAFT,
          changed_by: currentUser.id,
          reason: 'Application draft created.',
        },
        { transaction: t }
      );

      // 6. Record Audit Log
      await auditService.logAction({
        action: AUDIT_ACTIONS.APPLICATION_CREATED,
        entityType: 'Application',
        entityId: application.id,
        newValues: {
          application_number: application.application_number,
          status: application.status,
          media_outlet_id: createdOutlet.id,
        },
        req,
        options: { transaction: t },
      });

      // Return fully hydrated application
      return applicationRepository.findById(application.id, { transaction: t });
    });
  }

  /**
   * List applications with filtering, search, and pagination
   */
  async listApplications(query = {}) {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
    const offset = (page - 1) * limit;

    const where = {};
    const outletWhere = {};

    // Filter by application status
    if (query.status) {
      where.status = query.status;
    }

    // Filter by outlet media_type
    if (query.mediaType) {
      outletWhere.media_type = query.mediaType;
    }

    // Date range filter (created_at)
    if (query.dateFrom || query.dateTo) {
      where.created_at = {};
      if (query.dateFrom) where.created_at[Op.gte] = new Date(query.dateFrom);
      if (query.dateTo) where.created_at[Op.lte] = new Date(query.dateTo);
    }

    // Search by application number or outlet name
    if (query.search && query.search.trim()) {
      const searchPattern = `%${query.search.trim()}%`;
      where[Op.or] = [
        { application_number: { [Op.iLike]: searchPattern } },
        { '$mediaOutlet.name$': { [Op.iLike]: searchPattern } },
      ];
    }

    // Sorting
    const sortFieldMap = {
      createdAt: 'created_at',
      submittedAt: 'submitted_at',
      applicationNumber: 'application_number',
      status: 'status',
    };
    const sortBy = sortFieldMap[query.sortBy] || 'created_at';
    const sortOrder = query.sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const { count, rows } = await applicationRepository.findAndCountAll({
      where,
      outletWhere,
      limit,
      offset,
      order: [[sortBy, sortOrder]],
    });

    const totalPages = Math.ceil(count / limit) || 1;

    return {
      applications: rows,
      pagination: {
        page,
        limit,
        totalItems: count,
        totalPages,
      },
    };
  }

  /**
   * Get single application by ID with full associations
   */
  async getApplicationById(id) {
    const application = await applicationRepository.findById(id);
    if (!application) {
      throw new NotFoundError('Application not found.', 'APPLICATION_NOT_FOUND');
    }
    return application;
  }

  /**
   * Update application in DRAFT or NEEDS_INFORMATION status
   */
  async updateApplication(id, updateData, currentUser, req = null) {
    const application = await applicationRepository.findById(id);
    if (!application) {
      throw new NotFoundError('Application not found.', 'APPLICATION_NOT_FOUND');
    }

    // Guard: Can only update if DRAFT or NEEDS_INFORMATION
    const allowedStatuses = [APPLICATION_STATUS.DRAFT, APPLICATION_STATUS.NEEDS_INFORMATION];
    if (!allowedStatuses.includes(application.status)) {
      throw new BadRequestError(
        `Cannot edit application in ${application.status} status. Only DRAFT or NEEDS_INFORMATION applications can be updated.`,
        'INVALID_STATUS'
      );
    }

    return sequelize.transaction(async (t) => {
      const oldValues = {
        mediaOutlet: application.mediaOutlet ? application.mediaOutlet.toJSON() : null,
        licensee: application.licensee ? application.licensee.toJSON() : null,
      };

      if (updateData.mediaOutlet && application.mediaOutlet) {
        await application.mediaOutlet.update(updateData.mediaOutlet, { transaction: t });
      }

      if (updateData.licensee && application.licensee) {
        await application.licensee.update(updateData.licensee, { transaction: t });
      }

      await auditService.logAction({
        action: AUDIT_ACTIONS.APPLICATION_CREATED, // or updated
        entityType: 'Application',
        entityId: application.id,
        oldValues,
        newValues: updateData,
        req,
        options: { transaction: t },
      });

      return applicationRepository.findById(id, { transaction: t });
    });
  }

  /**
   * Submit application for review
   */
  async submitApplication(id, currentUser, req = null) {
    const application = await applicationRepository.findById(id);
    if (!application) {
      throw new NotFoundError('Application not found.', 'APPLICATION_NOT_FOUND');
    }

    // Guard: Verify current status
    const allowedStatuses = [APPLICATION_STATUS.DRAFT, APPLICATION_STATUS.NEEDS_INFORMATION];
    if (!allowedStatuses.includes(application.status)) {
      throw new BadRequestError(
        `Cannot submit application in ${application.status} status. Only DRAFT or NEEDS_INFORMATION applications can be submitted.`,
        'INVALID_STATUS'
      );
    }

    // Guard: Verify media outlet exists
    if (!application.mediaOutlet) {
      throw new BadRequestError('Media outlet information is required before submission.', 'OUTLET_REQUIRED');
    }

    // Guard: Verify licensee exists
    if (!application.licensee) {
      throw new BadRequestError('Licensee information is required before submission.', 'LICENSEE_REQUIRED');
    }

    return sequelize.transaction(async (t) => {
      const fromStatus = application.status;
      const toStatus = APPLICATION_STATUS.SUBMITTED;
      const submittedAt = new Date();

      // 1. Update application status
      await application.update(
        {
          status: toStatus,
          submitted_at: submittedAt,
        },
        { transaction: t }
      );

      // 2. Record Status History
      await applicationRepository.createStatusHistory(
        {
          application_id: application.id,
          from_status: fromStatus,
          to_status: toStatus,
          changed_by: currentUser.id,
          reason: 'Application submitted for official review.',
        },
        { transaction: t }
      );

      // 3. Dispatch Notification to applicant
      await notificationService.notify({
        userId: application.user_id,
        type: NOTIFICATION_TYPES.APPLICATION_SUBMITTED,
        title: 'Application Submitted',
        message: `Your application (${application.application_number}) has been submitted successfully and is awaiting review.`,
        options: { transaction: t },
      });

      // 4. Create Audit Log
      await auditService.logAction({
        action: AUDIT_ACTIONS.APPLICATION_SUBMITTED,
        entityType: 'Application',
        entityId: application.id,
        oldValues: { status: fromStatus },
        newValues: { status: toStatus, submitted_at: submittedAt },
        req,
        options: { transaction: t },
      });

      return applicationRepository.findById(id, { transaction: t });
    });
  }
}

export default new ApplicationService();
