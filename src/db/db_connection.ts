import * as dotenv from "dotenv";
import { Sequelize } from 'sequelize';

if (process.env.NODE_ENV !== 'production') dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME || 'TaskService', process.env.DB_USERNAME || 'postgres', process.env.DB_PASSWORD || 'postgres', {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres'
});