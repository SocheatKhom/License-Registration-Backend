import { DataTypes } from 'sequelize';
import { NOTIFICATION_TYPE_LIST } from '../constants/notification-types.js';

export const up = async ({ context: queryInterface }) => {
  await queryInterface.createTable('notifications', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
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
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    read_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  await queryInterface.addIndex('notifications', ['user_id']);
  await queryInterface.addIndex('notifications', ['is_read']);
  await queryInterface.addIndex('notifications', ['created_at']);
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('notifications');
};
