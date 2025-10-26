import swaggerJsdoc from 'swagger-jsdoc';
import { SwaggerDefinition } from 'swagger-jsdoc';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de Gerenciamento de Séries',
    version: '1.0.0',
    description: 'API REST para gerenciar lista de séries de TV com autenticação JWT',
    contact: {
      name: 'Backend em Express',
    },
  },
  servers: [
    {
      url: process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : 'http://localhost:3000',
      description: process.env.VERCEL_URL ? 'Servidor de produção (Vercel)' : 'Servidor de desenvolvimento',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Insira o token JWT obtido no login',
      },
    },
    schemas: {
      User: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: {
            type: 'string',
            description: 'Nome do usuário',
            example: 'João Silva',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'Email do usuário',
            example: 'joao@example.com',
          },
          password: {
            type: 'string',
            format: 'password',
            description: 'Senha do usuário (mínimo 6 caracteres)',
            example: 'senha123',
          },
        },
      },
      Series: {
        type: 'object',
        required: [
          'titulo',
          'nota',
          'numeroTemporadas',
          'episodiosTotais',
          'episodiosAssistidos',
          'status',
        ],
        properties: {
          _id: {
            type: 'string',
            description: 'ID da série',
            example: '507f1f77bcf86cd799439011',
          },
          titulo: {
            type: 'string',
            description: 'Título da série',
            example: 'Breaking Bad',
          },
          nota: {
            type: 'number',
            minimum: 0,
            maximum: 10,
            description: 'Nota da série (0 a 10)',
            example: 9.5,
          },
          numeroTemporadas: {
            type: 'integer',
            minimum: 1,
            description: 'Número de temporadas',
            example: 5,
          },
          episodiosTotais: {
            type: 'integer',
            minimum: 1,
            description: 'Total de episódios',
            example: 62,
          },
          episodiosAssistidos: {
            type: 'integer',
            minimum: 0,
            description: 'Episódios assistidos',
            example: 45,
          },
          status: {
            type: 'string',
            enum: ['planejado', 'assistindo', 'concluido'],
            description: 'Status de acompanhamento',
            example: 'assistindo',
          },
          userId: {
            type: 'string',
            description: 'ID do usuário proprietário',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Data de criação',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Data de atualização',
          },
        },
      },
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            description: 'Mensagem de erro',
          },
          message: {
            type: 'string',
            description: 'Detalhes do erro',
          },
        },
      },
    },
  },
  tags: [
    {
      name: 'Auth',
      description: 'Endpoints de autenticação (registro e login)',
    },
    {
      name: 'Series',
      description: 'CRUD de séries de TV (requer autenticação)',
    },
    {
      name: 'Protected',
      description: 'Rotas protegidas de exemplo',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Arquivos com anotações JSDoc
};

export const swaggerSpec = swaggerJsdoc(options);
