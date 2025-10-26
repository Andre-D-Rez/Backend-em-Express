#!/bin/bash

# Script para testar Swagger em produção (Vercel)
# Uso: ./test-swagger-vercel.sh https://seu-dominio.vercel.app

VERCEL_URL="$1"

if [ -z "$VERCEL_URL" ]; then
  echo "❌ Erro: Forneça a URL do Vercel"
  echo "Uso: ./test-swagger-vercel.sh https://seu-dominio.vercel.app"
  exit 1
fi

echo "🧪 Testando API no Vercel: $VERCEL_URL"
echo ""

echo "1️⃣ Testando /health..."
HEALTH=$(curl -s -o /dev/null -w "%{http_code}" "$VERCEL_URL/health")
if [ "$HEALTH" = "200" ]; then
  echo "   ✅ /health respondeu 200"
else
  echo "   ❌ /health retornou $HEALTH (esperado: 200)"
fi

echo ""
echo "2️⃣ Testando /api-docs/swagger.json..."
SWAGGER_JSON=$(curl -s -o /dev/null -w "%{http_code}" "$VERCEL_URL/api-docs/swagger.json")
if [ "$SWAGGER_JSON" = "200" ]; then
  echo "   ✅ /api-docs/swagger.json respondeu 200"
  TITLE=$(curl -s "$VERCEL_URL/api-docs/swagger.json" | jq -r '.info.title' 2>/dev/null)
  echo "   📘 Título: $TITLE"
else
  echo "   ❌ /api-docs/swagger.json retornou $SWAGGER_JSON (esperado: 200)"
fi

echo ""
echo "3️⃣ Testando /api-docs (interface)..."
SWAGGER_UI=$(curl -s -o /dev/null -w "%{http_code}" "$VERCEL_URL/api-docs")
if [ "$SWAGGER_UI" = "200" ]; then
  echo "   ✅ /api-docs respondeu 200"
  echo "   🌐 Abra no navegador: $VERCEL_URL/api-docs"
else
  echo "   ❌ /api-docs retornou $SWAGGER_UI (esperado: 200)"
fi

echo ""
echo "4️⃣ Testando rota protegida sem token (esperado: 401)..."
PROTECTED=$(curl -s -o /dev/null -w "%{http_code}" "$VERCEL_URL/api/series")
if [ "$PROTECTED" = "401" ]; then
  echo "   ✅ /api/series retornou 401 (autenticação funcionando)"
else
  echo "   ⚠️  /api/series retornou $PROTECTED (esperado: 401)"
fi

echo ""
echo "✅ Teste concluído!"
echo ""
echo "📝 Próximos passos:"
echo "   1. Abra $VERCEL_URL/api-docs no navegador"
echo "   2. Registre um usuário em POST /api/register"
echo "   3. Faça login em POST /api/login para obter o token"
echo "   4. Clique em 'Authorize' e cole: Bearer SEU_TOKEN"
echo "   5. Teste os endpoints protegidos de /api/series"
