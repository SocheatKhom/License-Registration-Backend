import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import { LICENSE_STATUS, LICENSE_STATUS_LIST } from '../constants/license-status.js';

class License extends Model {}

License.init(
  {
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
    },
    status: {
      type: DataTypes.ENUM(...LICENSE_STATUS_LIST),
      defaultValue: LICENSE_STATUS.ACTIVE,
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
  },
  {
    sequelize,
    modelName: 'License',
    tableName: 'licenses',
    underscored: true,
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['license_number'],
      },
      {
        unique: true,
        fields: ['application_id'],
      },
      {
        unique: true,
        fields: ['verification_token'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['issued_at'],
      },
      {
        fields: ['expires_at'],
      },
    ],
  }
);

export default License;
