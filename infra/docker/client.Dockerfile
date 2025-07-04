FROM oven/bun:1-slim AS base

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

# Copia código fonte
COPY packages/shared ./packages/shared
COPY apps/client ./apps/client

# Build do shared package
RUN cd packages/shared && bun run build

ARG CLIENT_PORT
ENV CLIENT_PORT=${CLIENT_PORT}

EXPOSE ${CLIENT_PORT}

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
CMD curl -f http://localhost:${CLIENT_PORT} || exit 1


# Comando de inicialização
CMD ["bun", "run", "--cwd", "apps/client", "dev", "--host", "0.0.0.0"]
