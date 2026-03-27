import { Sequelize } from 'sequelize';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'database.sqlite');

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false,
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('SQLite connected successfully.');
    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('Database synced.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};
