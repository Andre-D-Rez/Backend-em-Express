import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { connectDB } from './database/connection';
import authRouter from './routes/auth.routes';
import protectedRouter from './routes/protected.routes';
import seriesRouter from './routes/series.routes';
import logger from './utils/logger';
import { swaggerSpec } from './config/swagger';

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  // Swagger JSON endpoint (funciona no Vercel)
  app.get('/api-docs/swagger.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Swagger UI (funciona localmente via swagger-ui-express)
  // No Vercel, use a rota /api-docs que carrega via CDN
  if (process.env.NODE_ENV !== 'production') {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'API Séries - Documentação',
    }));
  } else {
    // Em produção (Vercel), serve HTML que carrega Swagger UI via CDN
    app.get('/api-docs', (_req, res) => {
      res.send(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>API Séries - Documentação</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui.css" />
  <style>
    html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
    *, *:before, *:after { box-sizing: inherit; }
    body { margin: 0; padding: 0; }
    .swagger-ui .topbar { display: none; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        url: window.location.origin + "/api-docs/swagger.json",
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout"
      });
      window.ui = ui;
    };
  </script>
</body>
</html>
      `);
    });
  }

  // Healthcheck e rota raiz
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.get('/', (_req, res) => {
    res.status(200).send('API online. Veja /health, /api-docs ou use as rotas em /api.');
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
