import sequelize from '../config/database.js';
import User from './user.model.js';
import AuditLog from './audit-log.model.js';

// Define associations
User.hasMany(AuditLog, { foreignKey: 'user_id', as: 'auditLogs' });
AuditLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

const db = {
  sequelize,
  User,
  AuditLog,
};

export { User, AuditLog, sequelize };
export default db;
