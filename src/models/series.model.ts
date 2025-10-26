import mongoose, { Schema, Document } from 'mongoose';

export enum SeriesStatus {
  PLANEJADO = 'planejado',
  ASSISTINDO = 'assistindo',
  CONCLUIDO = 'concluido'
}

export interface ISeries extends Document {
  titulo: string;
  nota: number;
  numeroTemporadas: number;
  episodiosTotais: number;
  episodiosAssistidos: number;
  status: SeriesStatus;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SeriesSchema: Schema = new Schema<ISeries>(
  {
    titulo: { 
      type: String, 
      required: [true, 'Título é obrigatório'], 
      minlength: [1, 'Título deve ter pelo menos 1 caractere'],
      maxlength: [200, 'Título não pode exceder 200 caracteres'],
      trim: true 
    },
    nota: { 
      type: Number, 
      required: [true, 'Nota é obrigatória'],
      min: [0, 'Nota deve ser entre 0 e 10'],
      max: [10, 'Nota deve ser entre 0 e 10']
    },
    numeroTemporadas: { 
      type: Number, 
      required: [true, 'Número de temporadas é obrigatório'],
      min: [1, 'Número de temporadas deve ser pelo menos 1']
    },
    episodiosTotais: { 
      type: Number, 
      required: [true, 'Número total de episódios é obrigatório'],
      min: [1, 'Número total de episódios deve ser pelo menos 1']
    },
    episodiosAssistidos: { 
      type: Number, 
      required: [true, 'Número de episódios assistidos é obrigatório'],
      min: [0, 'Número de episódios assistidos não pode ser negativo'],
      default: 0
    },
    status: { 
      type: String, 
      enum: {
        values: Object.values(SeriesStatus),
        message: 'Status deve ser: planejado, assistindo ou concluido'
      },
      required: [true, 'Status é obrigatório'],
      default: SeriesStatus.PLANEJADO
    },
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      index: true
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Índice composto para melhorar queries de busca por usuário
SeriesSchema.index({ userId: 1, status: 1 });
SeriesSchema.index({ userId: 1, titulo: 1 });

export default mongoose.model<ISeries>('Series', SeriesSchema);
