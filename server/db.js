import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

let sequelize;

if (process.env.DATABASE_URL) {
  // Neon / production — strip channel_binding as Sequelize doesn't support it
  const dbUrl = process.env.DATABASE_URL
    .replace('&channel_binding=require', '')
    .replace('?channel_binding=require&', '?')
    .replace('?channel_binding=require', '');

  sequelize = new Sequelize(dbUrl, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
  });
} else {
  // Local PostgreSQL
  sequelize = new Sequelize(
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
}

export default sequelize;
