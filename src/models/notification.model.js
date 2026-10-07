import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import { NOTIFICATION_TYPES, NOTIFICATION_TYPE_LIST } from '../constants/notification-types.js';

class Notification extends Model {}

Notification.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(...NOTIFICATION_TYPE_LIST),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    read_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Notification',
    tableName: 'notifications',
    underscored: true,
    timestamps: true,
    updatedAt: false, // only created_at needed per docs
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['is_read'],
      },
      {
        fields: ['created_at'],
      },
    ],
  }
);

export default Notification;
