#!/bin/bash
# Script de teste para validar todos os endpoints da API

BASE_URL="http://localhost:3000/api"
TOKEN=""

echo "=== Testando Backend em Express ==="
echo ""

# 1. Cadastro bem-sucedido
echo "1. Cadastro bem-sucedido:"
curl -s -w "\nStatus: %{http_code}\n" -H 'Content-Type: application/json' \
  -d '{"name":"Test User","email":"test@example.com","password":"P@ssw0rd!"}' \
  ${BASE_URL}/register
echo ""

# 2. Cadastro com email repetido
echo "2. Cadastro com email repetido:"
curl -s -w "\nStatus: %{http_code}\n" -H 'Content-Type: application/json' \
  -d '{"name":"Test User","email":"test@example.com","password":"P@ssw0rd!"}' \
  ${BASE_URL}/register
echo ""

# 3. Cadastro com email inválido
echo "3. Cadastro com email inválido:"
curl -s -w "\nStatus: %{http_code}\n" -H 'Content-Type: application/json' \
  -d '{"name":"Test User","email":"not-an-email","password":"P@ssw0rd!"}' \
  ${BASE_URL}/register
echo ""

# 4. Cadastro com senha inválida (muito curta)
echo "4. Cadastro com senha inválida:"
curl -s -w "\nStatus: %{http_code}\n" -H 'Content-Type: application/json' \
  -d '{"name":"Test User","email":"new@example.com","password":"123"}' \
  ${BASE_URL}/register
echo ""

# 5. Cadastro com JSON malformado
echo "5. Cadastro com JSON malformado:"
curl -s -w "\nStatus: %{http_code}\n" -H 'Content-Type: application/json' \
  -d '{ invalid json' \
  ${BASE_URL}/register
echo ""

# 6. Login bem-sucedido
echo "6. Login bem-sucedido:"
RESPONSE=$(curl -s -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","password":"P@ssw0rd!"}' \
  ${BASE_URL}/login)
echo $RESPONSE
TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo "Status: 200"
echo ""

# 7. Login com senha inválida
echo "7. Login com senha inválida:"
curl -s -w "\nStatus: %{http_code}\n" -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","password":"wrong"}' \
  ${BASE_URL}/login
echo ""

# 8. Login com email inválido (formato)
echo "8. Login com email inválido (formato):"
curl -s -w "\nStatus: %{http_code}\n" -H 'Content-Type: application/json' \
  -d '{"email":"not-email","password":"P@ssw0rd!"}' \
  ${BASE_URL}/login
echo ""

# 9. Login com JSON malformado
echo "9. Login com JSON malformado:"
curl -s -w "\nStatus: %{http_code}\n" -H 'Content-Type: application/json' \
  -d '{ bad json' \
  ${BASE_URL}/login
echo ""

# 10. Acesso à rota protegida com token válido
echo "10. Rota protegida com token válido:"
if [ -n "$TOKEN" ]; then
  curl -s -w "\nStatus: %{http_code}\n" -H "Authorization: Bearer $TOKEN" \
    ${BASE_URL}/protected
else
  echo "Token não obtido, pulando teste"
fi
echo ""

# 11. Acesso à rota protegida sem token
echo "11. Rota protegida sem token:"
curl -s -w "\nStatus: %{http_code}\n" ${BASE_URL}/protected
echo ""

# 12. Acesso à rota protegida com token inválido
echo "12. Rota protegida com token inválido:"
curl -s -w "\nStatus: %{http_code}\n" -H "Authorization: Bearer invalid.token.here" \
  ${BASE_URL}/protected
echo ""

echo "=== Testes concluídos ==="
