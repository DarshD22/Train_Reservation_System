import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Extract database credentials from the .env file
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});


const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL database connected successfully.');
    await sequelize.sync({ force: false }); // Use force: true only if you want to drop and recreate tables
    console.log('Models synced with the database.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export { sequelize, connectDB };
