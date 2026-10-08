import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import { ROLES, ROLE_LIST } from '../constants/roles.js';
import { USER_STATUS, USER_STATUS_LIST } from '../constants/user-status.js';

class User extends Model {
  // Omit sensitive fields when converting to JSON
  toJSON() {
    const values = { ...this.get() };
    delete values.password_hash;
    return values;
  }
}

User.init(
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
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(...ROLE_LIST),
      defaultValue: ROLES.ADMIN,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...USER_STATUS_LIST),
      defaultValue: USER_STATUS.ACTIVE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    underscored: true,
    timestamps: true,
    paranoid: true, // soft delete via deleted_at
    indexes: [
      {
        unique: true,
        fields: ['email'],
      },
      {
        fields: ['role'],
      },
      {
        fields: ['status'],
      },
    ],
  }
);

export default User;
