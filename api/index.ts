import { createApp } from '../src/app';
import { ensureDBConnected } from '../src/database/connection';

const app = createApp();

export default async function handler(req: any, res: any) {
  // Atenda /health sem tentar conectar ao banco
  if (req.url && req.url.startsWith('/health')) {
    // @ts-ignore - Vercel adapter: repassar para o Express
    return app(req, res);
  }

  try {
    await ensureDBConnected();
  } catch (err) {
    console.error('Database connection failed:', err);
    return res.status(500).json({ error: 'Database connection failed' });
  }

  // @ts-ignore - Vercel adapter: repassar para o Express
  return app(req, res);
}
