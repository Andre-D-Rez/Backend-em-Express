import { Router } from 'express';
import {
  createSeries,
  getAllSeriesByUser,
  getSeriesById,
  updateSeriesFull,
  updateSeriesPartial,
  deleteSeries
} from '../controllers/series.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Todas as rotas de séries requerem autenticação
router.post('/series', authenticate, createSeries);
router.get('/series', authenticate, getAllSeriesByUser);
router.get('/series/:id', authenticate, getSeriesById);
router.put('/series/:id', authenticate, updateSeriesFull);
router.patch('/series/:id', authenticate, updateSeriesPartial);
router.delete('/series/:id', authenticate, deleteSeries);

export default router;
