import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import { REVIEW_ACTIONS, REVIEW_ACTION_LIST } from '../constants/review-actions.js';

class Review extends Model {}

Review.init(
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
    reviewer_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    action: {
      type: DataTypes.ENUM(...REVIEW_ACTION_LIST),
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Review',
    tableName: 'reviews',
    underscored: true,
    timestamps: true,
    updatedAt: false, // Reviews are immutable records of historical review decisions
    indexes: [
      {
        fields: ['application_id'],
      },
      {
        fields: ['reviewer_id'],
      },
      {
        fields: ['created_at'],
      },
    ],
  }
);

export default Review;
