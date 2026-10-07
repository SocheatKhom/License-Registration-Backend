import sequelize from '../config/database.js';
import User from './user.model.js';
import AuditLog from './audit-log.model.js';
import Notification from './notification.model.js';
import MediaOutlet from './media-outlet.model.js';
import Application from './application.model.js';
import Licensee from './licensee.model.js';
import ApplicationStatusHistory from './application-status-history.model.js';
import ApplicationDocument from './application-document.model.js';

// --- Associations ---

// User <-> AuditLog
User.hasMany(AuditLog, { foreignKey: 'user_id', as: 'auditLogs' });
AuditLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User <-> Notification
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User <-> Application
User.hasMany(Application, { foreignKey: 'user_id', as: 'applications' });
Application.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// MediaOutlet <-> Application
MediaOutlet.hasMany(Application, { foreignKey: 'media_outlet_id', as: 'applications' });
Application.belongsTo(MediaOutlet, { foreignKey: 'media_outlet_id', as: 'mediaOutlet' });

// Application <-> Licensee (1:1)
Application.hasOne(Licensee, { foreignKey: 'application_id', as: 'licensee' });
Licensee.belongsTo(Application, { foreignKey: 'application_id', as: 'application' });

// Application <-> ApplicationStatusHistory (1:Many)
Application.hasMany(ApplicationStatusHistory, { foreignKey: 'application_id', as: 'statusHistories' });
ApplicationStatusHistory.belongsTo(Application, { foreignKey: 'application_id', as: 'application' });
ApplicationStatusHistory.belongsTo(User, { foreignKey: 'changed_by', as: 'changedByUser' });

// Application <-> ApplicationDocument (1:Many)
Application.hasMany(ApplicationDocument, { foreignKey: 'application_id', as: 'documents' });
ApplicationDocument.belongsTo(Application, { foreignKey: 'application_id', as: 'application' });

const db = {
  sequelize,
  User,
  AuditLog,
  Notification,
  MediaOutlet,
  Application,
  Licensee,
  ApplicationStatusHistory,
  ApplicationDocument,
};

export {
  User,
  AuditLog,
  Notification,
  MediaOutlet,
  Application,
  Licensee,
  ApplicationStatusHistory,
  ApplicationDocument,
  sequelize,
};

export default db;
