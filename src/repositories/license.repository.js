import { License, Application, MediaOutlet, Licensee } from '../models/index.js';

class LicenseRepository {
  async create(data, options = {}) {
    return License.create(data, options);
  }

  async findById(id, { transaction = null } = {}) {
    return License.findByPk(id, {
      include: [
        {
          model: Application,
          as: 'application',
          include: [
            { model: MediaOutlet, as: 'mediaOutlet' },
            { model: Licensee, as: 'licensee' },
          ],
        },
      ],
      transaction,
    });
  }

  async findByApplicationId(applicationId, options = {}) {
    return License.findOne({
      where: { application_id: applicationId },
      ...options,
    });
  }

  async findByVerificationToken(verificationToken, options = {}) {
    return License.findOne({
      where: { verification_token: verificationToken },
      include: [
        {
          model: Application,
          as: 'application',
          include: [
            { model: MediaOutlet, as: 'mediaOutlet' },
            { model: Licensee, as: 'licensee' },
          ],
        },
      ],
      ...options,
    });
  }

  async findAndCountAll({ where = {}, limit = 20, offset = 0, order = [['created_at', 'DESC']] } = {}) {
    return License.findAndCountAll({
      where,
      limit,
      offset,
      order,
      include: [
        {
          model: Application,
          as: 'application',
          include: [
            { model: MediaOutlet, as: 'mediaOutlet' },
            { model: Licensee, as: 'licensee' },
          ],
        },
      ],
    });
  }

  async update(id, updateData, options = {}) {
    const license = await License.findByPk(id, options);
    if (!license) return null;
    return license.update(updateData, options);
  }
}

export default new LicenseRepository();
