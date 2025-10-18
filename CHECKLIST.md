# ✅ Checklist da Atividade Avaliativa

## 📦 Entregáveis Obrigatórios

### 1. Repositório GitHub
- [ ] Código-fonte commitado
- [ ] Estrutura de pastas correta:
  - [ ] `src/middlewares/`
  - [ ] `src/routes/`
  - [ ] `src/controllers/`
  - [ ] `src/services/`
  - [ ] `src/models/`
  - [ ] `src/database/`
  - [ ] `src/config/`
  - [ ] `src/utils/`
- [ ] Arquivo `.env` NÃO commitado (no .gitignore)
- [ ] `.env.example` presente com todas as variáveis
- [ ] `README.md` completo com instruções
- [ ] Tag/Release criada para entrega

### 2. Pasta requests/
- [ ] Arquivo `requests.yaml` presente
- [ ] Cadastro bem-sucedido
- [ ] Cadastro com email repetido
- [ ] Cadastro com email inválido
- [ ] Cadastro com senha inválida
- [ ] Cadastro com requisição mal formatada
- [ ] Login bem-sucedido
- [ ] Login com senha inválida
- [ ] Login com email inválido
- [ ] Login com requisição mal formatada
- [ ] Acesso a /protected com token válido
- [ ] Acesso a /protected sem token
- [ ] Acesso a /protected com token inválido

### 3. Funcionalidades Implementadas

#### Model User
- [ ] Campo `name` (string, obrigatório, min 2 chars)
- [ ] Campo `email` (string, obrigatório, único, formato válido)
- [ ] Campo `password` (string, obrigatório, não selecionável por padrão)
- [ ] Senha salva como hash (bcrypt)

#### POST /api/register
- [ ] Validação de nome (tamanho mínimo)
- [ ] Validação de email (formato)
- [ ] Validação de senha (complexidade: min 8, maiúscula, minúscula, número, especial)
- [ ] Retorna HTTP 422 para dados inválidos
- [ ] Retorna HTTP 422 para email já existente
- [ ] Retorna HTTP 201 para sucesso
- [ ] Resposta com dados do usuário (sem senha)
- [ ] Senha hasheada antes de salvar

#### POST /api/login
- [ ] Validação de email (formato)
- [ ] Validação de senha (não nula)
- [ ] Retorna HTTP 422 para formato inválido
- [ ] Retorna HTTP 404 para usuário não encontrado
- [ ] Retorna HTTP 401 para senha incorreta
- [ ] Retorna HTTP 200 com token JWT para sucesso
- [ ] Compara hash da senha corretamente

#### GET /api/protected
- [ ] Requer token JWT no header Authorization
- [ ] Retorna HTTP 401 sem token
- [ ] Retorna HTTP 401 com token inválido
- [ ] Retorna HTTP 200 com token válido
- [ ] Mensagem de acesso autorizado

#### Outros Requisitos
- [ ] Variáveis de ambiente (dotenv)
- [ ] JWT_SECRET não commitado
- [ ] MONGO_URI não commitada
- [ ] Logs implementados (winston)
- [ ] Logs em ações importantes (register, login, erros)
- [ ] Tratamento de JSON malformado (HTTP 400)

## 🌐 Hospedagem

### 4. Link da Aplicação Hospedada
- [ ] Aplicação deployada (Vercel/Render/Railway)
- [ ] URL acessível publicamente
- [ ] MongoDB Atlas configurado
- [ ] Variáveis de ambiente configuradas na plataforma
- [ ] Endpoints funcionando em produção

## 🎥 Vídeo Demonstrativo

### 5. Vídeo (até 2 minutos)
- [ ] Rosto E tela aparecem simultaneamente TODO O TEMPO
- [ ] Duração máxima: 2 minutos
- [ ] Qualidade de áudio e vídeo adequada

#### Conteúdo do Vídeo:
- [ ] Mostrar requisições no Insomnia/Postman
  - [ ] Executar TODAS as requests da pasta `requests/`
  - [ ] Mostrar respostas HTTP corretas
