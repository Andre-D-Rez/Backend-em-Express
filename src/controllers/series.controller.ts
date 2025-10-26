import { Request, Response } from 'express';
import * as seriesService from '../services/series.service';
import logger from '../utils/logger';
import { SeriesStatus } from '../models/series.model';

// Interface estendida do Request com user
interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

/**
 * @swagger
 * /api/series:
 *   post:
 *     summary: Criar nova série
 *     tags: [Series]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - nota
 *               - numeroTemporadas
 *               - episodiosTotais
 *               - episodiosAssistidos
 *               - status
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: Breaking Bad
 *               nota:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 10
 *                 example: 9.5
 *               numeroTemporadas:
 *                 type: integer
 *                 minimum: 1
 *                 example: 5
 *               episodiosTotais:
 *                 type: integer
 *                 minimum: 1
 *                 example: 62
 *               episodiosAssistidos:
 *                 type: integer
 *                 minimum: 0
 *                 example: 45
 *               status:
 *                 type: string
 *                 enum: [planejado, assistindo, concluido]
 *                 example: assistindo
 *     responses:
 *       201:
 *         description: Série criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 series:
 *                   $ref: '#/components/schemas/Series'
 *       401:
 *         description: Não autenticado
 *       422:
 *         description: Dados inválidos
 */
export const createSeries = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      logger.warn('CreateSeries: usuário não autenticado');
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    const { titulo, nota, numeroTemporadas, episodiosTotais, episodiosAssistidos, status } = req.body;

    // Validações de campos obrigatórios (todos obrigatórios)
    const missing: string[] = [];
    if (!titulo) missing.push('titulo');
    if (nota === undefined) missing.push('nota');
    if (numeroTemporadas === undefined) missing.push('numeroTemporadas');
    if (episodiosTotais === undefined) missing.push('episodiosTotais');
    if (episodiosAssistidos === undefined) missing.push('episodiosAssistidos');
    if (!status) missing.push('status');
    if (missing.length) {
      logger.warn('CreateSeries: dados incompletos', { missing });
      return res.status(422).json({ 
        message: `Dados incompletos. Campos obrigatórios: ${missing.join(', ')}` 
      });
    }

    // Validações de tipos
    if (typeof titulo !== 'string' || titulo.trim().length === 0) {
      logger.warn('CreateSeries: título inválido');
      return res.status(422).json({ message: 'Título inválido' });
    }

    if (typeof numeroTemporadas !== 'number' || numeroTemporadas < 1) {
      logger.warn('CreateSeries: número de temporadas inválido');
      return res.status(422).json({ message: 'Número de temporadas deve ser pelo menos 1' });
    }

    if (typeof episodiosTotais !== 'number' || episodiosTotais < 1) {
      logger.warn('CreateSeries: número de episódios totais inválido');
      return res.status(422).json({ message: 'Número de episódios totais deve ser pelo menos 1' });
    }

    // Validação de nota (obrigatória)
    if (typeof nota !== 'number' || nota < 0 || nota > 10) {
      logger.warn('CreateSeries: nota inválida');
      return res.status(422).json({ message: 'Nota deve ser entre 0 e 10' });
    }

    // Validação de episódios assistidos (obrigatório)
    if (typeof episodiosAssistidos !== 'number' || episodiosAssistidos < 0) {
      logger.warn('CreateSeries: episódios assistidos inválido');
      return res.status(422).json({ message: 'Episódios assistidos não pode ser negativo' });
    }

    // Validação de status (obrigatório)
    if (!Object.values(SeriesStatus).includes(status)) {
      logger.warn('CreateSeries: status inválido', { status });
      return res.status(422).json({ 
        message: 'Status inválido. Valores permitidos: planejado, assistindo, concluido' 
      });
    }

    const series = await seriesService.createSeries(userId, {
      titulo,
      nota,
      numeroTemporadas,
      episodiosTotais,
      episodiosAssistidos,
      status
    });

    logger.info(`CreateSeries: série criada ${series._id} para usuário ${userId}`);
    return res.status(201).json({ 
      message: 'Série criada com sucesso', 
      series 
    });
  } catch (err: any) {
    logger.error('CreateSeries error:', err);
    
    if (err.message && err.message.includes('exceder')) {
      return res.status(422).json({ message: err.message });
    }
    
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e: any) => e.message);
      return res.status(422).json({ message: 'Erro de validação', errors: messages });
    }
    
    return res.status(500).json({ message: 'Erro no servidor' });
  }
};

