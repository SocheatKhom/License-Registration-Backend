import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Licensee extends Model {}

Licensee.init(
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
      unique: true,
    },
    full_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    national_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    nationality: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'Cambodian',
    },
    position: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Licensee',
    tableName: 'licensees',
    underscored: true,
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['application_id'],
      },
      {
        fields: ['national_id'],
      },
    ],
  }
);

export default Licensee;
