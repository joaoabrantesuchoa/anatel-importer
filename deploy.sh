#!/bin/bash

# Script de deployment para anatel-spectrum-integration

set -e

echo "🚀 Iniciando deployment do Anatel Spectrum Integration..."

# Variáveis
IMAGE_NAME="anatel-spectrum-integration"
CONTAINER_NAME="anatel-spectrum-integration"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para logs coloridos
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    log_error "Docker não está instalado!"
    exit 1
fi

# Parar container existente se estiver rodando
if docker ps -q -f name=$CONTAINER_NAME | grep -q .; then
    log_warn "Parando container existente..."
    docker stop $CONTAINER_NAME
fi

# Remover container existente
if docker ps -aq -f name=$CONTAINER_NAME | grep -q .; then
    log_warn "Removendo container existente..."
    docker rm $CONTAINER_NAME
fi

# Remover imagem antiga
if docker images -q $IMAGE_NAME | grep -q .; then
    log_warn "Removendo imagem antiga..."
    docker rmi $IMAGE_NAME
fi

# Construir nova imagem
log_info "Construindo nova imagem Docker..."
docker build -t $IMAGE_NAME .

# Verificar se .env existe, se não, usar .env.example
if [ ! -f ".env" ]; then
    log_warn "Arquivo .env não encontrado. Copiando .env.example..."
    cp .env.example .env
    log_warn "Por favor, edite o arquivo .env com suas configurações antes de continuar."
    read -p "Pressione Enter para continuar após editar o .env..."
fi

# Carregar variáveis de ambiente
if [ -f ".env" ]; then
    set -a
    source .env
    set +a
fi

# Executar novo container
log_info "Iniciando novo container..."
docker run -d \
    --name $CONTAINER_NAME \
    --restart unless-stopped \
    -e SPECTRUM_BOARD_URL="${SPECTRUM_BOARD_URL:-http://localhost:3000/api/upload}" \
    -e CRON_SCHEDULE="${CRON_SCHEDULE:-0 * * * *}" \
    -e HTTP_TIMEOUT="${HTTP_TIMEOUT:-30000}" \
    -v anatel_data:/app/anatel_data \
    $IMAGE_NAME

# Verificar se container está rodando
sleep 5
if docker ps -q -f name=$CONTAINER_NAME | grep -q .; then
    log_info "✅ Container iniciado com sucesso!"
    log_info "Para ver os logs: docker logs -f $CONTAINER_NAME"
    log_info "Para parar: docker stop $CONTAINER_NAME"
else
    log_error "❌ Falha ao iniciar container!"
    log_error "Logs do container:"
    docker logs $CONTAINER_NAME
    exit 1
fi

echo ""
log_info "🎉 Deployment concluído com sucesso!"
log_info "O serviço está rodando e executará a integração a cada hora."
