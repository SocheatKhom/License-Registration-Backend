import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import { DOCUMENT_TYPES, DOCUMENT_TYPE_LIST } from '../constants/document-types.js';

class ApplicationDocument extends Model {}

ApplicationDocument.init(
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
    document_type: {
      type: DataTypes.ENUM(...DOCUMENT_TYPE_LIST),
      allowNull: false,
    },
    original_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    stored_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    file_path: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    mime_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    file_size: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    uploaded_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'ApplicationDocument',
    tableName: 'application_documents',
    underscored: true,
    timestamps: true,
    indexes: [
      {
        fields: ['application_id'],
      },
      {
        fields: ['document_type'],
      },
      {
        fields: ['uploaded_at'],
      },
    ],
  }
);

export default ApplicationDocument;