/**
 * @swagger
 * /api/series:
 *   get:
 *     summary: Listar todas as séries do usuário
 *     tags: [Series]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [planejado, assistindo, concluido]
 *         description: Filtrar por status
 *       - in: query
 *         name: titulo
 *         schema:
 *           type: string
 *         description: Buscar por título (parcial)
 *       - in: query
 *         name: nota
 *         schema:
 *           type: number
 *         description: Filtrar por nota específica
 *     responses:
 *       200:
 *         description: Lista de séries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 total:
 *                   type: integer
 *                 series:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Series'
 *       401:
 *         description: Não autenticado
 */
export const getAllSeriesByUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      logger.warn('GetAllSeries: usuário não autenticado');
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    // Filtros opcionais via query params
    const { status, titulo, nota } = req.query;
    
    const filters: any = {};
    
    if (status && typeof status === 'string') {
      if (!Object.values(SeriesStatus).includes(status as SeriesStatus)) {
        logger.warn('GetAllSeries: status inválido no filtro', { status });
        return res.status(422).json({ 
          message: 'Status inválido. Valores permitidos: planejado, assistindo, concluido' 
        });
      }
      filters.status = status as SeriesStatus;
    }

    if (titulo && typeof titulo === 'string') {
      filters.titulo = titulo;
    }

    if (nota && typeof nota === 'string') {
      const notaNum = parseFloat(nota);
      if (!isNaN(notaNum) && notaNum >= 0 && notaNum <= 10) {
        filters.nota = notaNum;
      }
    }

    const series = await seriesService.getAllSeriesByUser(userId, filters);

    logger.info(`GetAllSeries: ${series.length} série(s) encontrada(s) para usuário ${userId}`);
    return res.status(200).json({ 
      count: series.length,
      series 
    });
  } catch (err: any) {
    logger.error('GetAllSeries error:', err);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
};

/**
 * @swagger
 * /api/series/{id}:
 *   get:
 *     summary: Buscar série por ID
 *     tags: [Series]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da série
 *     responses:
 *       200:
 *         description: Série encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Series'
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Série não encontrada
 */
export const getSeriesById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      logger.warn('GetSeriesById: usuário não autenticado');
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    const { id } = req.params;

    if (!id) {
      logger.warn('GetSeriesById: ID não fornecido');
      return res.status(422).json({ message: 'ID da série não fornecido' });
    }

    const series = await seriesService.getSeriesById(userId, id);

    if (!series) {
      logger.warn(`GetSeriesById: série ${id} não encontrada para usuário ${userId}`);
      return res.status(404).json({ message: 'Série não encontrada' });
    }

    logger.info(`GetSeriesById: série ${id} encontrada para usuário ${userId}`);
    return res.status(200).json({ series });
  } catch (err: any) {
    logger.error('GetSeriesById error:', err);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
};

/**
 * @swagger
 * /api/series/{id}:
 *   put:
 *     summary: Atualizar série (todos os campos obrigatórios)
 *     tags: [Series]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da série
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - nota
 *               - numeroTemporadas
 *               - episodiosTotais
 *               - episodiosAssistidos
 *               - status
 *             properties:
 *               titulo:
 *                 type: string
 *               nota:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 10
 *               numeroTemporadas:
 *                 type: integer
 *                 minimum: 1
 *               episodiosTotais:
 *                 type: integer
 *                 minimum: 1
 *               episodiosAssistidos:
 *                 type: integer
 *                 minimum: 0
 *               status:
 *                 type: string
 *                 enum: [planejado, assistindo, concluido]
 *     responses:
 *       200:
 *         description: Série atualizada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 series:
 *                   $ref: '#/components/schemas/Series'
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Série não encontrada
 *       422:
 *         description: Dados inválidos
 */
