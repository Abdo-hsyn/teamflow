import { Sequelize } from 'sequelize';
import 'dotenv/config';

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME || 'teamflow_db',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
    paranoid: true,
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // Import models
    await import('../modules/user/user.model');
    await import('../modules/organization/organization.model');
    await import('../modules/organization/organization-member.model');
    await import('../modules/workspace/workspace.model');
    await import('../modules/project/project.model');

    // Define associations
    const { defineAssociations } = await import('./associations');
    defineAssociations();

    // Sync
    await sequelize.sync({ alter: false });
    console.log('✅ Database synced successfully');

  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

export default sequelize;