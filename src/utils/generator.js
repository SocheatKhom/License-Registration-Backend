import Application from '../models/application.model.js';
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

  // Find latest application created in the current year
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
