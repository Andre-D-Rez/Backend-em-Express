import { Request, Response } from 'express';

export const getProtected = (req: Request, res: Response) => {
  return res.json({ message: 'Acesso autorizado' });
};
