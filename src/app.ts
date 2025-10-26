import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './database/connection';
import authRouter from './routes/auth.routes';
import protectedRouter from './routes/protected.routes';
import seriesRouter from './routes/series.routes';
import logger from './utils/logger';

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  // Healthcheck e rota raiz
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.get('/', (_req, res) => {
    res.status(200).send('API online. Veja /health ou use as rotas em /api.');
  });

  app.use('/api', authRouter);
  app.use('/api', protectedRouter);
  app.use('/api', seriesRouter);

  return app;
};

export const startServer = (port: number) => {
  const app = createApp();

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
