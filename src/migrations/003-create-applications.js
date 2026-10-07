import { DataTypes } from 'sequelize';
import { APPLICATION_STATUS_LIST } from '../constants/application-status.js';

export const up = async ({ context: queryInterface }) => {
  await queryInterface.createTable('applications', {
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
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    media_outlet_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'media_outlets',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    status: {
      type: DataTypes.ENUM(...APPLICATION_STATUS_LIST),
      defaultValue: 'DRAFT',
      allowNull: false,
    },
    submitted_at: {
      type: DataTypes.DATE,
      allowNull: true,
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
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  await queryInterface.addIndex('applications', ['application_number'], { unique: true });
  await queryInterface.addIndex('applications', ['status']);
  await queryInterface.addIndex('applications', ['user_id']);
  await queryInterface.addIndex('applications', ['media_outlet_id']);
  await queryInterface.addIndex('applications', ['created_at']);
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('applications');
};
