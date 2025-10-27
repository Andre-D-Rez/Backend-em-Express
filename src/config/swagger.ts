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
  apis: process.env.NODE_ENV === 'production' 
    ? [] // Em produção, usa apenas a definição abaixo (sem JSDoc)
    : ['./src/routes/*.ts', './src/controllers/*.ts'], // Em dev, lê JSDoc dos arquivos
};

const baseSpec = swaggerJsdoc(options);

// Adiciona os endpoints manualmente (funciona em produção e dev)
export const swaggerSpec = {
  ...baseSpec,
  paths: {
    '/api/register': {
      post: {
        summary: 'Registrar novo usuário',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/User' }
            }
          }
        },
        responses: {
          '201': {
            description: 'Usuário criado com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Usuário criado com sucesso' },
                    user: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          },
          '422': { description: 'Dados inválidos ou email já cadastrado' }
        }
      }
    },
    '/api/login': {
      post: {
        summary: 'Login de usuário',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'joao@example.com' },
                  password: { type: 'string', format: 'password', example: 'senha123' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Login realizado com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Login realizado com sucesso' },
                    token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                    user: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          },
          '401': { description: 'Credenciais inválidas' },
          '422': { description: 'Dados incompletos ou inválidos' }
        }
      }
    },
    '/api/series': {
      post: {
        summary: 'Criar nova série',
        tags: ['Series'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['titulo', 'nota', 'numeroTemporadas', 'episodiosTotais', 'episodiosAssistidos', 'status'],
                properties: {
                  titulo: { type: 'string', example: 'Breaking Bad' },
                  nota: { type: 'number', minimum: 0, maximum: 10, example: 9.5 },
                  numeroTemporadas: { type: 'integer', minimum: 1, example: 5 },
                  episodiosTotais: { type: 'integer', minimum: 1, example: 62 },
                  episodiosAssistidos: { type: 'integer', minimum: 0, example: 45 },
                  status: { type: 'string', enum: ['planejado', 'assistindo', 'concluido'], example: 'assistindo' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Série criada com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    series: { $ref: '#/components/schemas/Series' }
                  }
                }
              }
            }
          },
          '401': { description: 'Não autenticado' },
          '422': { description: 'Dados inválidos' }
        }
      },
      get: {
        summary: 'Listar todas as séries do usuário',
        tags: ['Series'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'query', name: 'status', schema: { type: 'string', enum: ['planejado', 'assistindo', 'concluido'] }, description: 'Filtrar por status' },
          { in: 'query', name: 'titulo', schema: { type: 'string' }, description: 'Buscar por título (parcial)' },
          { in: 'query', name: 'nota', schema: { type: 'number' }, description: 'Filtrar por nota específica' }
        ],
        responses: {
          '200': {
            description: 'Lista de séries',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    total: { type: 'integer' },
                    series: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Series' }
                    }
                  }
                }
              }
            }
          },
          '401': { description: 'Não autenticado' }
        }
      }
    },
    '/api/series/{id}': {
      get: {
        summary: 'Buscar série por ID',
        tags: ['Series'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'string' }, description: 'ID da série' }
        ],
        responses: {
          '200': {
            description: 'Série encontrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Series' }
              }
            }
          },
          '401': { description: 'Não autenticado' },
          '404': { description: 'Série não encontrada' }
        }
      },
      put: {
        summary: 'Atualizar série (todos os campos obrigatórios)',
        tags: ['Series'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'string' }, description: 'ID da série' }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['titulo', 'nota', 'numeroTemporadas', 'episodiosTotais', 'episodiosAssistidos', 'status'],
                properties: {
                  titulo: { type: 'string' },
                  nota: { type: 'number', minimum: 0, maximum: 10 },
                  numeroTemporadas: { type: 'integer', minimum: 1 },
                  episodiosTotais: { type: 'integer', minimum: 1 },
                  episodiosAssistidos: { type: 'integer', minimum: 0 },
                  status: { type: 'string', enum: ['planejado', 'assistindo', 'concluido'] }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Série atualizada',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    series: { $ref: '#/components/schemas/Series' }
                  }
                }
              }
            }
          },
          '401': { description: 'Não autenticado' },
          '404': { description: 'Série não encontrada' },
          '422': { description: 'Dados inválidos' }
        }
      },
      patch: {
        summary: 'Atualizar série parcialmente (campos opcionais)',
        tags: ['Series'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'string' }, description: 'ID da série' }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  titulo: { type: 'string' },
                  nota: { type: 'number', minimum: 0, maximum: 10 },
                  numeroTemporadas: { type: 'integer', minimum: 1 },
                  episodiosTotais: { type: 'integer', minimum: 1 },
                  episodiosAssistidos: { type: 'integer', minimum: 0 },
                  status: { type: 'string', enum: ['planejado', 'assistindo', 'concluido'] }
                },
                example: {
                  episodiosAssistidos: 50,
                  status: 'assistindo'
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Série atualizada parcialmente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    series: { $ref: '#/components/schemas/Series' }
                  }
                }
              }
            }
          },
          '401': { description: 'Não autenticado' },
          '404': { description: 'Série não encontrada' },
          '422': { description: 'Dados inválidos ou nenhum campo enviado' }
        }
      },
      delete: {
        summary: 'Deletar série',
        tags: ['Series'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'string' }, description: 'ID da série' }
        ],
        responses: {
          '200': {
            description: 'Série deletada com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Série deletada com sucesso' }
                  }
                }
              }
            }
          },
          '401': { description: 'Não autenticado' },
          '404': { description: 'Série não encontrada' }
        }
      }
    }
  }
};
