import {
  Application,
  MediaOutlet,
  Licensee,
  ApplicationStatusHistory,
  Review,
  User,
} from '../models/index.js';

class ApplicationRepository {
  async createApplication(data, options = {}) {
    return Application.create(data, options);
  }

  async createMediaOutlet(data, options = {}) {
    return MediaOutlet.create(data, options);
  }

  async createLicensee(data, options = {}) {
    return Licensee.create(data, options);
  }

  async createStatusHistory(data, options = {}) {
    return ApplicationStatusHistory.create(data, options);
  }

  async findById(id, { includeAll = true, transaction = null } = {}) {
    if (!includeAll) {
      return Application.findByPk(id, { transaction });
    }

    return Application.findByPk(id, {
      include: [
        { model: MediaOutlet, as: 'mediaOutlet' },
        { model: Licensee, as: 'licensee' },
        {
          model: ApplicationStatusHistory,
          as: 'statusHistories',
          include: [{ model: User, as: 'changedByUser', attributes: ['id', 'name', 'email', 'role'] }],
          order: [['created_at', 'ASC']],
        },
        {
          model: Review,
          as: 'reviews',
          include: [{ model: User, as: 'reviewer', attributes: ['id', 'name', 'email', 'role'] }],
        },
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'role'] },
      ],
      transaction,
    });
  }

  async findByApplicationNumber(applicationNumber, { transaction = null } = {}) {
    return Application.findOne({
      where: { application_number: applicationNumber },
      include: [
        { model: MediaOutlet, as: 'mediaOutlet' },
        { model: Licensee, as: 'licensee' },
      ],
      transaction,
    });
  }

  async findAndCountAll({ where = {}, outletWhere = {}, limit = 20, offset = 0, order = [['created_at', 'DESC']] } = {}) {
    return Application.findAndCountAll({
      where,
      limit,
      offset,
      order,
      distinct: true,
      include: [
        {
          model: MediaOutlet,
          as: 'mediaOutlet',
          where: Object.keys(outletWhere).length > 0 ? outletWhere : undefined,
          required: Object.keys(outletWhere).length > 0,
        },
        { model: Licensee, as: 'licensee' },
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'role'] },
      ],
    });
  }

  async update(id, updateData, options = {}) {
    const app = await Application.findByPk(id, options);
    if (!app) return null;
    return app.update(updateData, options);
  }
}

export default new ApplicationRepository();
