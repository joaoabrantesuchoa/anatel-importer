FROM node:20-alpine

# Instalar dependências do sistema para extração de arquivos
RUN apk add --no-cache \
    curl \
    unzip

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências Node.js
RUN npm ci --only=production

# Copiar código fonte
COPY src/ ./src/
COPY tsconfig.json ./

# Instalar ts-node globalmente para produção
RUN npm install -g ts-node typescript

# Criar diretório para dados
RUN mkdir -p /app/anatel_data

# Configurar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /app
USER nodejs

# Comando para iniciar aplicação
CMD ["npm", "start"]