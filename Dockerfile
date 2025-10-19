# Multi-stage build para produção
FROM node:18-alpine AS builder
WORKDIR /app

# Instalar dependências
COPY package*.json ./
RUN npm install

# Copiar fontes e compilar TypeScript
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Stage de execução (runtime) minimalista
FROM node:18-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

# Instalar somente dependências de produção
COPY package*.json ./
RUN npm install --omit=dev

# Copiar artefatos compilados
COPY --from=builder /app/dist ./dist

# Expor porta
EXPOSE 3000

# Comando de inicialização
CMD ["npm", "start"]
