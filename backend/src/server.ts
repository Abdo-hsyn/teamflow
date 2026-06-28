import 'dotenv/config';
import app from './app';
import { connectDatabase } from './config/database';
import redisService from './shared/services/redis.service';

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  await connectDatabase();
  // Initialize Redis
await redisService.get('ping');

  const server = app.listen(PORT, () => {
    console.log(`
  ┌─────────────────────────────────────┐
  │                                     │
  │   🚀 TeamFlow Server Running        │
  │                                     │
  │   App      : ${process.env.APP_NAME}              │
  │   Port     : ${PORT}                         │
  │   Env      : ${process.env.NODE_ENV}     │
  │                                     │
  └─────────────────────────────────────┘
    `);
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
  });

  process.on('unhandledRejection', (err: Error) => {
    console.error('Unhandled Rejection:', err.message);
    server.close(() => process.exit(1));
  });
};

startServer();