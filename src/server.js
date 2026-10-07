import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import sequelize from './config/database.js';
import './models/index.js';
import { seedSuperAdmin } from './seeders/seed-super-admin.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connected successfully with Sequelize!');

    // In production, migrations should be run via npm run db:migrate (docs/03-database-design.md)
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync();
      console.log('Models synchronized.');
    }

    // Ensure baseline super admin is present
    await seedSuperAdmin();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
}

startServer();