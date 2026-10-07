import sequelize from '../config/database.js';
import User from './user.model.js';

const db = {
  sequelize,
  User,
};

export { User, sequelize };
export default db;
