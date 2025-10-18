import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './database/connection';
import authRouter from './routes/auth.routes';
import protectedRouter from './routes/protected.routes';
import logger from './utils/logger';

export const startServer = (port: number) => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  app.use('/api', authRouter);
  app.use('/api', protectedRouter);

  connectDB()
    .then(() => {
      app.listen(port, () => {
        logger.info('Server running on port %d', port);
      });
    })
    .catch((err: unknown) => {
      logger.error('Failed to connect to DB: %o', err);
      process.exit(1);
    });

  return app;
};
