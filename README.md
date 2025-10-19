# Backend em Express (Node.js + TypeScript)# Backend-em-Express

API RESTful com autenticação JWT, MongoDB e arquitetura em camadas (MVC).

### Vídeo explicativo
Assista ao vídeo para uma explicação/demonstração rapída do projeto https://youtu.be/l7WnbtVhUq0

## 📋 Funcionalidades

### Rotas Públicas
- **POST /api/register** - Cadastro de novos usuários
- **POST /api/login** - Autenticação e geração de token JWT

### Rotas Protegidas
- **GET /api/protected** - Rota acessível apenas com token JWT válido

## 🏗️ Arquitetura

O projeto segue uma arquitetura em camadas:

```
src/
├── config/          # Configurações e validação de variáveis de ambiente
├── controllers/     # Controladores (lógica de requisição/resposta)
├── database/        # Configuração de conexão com MongoDB
├── middlewares/     # Middlewares (autenticação, tratamento de erros)
├── models/          # Modelos Mongoose (User)
├── routes/          # Definição de rotas
├── services/        # Lógica de negócio
└── utils/           # Utilitários (validadores, logger)
```

## 🚀 Instalação e Execução Local

### Pré-requisitos
- Node.js 18+ e npm
- MongoDB (local ou Atlas)
- Docker (opcional, para rodar MongoDB local)

### Passo a Passo

1. **Clone o repositório**
```bash
git clone <seu-repo>
cd Backend-em-Express
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:

```env
PORT= sua porta
MONGO_URI= link do mongodb
JWT_SECRET= senha
JWT_EXPIRES_IN= por quanto tempo o token JWT será válido após emitido
```

**Para MongoDB local com Docker:**
```bash
docker run -d --name mongo-dev -p porta:porta mongo:6
```

**Para MongoDB Atlas (produção):**
- Acesse https://www.mongodb.com/cloud/atlas
- Crie um cluster gratuito
- Obtenha a connection string e use em `MONGO_URI`
- Exemplo: `mongodb+srv://user:password@cluster.mongodb.net/database?retryWrites=true&w=majority`

4. **Execute em modo de desenvolvimento**
```bash
npm run dev
```

5. **Compile para produção**
```bash
npm run build
npm start
```

## 🧪 Testando a API

### Via Script de Testes
```bash
./scripts/test-endpoints.sh
```

### Via Insomnia/Postman
Importe o arquivo `requests/requests.yaml` no Insomnia para testar todos os cenários.

### Exemplos de Requisições

**Cadastro:**
```bash
curl -X POST http://localhost:porta/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"João Silva","email":"joao@example.com","password":"S3nh@Forte!"}'
```

**Login:**
```bash
curl -X POST http://localhost:porta/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@example.com","password":"S3nh@Forte!"}'
```

**Rota Protegida:**
```bash
curl -X GET http://localhost:porta/api/protected \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 🔒 Validações Implementadas

### Cadastro (/register)
- ✅ Nome: mínimo 2 caracteres
- ✅ Email: formato válido
- ✅ Senha: mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 caractere especial
- ✅ Email único (não permite duplicatas)
- ✅ Senha salva como hash (bcrypt)

### Login (/login)
- ✅ Email: formato válido
- ✅ Senha: comparação com hash armazenado
- ✅ Retorna token JWT válido

### Rota Protegida (/protected)
- ✅ Token JWT obrigatório no header Authorization
- ✅ Validação de token (assinatura e expiração)

## 📝 Códigos de Status HTTP

| Código | Significado | Quando ocorre |
|--------|-------------|---------------|
| 200 | OK | Login bem-sucedido |
| 201 | Created | Usuário cadastrado com sucesso |
| 400 | Bad Request | JSON malformado |
| 401 | Unauthorized | Token ausente/inválido ou senha incorreta |
| 404 | Not Found | Usuário não encontrado |
| 422 | Unprocessable Entity | Dados inválidos (validação falhou) |
| 500 | Internal Server Error | Erro no servidor |

## 🛠️ Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **TypeScript** - Tipagem estática
- **Express** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação via tokens
- **bcrypt** - Hash de senhas
- **Winston** - Logging estruturado
- **dotenv** - Gerenciamento de variáveis de ambiente