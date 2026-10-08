import { DataTypes } from 'sequelize';
import { DOCUMENT_TYPE_LIST } from '../constants/document-types.js';

export const up = async ({ context: queryInterface }) => {
  await queryInterface.createTable('application_documents', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    application_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'applications',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
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
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  await queryInterface.addIndex('application_documents', ['application_id']);
  await queryInterface.addIndex('application_documents', ['document_type']);
  await queryInterface.addIndex('application_documents', ['uploaded_at']);
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('application_documents');
};
