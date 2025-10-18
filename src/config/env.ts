export const PORT = Number(process.env.PORT || 3000);

export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
export const MONGO_URI = process.env.MONGO_URI;

export const validateEnv = () => {
  const missing: string[] = [];
  if (!JWT_SECRET) missing.push('JWT_SECRET');
  if (!MONGO_URI) missing.push('MONGO_URI');
  if (missing.length) {
    throw new Error(`Variáveis de ambiente ausentes: ${missing.join(', ')}`);
  }
};
