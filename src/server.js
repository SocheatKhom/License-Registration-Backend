import dotenv from 'dotenv';
import app from './app.js'; // Note: In ES6 Node, file extensions like .js are required
import sequelize from './config/database.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connected successfully with Sequelize!');

    await sequelize.sync();
    console.log('Models synchronized.');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
}

startServer();