- [ ] Mostrar interface do MongoDB
  - [ ] MongoDB local (Compass) com usuários cadastrados
  - [ ] MongoDB Atlas (nuvem) com usuários cadastrados
- [ ] Demonstrar endpoints locais
  - [ ] `npm run dev` funcionando
  - [ ] Requisições para http://localhost:3000
- [ ] Demonstrar endpoints em produção
  - [ ] Requisições para URL de deploy
  - [ ] Respostas corretas

### 6. Vídeo no README
- [ ] Link do vídeo adicionado ao README.md
- [ ] Vídeo acessível (YouTube/Drive/etc)

## 📊 Critérios de Avaliação

### Estrutura de Projeto (10%)
- [ ] Todas as pastas presentes
- [ ] Arquivos nomeados semanticamente
- [ ] Padrão: `nome.tipo.ts` (ex: `user.controller.ts`)

### Cadastro de Usuário (15%)
- [ ] Todas as validações implementadas
- [ ] Status codes corretos
- [ ] Senha hasheada
- [ ] Mensagens de erro apropriadas

### Login de Usuário (15%)
- [ ] Todas as validações implementadas
- [ ] Status codes corretos (422, 404, 401, 200)
- [ ] Token JWT retornado

### Proteção da Rota /protected (5%)
- [ ] Middleware de autenticação funcional
- [ ] Aceita apenas tokens válidos

### Variáveis de Ambiente (5%)
- [ ] dotenv configurado
- [ ] .env no .gitignore
- [ ] .env.example presente
- [ ] Sem dados sensíveis commitados

### Arquivos de Requisição (5%)
- [ ] requests.yaml completo
- [ ] Todos os cenários cobertos
- [ ] Importável no Insomnia

### Implementação de Logs (5%)
- [ ] Winston configurado
- [ ] Logs em ações importantes
- [ ] Logs de erro

### Hospedagem Funcional (10%)
- [ ] Aplicação deployada
- [ ] URL funcionando
- [ ] Todos os endpoints acessíveis

### Vídeo Demonstrativo (20%)
- [ ] Todos os itens do checklist acima
- [ ] Qualidade adequada
- [ ] Rosto e tela visíveis

### Qualidade do Código (10%)
- [ ] Código limpo e organizado
- [ ] Comentários onde necessário
- [ ] Boas práticas seguidas
- [ ] TypeScript usado corretamente

## 🚀 Antes de Submeter

1. **Testar localmente:**
```bash
npm install
npm run dev
./test-endpoints.sh
```

2. **Testar build:**
```bash
npm run build
npm start
```

3. **Verificar arquivos:**
```bash
# Não deve aparecer .env
git status

# Deve listar .env
cat .gitignore | grep .env
```

4. **Criar tag/release:**
```bash
git tag -a v1.0.0 -m "Entrega da atividade avaliativa"
git push origin v1.0.0
```

5. **Verificar hospedagem:**
- Testar URL de produção
- Verificar MongoDB Atlas

6. **Gravar vídeo:**
- Seguir roteiro do README
- Verificar áudio e vídeo
- Upload e adicionar link ao README

## 📝 Links para Submissão

- [ ] Link do repositório GitHub (com tag/release)
- [ ] Link da aplicação hospedada
- [ ] Vídeo (no README do repositório)

---

## ⚠️ Notas Importantes

- Aplicação que **não funciona** localmente ou hospedada = **ZERO**
- Ausência de item obrigatório = **nota × 0.7**
- Vídeo ausente ou inadequado = **nota × 0.7 ou ZERO**
- Dados sensíveis commitados = **penalização**

## ✨ Dicas Finais

1. Teste TUDO antes de submeter
2. Siga EXATAMENTE os requisitos
3. Capriche no vídeo (é 20% da nota)
4. Documente bem o README
5. Use o test-endpoints.sh para validar localmente
6. Peça para alguém testar sua URL de produção
7. Revise este checklist múltiplas vezes

**Boa sorte! 🍀**
