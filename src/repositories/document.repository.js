import { ApplicationDocument } from '../models/index.js';

class DocumentRepository {
  async create(data, options = {}) {
    return ApplicationDocument.create(data, options);
  }

  async findById(id, options = {}) {
    return ApplicationDocument.findByPk(id, options);
  }

  async findByApplicationId(applicationId, options = {}) {
    return ApplicationDocument.findAll({
      where: { application_id: applicationId },
      order: [['uploaded_at', 'DESC']],
      ...options,
    });
  }

  async delete(id, options = {}) {
    const doc = await ApplicationDocument.findByPk(id, options);
    if (!doc) return null;
    await doc.destroy(options);
    return doc;
  }

  async countByApplicationId(applicationId, options = {}) {
    return ApplicationDocument.count({
      where: { application_id: applicationId },
      ...options,
    });
  }
}

export default new DocumentRepository();