export const updateSeriesFull = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      logger.warn('UpdateSeriesFull: usuário não autenticado');
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    const { id } = req.params;
    const { titulo, nota, numeroTemporadas, episodiosTotais, episodiosAssistidos, status } = req.body;

    if (!id) {
      logger.warn('UpdateSeriesFull: ID não fornecido');
      return res.status(422).json({ message: 'ID da série não fornecido' });
    }

    // Validações de campos obrigatórios (PUT requer todos os campos)
    const missingPut: string[] = [];
    if (!titulo) missingPut.push('titulo');
    if (nota === undefined) missingPut.push('nota');
    if (numeroTemporadas === undefined) missingPut.push('numeroTemporadas');
    if (episodiosTotais === undefined) missingPut.push('episodiosTotais');
    if (episodiosAssistidos === undefined) missingPut.push('episodiosAssistidos');
    if (!status) missingPut.push('status');
    if (missingPut.length) {
      logger.warn('UpdateSeriesFull: dados incompletos', { missing: missingPut });
      return res.status(422).json({ 
        message: `Dados incompletos. PUT requer todos os campos: ${missingPut.join(', ')}` 
      });
    }

    // Validações de tipos
    if (typeof titulo !== 'string' || titulo.trim().length === 0) {
      logger.warn('UpdateSeriesFull: título inválido');
      return res.status(422).json({ message: 'Título inválido' });
    }

    if (typeof numeroTemporadas !== 'number' || numeroTemporadas < 1) {
      logger.warn('UpdateSeriesFull: número de temporadas inválido');
      return res.status(422).json({ message: 'Número de temporadas deve ser pelo menos 1' });
    }

    if (typeof episodiosTotais !== 'number' || episodiosTotais < 1) {
      logger.warn('UpdateSeriesFull: número de episódios totais inválido');
      return res.status(422).json({ message: 'Número de episódios totais deve ser pelo menos 1' });
    }

    // Validação de nota (obrigatória)
    if (typeof nota !== 'number' || nota < 0 || nota > 10) {
      logger.warn('UpdateSeriesFull: nota inválida');
      return res.status(422).json({ message: 'Nota deve ser entre 0 e 10' });
    }

    // Validação de episódios assistidos (obrigatória)
    if (typeof episodiosAssistidos !== 'number' || episodiosAssistidos < 0) {
      logger.warn('UpdateSeriesFull: episódios assistidos inválido');
      return res.status(422).json({ message: 'Episódios assistidos não pode ser negativo' });
    }

    // Validação de status (obrigatória)
    if (!Object.values(SeriesStatus).includes(status)) {
      logger.warn('UpdateSeriesFull: status inválido', { status });
      return res.status(422).json({ 
        message: 'Status inválido. Valores permitidos: planejado, assistindo, concluido' 
      });
    }

    const series = await seriesService.updateSeriesFull(userId, id, {
      titulo,
      nota,
      numeroTemporadas,
      episodiosTotais,
      episodiosAssistidos,
      status
    });

    if (!series) {
      logger.warn(`UpdateSeriesFull: série ${id} não encontrada para usuário ${userId}`);
      return res.status(404).json({ message: 'Série não encontrada' });
    }

    logger.info(`UpdateSeriesFull: série ${id} atualizada para usuário ${userId}`);
    return res.status(200).json({ 
      message: 'Série atualizada com sucesso', 
      series 
    });
  } catch (err: any) {
    logger.error('UpdateSeriesFull error:', err);
    
    if (err.message && err.message.includes('exceder')) {
      return res.status(422).json({ message: err.message });
    }
    
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e: any) => e.message);
      return res.status(422).json({ message: 'Erro de validação', errors: messages });
    }
    
    return res.status(500).json({ message: 'Erro no servidor' });
  }
};

/**
 * @swagger
 * /api/series/{id}:
 *   patch:
 *     summary: Atualizar série parcialmente (campos opcionais)
 *     tags: [Series]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da série
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               nota:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 10
 *               numeroTemporadas:
 *                 type: integer
 *                 minimum: 1
 *               episodiosTotais:
 *                 type: integer
 *                 minimum: 1
 *               episodiosAssistidos:
 *                 type: integer
 *                 minimum: 0
 *               status:
 *                 type: string
 *                 enum: [planejado, assistindo, concluido]
 *           example:
 *             episodiosAssistidos: 50
 *             status: assistindo
 *     responses:
 *       200:
 *         description: Série atualizada parcialmente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 series:
 *                   $ref: '#/components/schemas/Series'
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Série não encontrada
 *       422:
 *         description: Dados inválidos ou nenhum campo enviado
 */
