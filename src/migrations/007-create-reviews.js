import { DataTypes } from 'sequelize';
import { REVIEW_ACTION_LIST } from '../constants/review-actions.js';

export const up = async ({ context: queryInterface }) => {
  await queryInterface.createTable('reviews', {
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
    reviewer_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    action: {
      type: DataTypes.ENUM(...REVIEW_ACTION_LIST),
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  await queryInterface.addIndex('reviews', ['application_id']);
  await queryInterface.addIndex('reviews', ['reviewer_id']);
  await queryInterface.addIndex('reviews', ['created_at']);
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('reviews');
};
