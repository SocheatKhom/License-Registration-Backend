import crypto from 'crypto';
import sequelize from '../config/database.js';
import { Application, MediaOutlet, Licensee } from '../models/index.js';
import applicationRepository from '../repositories/application.repository.js';
import reviewRepository from '../repositories/review.repository.js';
import licenseRepository from '../repositories/license.repository.js';
import auditService from './audit.service.js';
import notificationService from './notification.service.js';
import { generateLicenseNumber } from '../utils/generator.js';
import { BadRequestError, NotFoundError } from '../errors/api-error.js';
import { APPLICATION_STATUS } from '../constants/application-status.js';
import { REVIEW_ACTIONS } from '../constants/review-actions.js';
import { LICENSE_STATUS } from '../constants/license-status.js';
import { AUDIT_ACTIONS } from '../constants/audit-actions.js';
import { NOTIFICATION_TYPES } from '../constants/notification-types.js';

class ReviewService {
  /**
   * Process an application review inside an ACID transaction with row-level locking
   */
  async processReview(applicationId, { action, notes }, reviewer, req = null) {
    return sequelize.transaction(async (t) => {
      // 1. Lock application record to prevent duplicate concurrent reviews (docs/08-review-approval.md)
      const application = await Application.findByPk(applicationId, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });

      if (!application) {
        throw new NotFoundError('Application not found.', 'APPLICATION_NOT_FOUND');
      }

      const mediaOutlet = await MediaOutlet.findByPk(application.media_outlet_id, {
        transaction: t,
      });

      // 2. Validate application status - only SUBMITTED or UNDER_REVIEW can be reviewed
      const reviewableStatuses = [
        APPLICATION_STATUS.SUBMITTED,
        APPLICATION_STATUS.UNDER_REVIEW,
      ];
      if (!reviewableStatuses.includes(application.status)) {
        throw new BadRequestError(
          `Application cannot be reviewed in ${application.status} status. Only SUBMITTED or UNDER_REVIEW applications can be reviewed.`,
          'INVALID_STATUS'
        );
      }

      const fromStatus = application.status;
      let toStatus;
      let auditAction;
      let notificationType;
      let notificationTitle;
      let notificationMessage;
      let issuedLicense = null;

      // 3. Process review action
      if (action === REVIEW_ACTIONS.APPROVE) {
        toStatus = APPLICATION_STATUS.APPROVED;
        auditAction = AUDIT_ACTIONS.APPLICATION_APPROVED;
        notificationType = NOTIFICATION_TYPES.APPLICATION_APPROVED;
        notificationTitle = 'Application Approved';
        notificationMessage = `Your application (${application.application_number}) has been approved!`;

        // Check if license already exists for this application (duplicate approval prevention)
        const existingLicense = await licenseRepository.findByApplicationId(application.id, {
          transaction: t,
        });
        if (existingLicense) {
          throw new BadRequestError('A license has already been issued for this application.', 'LICENSE_EXISTS');
        }

        // Generate license number
        const mediaType = mediaOutlet?.media_type || 'ONLINE';
        const licenseNumber = await generateLicenseNumber(mediaType, t);
        const issuedAt = new Date();
        const expiresAt = new Date(issuedAt.getTime() + 365 * 24 * 60 * 60 * 1000); // 1-year validity
        const verificationToken = crypto.randomUUID();

        // Create License inside the same transaction
        issuedLicense = await licenseRepository.create(
          {
            license_number: licenseNumber,
            application_id: application.id,
            status: LICENSE_STATUS.ACTIVE,
            issued_at: issuedAt,
            expires_at: expiresAt,
            verification_token: verificationToken,
          },
          { transaction: t }
        );

        // Audit license issuance
        await auditService.logAction({
          action: AUDIT_ACTIONS.LICENSE_ISSUED,
          entityType: 'License',
          entityId: issuedLicense.id,
          newValues: {
            license_number: issuedLicense.license_number,
            application_id: application.id,
            status: issuedLicense.status,
          },
          req,
          options: { transaction: t },
        });
      } else if (action === REVIEW_ACTIONS.REJECT) {
        toStatus = APPLICATION_STATUS.REJECTED;
        auditAction = AUDIT_ACTIONS.APPLICATION_REJECTED;
        notificationType = NOTIFICATION_TYPES.APPLICATION_REJECTED;
        notificationTitle = 'Application Rejected';
        notificationMessage = `Your application (${application.application_number}) was rejected. Reason: ${notes}`;
      } else if (action === REVIEW_ACTIONS.REQUEST_INFORMATION) {
        toStatus = APPLICATION_STATUS.NEEDS_INFORMATION;
        auditAction = AUDIT_ACTIONS.APPLICATION_INFORMATION_REQUESTED;
        notificationType = NOTIFICATION_TYPES.APPLICATION_NEEDS_INFORMATION;
        notificationTitle = 'Additional Information Requested';
        notificationMessage = `Additional information is requested for application (${application.application_number}): ${notes}`;
      }

      // 4. Update application status
      await application.update({ status: toStatus }, { transaction: t });

      // 5. Create immutable review record
      const review = await reviewRepository.create(
        {
          application_id: application.id,
          reviewer_id: reviewer.id,
          action,
          notes: notes.trim(),
        },
        { transaction: t }
      );

      // 6. Record status transition in application_status_histories
      await applicationRepository.createStatusHistory(
        {
          application_id: application.id,
          from_status: fromStatus,
          to_status: toStatus,
          changed_by: reviewer.id,
          reason: notes.trim(),
        },
        { transaction: t }
      );

      // 7. Audit application status transition
      await auditService.logAction({
        action: auditAction,
        entityType: 'Application',
        entityId: application.id,
        oldValues: { status: fromStatus },
        newValues: { status: toStatus, notes: notes.trim() },
        req,
        options: { transaction: t },
      });

      // 8. Dispatch notification to applicant
      await notificationService.notify({
        userId: application.user_id,
        type: notificationType,
        title: notificationTitle,
        message: notificationMessage,
        options: { transaction: t },
      });

      return {
        application: await applicationRepository.findById(application.id, { transaction: t }),
        review,
        license: issuedLicense,
      };
    });
  }
}

export default new ReviewService();
