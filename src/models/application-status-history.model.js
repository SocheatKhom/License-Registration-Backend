import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class ApplicationStatusHistory extends Model {}

ApplicationStatusHistory.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    application_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    from_status: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    to_status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    changed_by: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'ApplicationStatusHistory',
    tableName: 'application_status_histories',
    underscored: true,
    timestamps: true,
    updatedAt: false, // history is append-only
    indexes: [
      {
        fields: ['application_id'],
      },
      {
        fields: ['changed_by'],
      },
      {
        fields: ['created_at'],
      },
    ],
  }
);

export default ApplicationStatusHistory;
