import { DataTypes } from 'sequelize';
import { LICENSE_STATUS_LIST } from '../constants/license-status.js';

export const up = async ({ context: queryInterface }) => {
  await queryInterface.createTable('licenses', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    license_number: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    application_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'applications',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    status: {
      type: DataTypes.ENUM(...LICENSE_STATUS_LIST),
      defaultValue: 'ACTIVE',
      allowNull: false,
    },
    issued_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    verification_token: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
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

  await queryInterface.addIndex('licenses', ['license_number'], { unique: true });
  await queryInterface.addIndex('licenses', ['application_id'], { unique: true });
  await queryInterface.addIndex('licenses', ['verification_token'], { unique: true });
  await queryInterface.addIndex('licenses', ['status']);
  await queryInterface.addIndex('licenses', ['issued_at']);
  await queryInterface.addIndex('licenses', ['expires_at']);
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('licenses');
};