export const updateSeriesPartial = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      logger.warn('UpdateSeriesPartial: usuário não autenticado');
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    const { id } = req.params;
    const updates = req.body;

    if (!id) {
      logger.warn('UpdateSeriesPartial: ID não fornecido');
      return res.status(422).json({ message: 'ID da série não fornecido' });
    }

    if (!updates || Object.keys(updates).length === 0) {
      logger.warn('UpdateSeriesPartial: nenhum campo para atualizar');
      return res.status(422).json({ message: 'Nenhum campo fornecido para atualização' });
    }

    // Validações de campos opcionais
    if (updates.titulo !== undefined) {
      if (typeof updates.titulo !== 'string' || updates.titulo.trim().length === 0) {
        logger.warn('UpdateSeriesPartial: título inválido');
        return res.status(422).json({ message: 'Título inválido' });
      }
    }

    if (updates.numeroTemporadas !== undefined) {
      if (typeof updates.numeroTemporadas !== 'number' || updates.numeroTemporadas < 1) {
        logger.warn('UpdateSeriesPartial: número de temporadas inválido');
        return res.status(422).json({ message: 'Número de temporadas deve ser pelo menos 1' });
      }
    }

    if (updates.episodiosTotais !== undefined) {
      if (typeof updates.episodiosTotais !== 'number' || updates.episodiosTotais < 1) {
        logger.warn('UpdateSeriesPartial: número de episódios totais inválido');
        return res.status(422).json({ message: 'Número de episódios totais deve ser pelo menos 1' });
      }
    }

    if (updates.episodiosAssistidos !== undefined) {
      if (typeof updates.episodiosAssistidos !== 'number' || updates.episodiosAssistidos < 0) {
        logger.warn('UpdateSeriesPartial: episódios assistidos inválido');
        return res.status(422).json({ message: 'Episódios assistidos não pode ser negativo' });
      }
    }

    if (updates.nota !== undefined && updates.nota !== null) {
      if (typeof updates.nota !== 'number' || updates.nota < 0 || updates.nota > 10) {
        logger.warn('UpdateSeriesPartial: nota inválida');
        return res.status(422).json({ message: 'Nota deve ser entre 0 e 10' });
      }
    }

    if (updates.status !== undefined) {
      if (!Object.values(SeriesStatus).includes(updates.status)) {
        logger.warn('UpdateSeriesPartial: status inválido', { status: updates.status });
        return res.status(422).json({ 
          message: 'Status inválido. Valores permitidos: planejado, assistindo, concluido' 
        });
      }
    }

    const series = await seriesService.updateSeriesPartial(userId, id, updates);

    if (!series) {
      logger.warn(`UpdateSeriesPartial: série ${id} não encontrada para usuário ${userId}`);
      return res.status(404).json({ message: 'Série não encontrada' });
    }

    logger.info(`UpdateSeriesPartial: série ${id} atualizada parcialmente para usuário ${userId}`);
    return res.status(200).json({ 
      message: 'Série atualizada com sucesso', 
      series 
    });
  } catch (err: any) {
    logger.error('UpdateSeriesPartial error:', err);
    
    if (err.message && err.message.includes('exceder')) {
      return res.status(422).json({ message: err.message });
    }
    
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e: any) => e.message);
      return res.status(422).json({ message: 'Erro de validação', errors: messages });
    }
    
    return res.status(500).json({ message: 'Erro no servidor' });
  }
};

/**
 * @swagger
 * /api/series/{id}:
 *   delete:
 *     summary: Deletar série
 *     tags: [Series]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da série
 *     responses:
 *       200:
 *         description: Série deletada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Série deletada com sucesso
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Série não encontrada
 */
export const deleteSeries = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      logger.warn('DeleteSeries: usuário não autenticado');
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    const { id } = req.params;

    if (!id) {
      logger.warn('DeleteSeries: ID não fornecido');
      return res.status(422).json({ message: 'ID da série não fornecido' });
    }

    const deleted = await seriesService.deleteSeries(userId, id);

    if (!deleted) {
      logger.warn(`DeleteSeries: série ${id} não encontrada para usuário ${userId}`);
      return res.status(404).json({ message: 'Série não encontrada' });
    }

    logger.info(`DeleteSeries: série ${id} deletada para usuário ${userId}`);
    return res.status(200).json({ message: 'Série deletada com sucesso' });
  } catch (err: any) {
    logger.error('DeleteSeries error:', err);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
};
