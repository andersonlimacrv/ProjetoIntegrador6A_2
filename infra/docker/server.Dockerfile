FROM oven/bun:1-slim

WORKDIR /app

# Copy only package files first
COPY package.json bun.lock ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/server/package.json ./apps/server/

# Install dependencies
RUN bun install --filter '@apps/server'

# Copy source files
COPY apps/server ./apps/server
COPY packages/shared ./packages/shared

# Build shared package
RUN cd packages/shared && bun run build

EXPOSE 3000

ENTRYPOINT ["bun", "run", "apps/server/src/index.ts"]
