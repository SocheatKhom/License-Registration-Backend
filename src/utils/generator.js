import { Application, License } from '../models/index.js';
import { Op } from 'sequelize';

/**
 * Generate human-readable application number: APP-{YEAR}-{SEQUENCE}
 * Example: APP-2026-000001
 * @param {import('sequelize').Transaction} [transaction]
 * @returns {Promise<string>}
 */
export const generateApplicationNumber = async (transaction = null) => {
  const currentYear = new Date().getFullYear();
  const prefix = `APP-${currentYear}-`;

  const latestApp = await Application.findOne({
    where: {
      application_number: {
        [Op.like]: `${prefix}%`,
      },
    },
    order: [['created_at', 'DESC']],
    paranoid: false,
    transaction,
  });

  let nextSequence = 1;

  if (latestApp && latestApp.application_number) {
    const parts = latestApp.application_number.split('-');
    if (parts.length === 3) {
      const lastSeq = parseInt(parts[2], 10);
      if (!isNaN(lastSeq)) {
        nextSequence = lastSeq + 1;
      }
    }
  }

  const paddedSequence = String(nextSequence).padStart(6, '0');
  return `${prefix}${paddedSequence}`;
};

/**
 * Generate human-readable license number: MIC-{YEAR}-{MEDIA_TYPE}-{SEQUENCE}
 * Example: MIC-2026-ONLINE-000001
 * @param {string} mediaType - ONLINE, TELEVISION, RADIO, PRINT
 * @param {import('sequelize').Transaction} [transaction]
 * @returns {Promise<string>}
 */
export const generateLicenseNumber = async (mediaType, transaction = null) => {
  const currentYear = new Date().getFullYear();
  const safeMediaType = (mediaType || 'ONLINE').toUpperCase();
  const prefix = `MIC-${currentYear}-${safeMediaType}-`;

  const latestLicense = await License.findOne({
    where: {
      license_number: {
        [Op.like]: `${prefix}%`,
      },
    },
    order: [['created_at', 'DESC']],
    transaction,
  });

  let nextSequence = 1;

  if (latestLicense && latestLicense.license_number) {
    const parts = latestLicense.license_number.split('-');
    if (parts.length === 4) {
      const lastSeq = parseInt(parts[3], 10);
      if (!isNaN(lastSeq)) {
        nextSequence = lastSeq + 1;
      }
    }
  }

  const paddedSequence = String(nextSequence).padStart(6, '0');
  return `${prefix}${paddedSequence}`;
};
