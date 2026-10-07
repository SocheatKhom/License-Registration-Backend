import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import { APPLICATION_STATUS, APPLICATION_STATUS_LIST } from '../constants/application-status.js';

class Application extends Model {}

Application.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    application_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    media_outlet_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...APPLICATION_STATUS_LIST),
      defaultValue: APPLICATION_STATUS.DRAFT,
      allowNull: false,
    },
    submitted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Application',
    tableName: 'applications',
    underscored: true,
    timestamps: true,
    paranoid: true, // soft delete via deleted_at
    indexes: [
      {
        unique: true,
        fields: ['application_number'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['user_id'],
      },
      {
        fields: ['media_outlet_id'],
      },
      {
        fields: ['created_at'],
      },
    ],
  }
);

export default Application;
