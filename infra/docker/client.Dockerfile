FROM oven/bun:1-slim as base

WORKDIR /app

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copiar arquivos de configuração
COPY package.json bun.lock ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/client/package.json ./apps/client/

# Instalar dependências
RUN bun install

# Copiar código fonte
COPY packages/shared ./packages/shared
COPY apps/client ./apps/client

# Build do shared package
RUN cd packages/shared && bun run build

# Expor porta (será sobrescrita pelo docker-compose)
EXPOSE 5173

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${CLIENT_PORT:-5173} || exit 1

# Comando de inicialização
CMD ["bun", "run", "--cwd", "apps/client", "dev", "--host", "0.0.0.0"]
