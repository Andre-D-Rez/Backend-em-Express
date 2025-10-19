import { createApp } from '../src/app';
import { ensureDBConnected } from '../src/database/connection';

const app = createApp();

export default async function handler(req: any, res: any) {
  await ensureDBConnected();
  // @ts-ignore - Vercel adapter: repassar para o Express
  return app(req, res);
}
