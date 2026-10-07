import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import { MEDIA_TYPES, MEDIA_TYPE_LIST } from '../constants/media-types.js';

class MediaOutlet extends Model {}

MediaOutlet.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
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
      validate: {
        isEmail: true,
      },
    },
  },
  {
    sequelize,
    modelName: 'MediaOutlet',
    tableName: 'media_outlets',
    underscored: true,
    timestamps: true,
    paranoid: true, // soft delete via deleted_at
    indexes: [
      {
        fields: ['media_type'],
      },
      {
        fields: ['name'],
      },
    ],
  }
);

export default MediaOutlet;
