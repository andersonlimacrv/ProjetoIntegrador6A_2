FROM oven/bun:1-slim as base

WORKDIR /app

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copiar arquivos de configuração
COPY package.json bun.lock ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/server/package.json ./apps/server/

# Instalar dependências
RUN bun install

# Copiar código fonte
COPY packages/shared ./packages/shared
COPY apps/server ./apps/server

# Build do shared package
RUN cd packages/shared && bun run build

# Build do servidor
RUN cd apps/server && bun run build

# Stage de produção
FROM oven/bun:1-slim as production

WORKDIR /app

# Copiar apenas os arquivos necessários
COPY --from=base /app/package.json ./
COPY --from=base /app/bun.lock ./
COPY --from=base /app/packages/shared/dist ./packages/shared/dist
COPY --from=base /app/apps/server/dist ./apps/server/dist
COPY --from=base /app/packages/shared/package.json ./packages/shared/
COPY --from=base /app/apps/server/package.json ./apps/server/

# Instalar apenas dependências de produção
RUN bun install --production

# Expor porta (será sobrescrita pelo docker-compose)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${SERVER_PORT:-3000}/health || exit 1

# Comando de inicialização
CMD ["bun", "run", "apps/server/dist/server.js"]
