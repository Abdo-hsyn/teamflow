import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { AppError } from './shared/errors/AppError';
import { errorResponse } from './shared/response/apiResponse';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/user/user.routes';

const app: Application = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    app: process.env.APP_NAME,
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/v1/auth', authRoutes);

app.use('/api/v1/users', userRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json(
    errorResponse(`Route ${req.originalUrl} not found`)
  );
});

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(
      errorResponse(err.message)
    );
  }

  console.error('Unexpected Error:', err);
  return res.status(500).json(
    errorResponse('Internal Server Error')
  );
});

export default app;