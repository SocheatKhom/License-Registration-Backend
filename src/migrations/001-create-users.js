import { DataTypes } from 'sequelize';
import { ROLE_LIST } from '../constants/roles.js';
import { USER_STATUS_LIST } from '../constants/user-status.js';

export const up = async ({ context: queryInterface }) => {
  await queryInterface.createTable('users', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(...ROLE_LIST),
      defaultValue: 'ADMIN',
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...USER_STATUS_LIST),
      defaultValue: 'ACTIVE',
      allowNull: false,
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

  await queryInterface.addIndex('users', ['email'], { unique: true });
  await queryInterface.addIndex('users', ['role']);
  await queryInterface.addIndex('users', ['status']);
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('users');
};
