import dotenv from 'dotenv';
dotenv.config();

import sequelize from '../config/database.js';
import User from '../models/user.model.js';
import { hashPassword } from '../utils/password.js';
import { ROLES } from '../constants/roles.js';
import { USER_STATUS } from '../constants/user-status.js';

export const seedSuperAdmin = async () => {
  const defaultEmail = process.env.INITIAL_SUPER_ADMIN_EMAIL || 'admin@example.com';
  const defaultPassword = process.env.INITIAL_SUPER_ADMIN_PASSWORD || 'Password123!';
  const defaultName = process.env.INITIAL_SUPER_ADMIN_NAME || 'Super Administrator';

  const existingAdmin = await User.findOne({ where: { email: defaultEmail } });
  if (existingAdmin) {
    console.log(`[Seed] Super Admin (${defaultEmail}) already exists.`);
    return existingAdmin;
  }

  const hashedPassword = await hashPassword(defaultPassword);
  const superAdmin = await User.create({
    name: defaultName,
    email: defaultEmail,
    password_hash: hashedPassword,
    role: ROLES.SUPER_ADMIN,
    status: USER_STATUS.ACTIVE,
  });

  console.log(`[Seed] Initial Super Admin created successfully: ${defaultEmail}`);
  return superAdmin;
};

// Allow running directly via `node src/seeders/seed-super-admin.js`
if (process.argv[1]?.endsWith('seed-super-admin.js')) {
  (async () => {
    try {
      await sequelize.authenticate();
      await sequelize.sync();
      await seedSuperAdmin();
      process.exit(0);
    } catch (error) {
      console.error('[Seed Error]:', error);
      process.exit(1);
    }
  })();
}
