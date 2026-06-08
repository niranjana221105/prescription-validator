import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(
  process.env.PG_DATABASE || 'smart_prescription_db',
  process.env.PG_USER     || 'postgres',
  process.env.PG_PASSWORD || 'postgres',
  {
    host:    process.env.PG_HOST || 'localhost',
    port:    process.env.PG_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
  }
);

export default sequelize;
