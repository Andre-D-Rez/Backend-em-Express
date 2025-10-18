# Guia de Deploy - Backend em Express

## 📋 Pré-requisitos para Deploy

1. **MongoDB Atlas configurado**
   - Criar conta em https://mongodb.com/cloud/atlas
   - Criar cluster gratuito
   - Configurar Network Access (permitir acesso de qualquer IP: 0.0.0.0/0)
   - Criar usuário do banco de dados
   - Obter connection string

2. **Repositório no GitHub**
   - Código commitado e pushado
   - Arquivo `.env` NÃO commitado (já está no .gitignore)

## 🚀 Deploy na Vercel (Recomendado)

### Passo 1: Instalar Vercel CLI
```bash
npm i -g vercel
```

### Passo 2: Fazer Login
```bash
vercel login
```

### Passo 3: Configurar Projeto
Na raiz do projeto, execute:
```bash
vercel
```

Responda as perguntas:
- Set up and deploy? **Y**
- Which scope? (sua conta)
- Link to existing project? **N**
- Project name? **backend-em-express** (ou outro nome)
- In which directory is your code located? **./**

### Passo 4: Adicionar Variáveis de Ambiente

Via CLI:
```bash
vercel env add MONGO_URI
vercel env add JWT_SECRET
vercel env add JWT_EXPIRES_IN
```

Ou via Dashboard (https://vercel.com):
1. Acesse seu projeto
2. Settings → Environment Variables
3. Adicione:
   - `MONGO_URI`: sua connection string do MongoDB Atlas
   - `JWT_SECRET`: chave secreta (gere com: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
   - `JWT_EXPIRES_IN`: `1d`

### Passo 5: Deploy de Produção
```bash
vercel --prod
```

Anote a URL gerada (ex: `https://backend-em-express.vercel.app`)

## 🔄 Deploy na Render

### Passo 1: Criar Conta
Acesse https://render.com e crie uma conta (pode usar GitHub)

### Passo 2: Criar Web Service
1. New → Web Service
2. Conecte seu repositório GitHub
3. Configure:
   - **Name**: backend-em-express
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Passo 3: Adicionar Environment Variables
Em "Environment Variables", adicione:
- `MONGO_URI`: sua connection string do MongoDB Atlas
- `JWT_SECRET`: chave secreta
- `JWT_EXPIRES_IN`: `1d`

### Passo 4: Deploy
Clique em "Create Web Service"

O Render fará deploy automático a cada push no GitHub.

## 🚂 Deploy no Railway

### Passo 1: Criar Conta
Acesse https://railway.app e faça login com GitHub

### Passo 2: Criar Projeto
1. New Project → Deploy from GitHub repo
2. Selecione seu repositório
3. Railway detectará automaticamente que é Node.js

### Passo 3: Configurar Variáveis
1. Clique no serviço criado
2. Variables → New Variable
3. Adicione:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`

### Passo 4: Configurar Build
Se necessário, adicione estas variáveis:
- `BUILD_COMMAND`: `npm run build`
- `START_COMMAND`: `npm start`

Deploy automático a cada push!

## ✅ Checklist Pós-Deploy

- [ ] URL de produção funcionando
- [ ] Testar POST /api/register (criar usuário)
- [ ] Testar POST /api/login (obter token)
- [ ] Testar GET /api/protected (com token)
- [ ] Verificar logs no painel da plataforma
- [ ] Verificar MongoDB Atlas (usuários sendo salvos)
- [ ] Testar todos os cenários do `requests/requests.yaml` em produção

## 🐛 Troubleshooting

### Erro: "MONGO_URI not set"
- Verifique se a variável de ambiente foi adicionada corretamente
- Reinicie o serviço após adicionar variáveis

### Erro: "Cannot connect to MongoDB"
- Verifique Network Access no MongoDB Atlas (0.0.0.0/0)
- Confirme que a connection string está correta
- Verifique se o usuário do banco tem permissões corretas

### Erro: "Port already in use" (local)
- Execute: `pkill -f "node"` ou `fuser -k 3000/tcp`
- Reinicie o servidor

### Build falha no deploy
- Verifique se `npm run build` funciona localmente
- Confirme que todas as dependências estão no `package.json`
- Verifique logs de build na plataforma

## 📝 Atualizações Futuras

Para fazer deploy de uma atualização:

**Vercel:**
```bash
vercel --prod
```

**Render/Railway:**
- Apenas faça push para o GitHub
- Deploy automático será executado

## 🔐 Segurança

⚠️ **NUNCA commite:**
- Arquivo `.env`
- Chaves JWT
- Senhas do MongoDB
- Tokens de API

✅ **Sempre use:**
- Variáveis de ambiente na plataforma de deploy
- Chaves secretas fortes (32+ caracteres aleatórios)
- HTTPS em produção (automático na Vercel/Render/Railway)
