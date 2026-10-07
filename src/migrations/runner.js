import { Umzug, SequelizeStorage } from 'umzug';
import { pathToFileURL } from 'url';
import sequelize from '../config/database.js';

export const migrator = new Umzug({
  migrations: {
    glob: ['src/migrations/0*.js', { cwd: process.cwd() }],
    resolve: ({ name, path: filePath, context }) => {
      return {
        name,
        up: async () => {
          const migration = await import(pathToFileURL(filePath).href);
          return migration.up({ context, Sequelize: sequelize.constructor });
        },
        down: async () => {
          const migration = await import(pathToFileURL(filePath).href);
          return migration.down({ context, Sequelize: sequelize.constructor });
        },
      };
    },
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize, tableName: 'SequelizeMeta' }),
  logger: console,
});

export const runMigrations = async () => {
  const action = process.argv[2] || 'up';
  await sequelize.authenticate();

  if (action === 'up') {
    const executed = await migrator.up();
    console.log(`Successfully executed ${executed.length} migration(s).`);
  } else if (action === 'down') {
    const reverted = await migrator.down();
    console.log(`Successfully reverted ${reverted.length} migration(s).`);
  } else if (action === 'status') {
    const executed = await migrator.executed();
    const pending = await migrator.pending();
    console.log(`Executed migrations (${executed.length}):`, executed.map((m) => m.name));
    console.log(`Pending migrations (${pending.length}):`, pending.map((m) => m.name));
  } else {
    console.log(`Unknown action: ${action}. Available: up, down, status`);
  }
};

if (process.argv[1]?.endsWith('runner.js')) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Migration execution failed:', err);
      process.exit(1);
    });
}
