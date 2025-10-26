import Series, { ISeries, SeriesStatus } from '../models/series.model';
import mongoose from 'mongoose';
import logger from '../utils/logger';

interface CreateSeriesData {
  titulo: string;
  nota: number;
  numeroTemporadas: number;
  episodiosTotais: number;
  episodiosAssistidos: number;
  status: SeriesStatus;
}

interface UpdateSeriesData {
  titulo?: string;
  nota?: number;
  numeroTemporadas?: number;
  episodiosTotais?: number;
  episodiosAssistidos?: number;
  status?: SeriesStatus;
}

interface FilterOptions {
  userId: string;
  status?: SeriesStatus;
  titulo?: string;
  nota?: number;
}

export const createSeries = async (userId: string, data: CreateSeriesData): Promise<ISeries> => {
  logger.info(`Criando nova série para usuário ${userId}`, { titulo: data.titulo });
  
  // Validação adicional: episódios assistidos não pode exceder total
  if (data.episodiosAssistidos > data.episodiosTotais) {
    throw new Error('Episódios assistidos não pode exceder o total de episódios');
  }

  // Validação: nota obrigatória e deve estar entre 0 e 10
  if (typeof data.nota !== 'number' || data.nota < 0 || data.nota > 10) {
    throw new Error('Nota deve ser entre 0 e 10');
  }

  const series = new Series({
    ...data,
    userId: new mongoose.Types.ObjectId(userId)
  });

  const savedSeries = await series.save();
  logger.info(`Série criada com sucesso: ${savedSeries._id}`, { titulo: savedSeries.titulo });
  
  return savedSeries;
};

export const getAllSeriesByUser = async (userId: string, filters?: Partial<FilterOptions>): Promise<ISeries[]> => {
  logger.info(`Buscando séries do usuário ${userId}`, { filters });
  
  const query: any = { userId: new mongoose.Types.ObjectId(userId) };

  // Aplicar filtros opcionais
  if (filters?.status) {
    query.status = filters.status;
  }

  if (filters?.nota !== undefined) {
    query.nota = filters.nota;
  }

  if (filters?.titulo) {
    // Busca parcial case-insensitive
    query.titulo = { $regex: filters.titulo, $options: 'i' };
  }

  const series = await Series.find(query).sort({ createdAt: -1 });
  logger.info(`${series.length} série(s) encontrada(s) para usuário ${userId}`);
  
  return series;
};

export const getSeriesById = async (userId: string, seriesId: string): Promise<ISeries | null> => {
  logger.info(`Buscando série ${seriesId} para usuário ${userId}`);
  
  if (!mongoose.Types.ObjectId.isValid(seriesId)) {
    logger.warn(`ID de série inválido: ${seriesId}`);
    return null;
  }

  const series = await Series.findOne({ 
    _id: new mongoose.Types.ObjectId(seriesId),
    userId: new mongoose.Types.ObjectId(userId)
  });

  if (!series) {
    logger.warn(`Série ${seriesId} não encontrada ou não pertence ao usuário ${userId}`);
  }

  return series;
};

export const updateSeriesFull = async (
  userId: string, 
  seriesId: string, 
  data: CreateSeriesData
): Promise<ISeries | null> => {
  logger.info(`Atualizando série completa ${seriesId} para usuário ${userId}`, { data });
  
  if (!mongoose.Types.ObjectId.isValid(seriesId)) {
    logger.warn(`ID de série inválido: ${seriesId}`);
    return null;
  }

  // Validação adicional: episódios assistidos não pode exceder total
  if (data.episodiosAssistidos > data.episodiosTotais) {
    throw new Error('Episódios assistidos não pode exceder o total de episódios');
  }

  // Validação: nota obrigatória e deve estar entre 0 e 10
  if (typeof data.nota !== 'number' || data.nota < 0 || data.nota > 10) {
    throw new Error('Nota deve ser entre 0 e 10');
  }

  const series = await Series.findOneAndUpdate(
    { 
      _id: new mongoose.Types.ObjectId(seriesId),
      userId: new mongoose.Types.ObjectId(userId)
    },
    data,
    { new: true, runValidators: true }
  );

  if (!series) {
    logger.warn(`Série ${seriesId} não encontrada ou não pertence ao usuário ${userId}`);
  } else {
    logger.info(`Série ${seriesId} atualizada com sucesso`);
  }

  return series;
};

export const updateSeriesPartial = async (
  userId: string, 
  seriesId: string, 
  data: UpdateSeriesData
): Promise<ISeries | null> => {
  logger.info(`Atualizando série parcial ${seriesId} para usuário ${userId}`, { data });
  
  if (!mongoose.Types.ObjectId.isValid(seriesId)) {
    logger.warn(`ID de série inválido: ${seriesId}`);
    return null;
  }

  // Buscar série atual para validações
  const currentSeries = await Series.findOne({
    _id: new mongoose.Types.ObjectId(seriesId),
    userId: new mongoose.Types.ObjectId(userId)
  });

  if (!currentSeries) {
    logger.warn(`Série ${seriesId} não encontrada ou não pertence ao usuário ${userId}`);
    return null;
  }

  // Validação: episódios assistidos não pode exceder total
  const episodiosTotais = data.episodiosTotais ?? currentSeries.episodiosTotais;
  const episodiosAssistidos = data.episodiosAssistidos ?? currentSeries.episodiosAssistidos;
  
  if (episodiosAssistidos > episodiosTotais) {
    throw new Error('Episódios assistidos não pode exceder o total de episódios');
  }

  // Validação: se nota fornecida, deve estar entre 0 e 10
  if (data.nota !== undefined && (data.nota < 0 || data.nota > 10)) {
    throw new Error('Nota deve ser entre 0 e 10');
  }

  const series = await Series.findOneAndUpdate(
    { 
      _id: new mongoose.Types.ObjectId(seriesId),
      userId: new mongoose.Types.ObjectId(userId)
    },
    { $set: data },
    { new: true, runValidators: true }
  );

  if (series) {
    logger.info(`Série ${seriesId} atualizada parcialmente com sucesso`);
  }

  return series;
};

export const deleteSeries = async (userId: string, seriesId: string): Promise<boolean> => {
  logger.info(`Deletando série ${seriesId} para usuário ${userId}`);
  
  if (!mongoose.Types.ObjectId.isValid(seriesId)) {
    logger.warn(`ID de série inválido: ${seriesId}`);
    return false;
  }

  const result = await Series.findOneAndDelete({
    _id: new mongoose.Types.ObjectId(seriesId),
    userId: new mongoose.Types.ObjectId(userId)
  });

  if (!result) {
    logger.warn(`Série ${seriesId} não encontrada ou não pertence ao usuário ${userId}`);
    return false;
  }

  logger.info(`Série ${seriesId} deletada com sucesso`);
  return true;
};
