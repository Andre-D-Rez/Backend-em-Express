import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';
import { isValidEmail, isStrongPassword, isValidName } from '../utils/validators';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env';

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Registrar novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuário criado com sucesso
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       422:
 *         description: Dados inválidos ou email já cadastrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body as { name?: string; email?: string; password?: string };
    if (!name || !email || !password) {
      logger.warn('Register: dados incompletos');
      return res.status(422).json({ message: 'Dados incompletos' });
    }

    if (!isValidName(name)) {
      logger.warn('Register: nome inválido');
      return res.status(422).json({ message: 'Nome inválido (mínimo 2 caracteres)' });
    }
    if (!isValidEmail(email)) {
      logger.warn('Register: email inválido');
      return res.status(422).json({ message: 'Email inválido' });
    }
    if (!isStrongPassword(password)) {
      logger.warn('Register: senha fraca');
      return res.status(422).json({ message: 'Senha inválida (mín. 8 chars, maiúscula, minúscula, número e caractere especial)' });
    }

    const existing = await userService.findUserByEmail(email);
    if (existing) {
      logger.info('Register: email já cadastrado - %s', email);
      return res.status(422).json({ message: 'Email já cadastrado' });
    }

    const user = await userService.createUser({ name, email, password });
    logger.info('Register: usuário criado %s (%s)', user._id.toString(), user.email);
    return res.status(201).json({ message: 'Usuário criado com sucesso', user: { id: user._id, name: user.name, email: user.email } });
  } catch (err: any) {
    if (err && err.code === 11000) {
      logger.warn('Register: violação de unique index (email)');
      return res.status(422).json({ message: 'Email já cadastrado' });
    }
    logger.error('Register error: %o', err);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
};

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login de usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login realizado com sucesso
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       401:
 *         description: Credenciais inválidas
 *       422:
 *         description: Dados incompletos ou inválidos
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email || !password) {
      logger.warn('Login: dados incompletos');
      return res.status(422).json({ message: 'Dados incompletos' });
    }

    if (!isValidEmail(email)) {
      logger.warn('Login: email inválido');
      return res.status(422).json({ message: 'Email inválido' });
    }

    const user = await userService.findUserByEmail(email);
    if (!user) {
      logger.info('Login: usuário não encontrado - %s', email);
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const bcrypt = await import('bcrypt');
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      logger.info('Login: senha inválida para %s', email);
      return res.status(401).json({ message: 'Senha inválida' });
    }

    // jwt.sign type definitions are sometimes strict; cast to any to satisfy TS here
    const secret = (JWT_SECRET || '') as any;
    const token = (jwt as any).sign({ id: user._id, email: user.email }, secret, { expiresIn: JWT_EXPIRES_IN } as any);
    logger.info('Login: token emitido para %s', email);
    return res.json({ token });
  } catch (err) {
    logger.error('Login error: %o', err);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
};
