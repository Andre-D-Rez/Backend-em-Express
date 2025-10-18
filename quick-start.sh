#!/bin/bash
# Quick Start - Backend em Express

echo "🚀 Backend em Express - Quick Start"
echo ""

# Verificar se .env existe
if [ ! -f .env ]; then
    echo "⚠️  Arquivo .env não encontrado!"
    echo "📝 Copiando .env.example para .env..."
    cp .env.example .env
    echo "✅ Arquivo .env criado. EDITE-O com suas configurações!"
    echo ""
    read -p "Pressione ENTER para continuar após editar o .env..."
fi

# Verificar se node_modules existe
if [ ! -d node_modules ]; then
    echo "📦 Instalando dependências..."
    npm install
    echo ""
fi

# Verificar se MongoDB está rodando (local)
if [ -z "$(docker ps -q -f name=mongo-dev)" ]; then
    echo "🔧 MongoDB local não encontrado. Deseja iniciar um container? (s/n)"
    read -r response
    if [[ "$response" =~ ^([sS][iI][mM]|[sS])$ ]]; then
        echo "🐳 Iniciando MongoDB local..."
        docker run -d --name mongo-dev -p 27017:27017 mongo:6
        echo "✅ MongoDB iniciado na porta 27017"
        sleep 2
    fi
    echo ""
fi

echo "🏗️  Compilando TypeScript..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build concluído com sucesso!"
    echo ""
    echo "🎯 Escolha uma opção:"
    echo "1) Iniciar servidor de desenvolvimento (npm run dev)"
    echo "2) Iniciar servidor de produção (npm start)"
    echo "3) Executar testes dos endpoints (./test-endpoints.sh)"
    echo "4) Sair"
    echo ""
    read -p "Opção: " option

    case $option in
        1)
            echo "🚀 Iniciando servidor de desenvolvimento..."
            npm run dev
            ;;
        2)
            echo "🚀 Iniciando servidor de produção..."
            npm start
            ;;
        3)
            echo "🧪 Executando testes..."
            chmod +x test-endpoints.sh
            ./test-endpoints.sh
            ;;
        4)
            echo "👋 Até logo!"
            exit 0
            ;;
        *)
            echo "❌ Opção inválida"
            exit 1
            ;;
    esac
else
    echo "❌ Erro na compilação. Verifique os erros acima."
    exit 1
fi
