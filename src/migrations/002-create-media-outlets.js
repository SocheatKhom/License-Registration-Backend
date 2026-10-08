import { DataTypes } from 'sequelize';
import { MEDIA_TYPE_LIST } from '../constants/media-types.js';

export const up = async ({ context: queryInterface }) => {
  await queryInterface.createTable('media_outlets', {
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
    media_type: {
      type: DataTypes.ENUM(...MEDIA_TYPE_LIST),
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
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

  await queryInterface.addIndex('media_outlets', ['media_type']);
  await queryInterface.addIndex('media_outlets', ['name']);
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('media_outlets');
};
