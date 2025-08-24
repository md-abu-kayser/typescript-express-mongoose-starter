import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import { StudentRoutes } from './app/modules/student/student.route';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';

const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());

// health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is running successfully',
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

// application routes
app.use('/api/v1/students', StudentRoutes);

// Global error handler
app.use(globalErrorHandler);

// Not found route handler
app.use(notFound);

export default app;
