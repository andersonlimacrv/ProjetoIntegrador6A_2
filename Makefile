# Makefile para Projeto Integrador
.PHONY: help install dev build start clean docker-build docker-up docker-down docker-logs db-generate db-migrate db-studio

# Variáveis
NODE_ENV ?= development
DOCKER_COMPOSE = docker-compose

# Instalar dependências
install:
	@echo "📦 Instalando dependências..."
	bun install
	@echo "✅ Dependências instaladas!"

# Executar em modo desenvolvimento
dev:
	@echo "🚀 Iniciando modo desenvolvimento..."
	bun run dev

# Build do projeto
build:
	@echo "🔨 Fazendo build do projeto..."
	bun run build
	@echo "✅ Build concluído!"

# Executar em modo produção
start:
	@echo "🚀 Iniciando modo produção..."
	bun run start

# Limpar arquivos temporários
clean:
	@echo "🧹 Limpando arquivos temporários..."
	-@rmdir /s /q node_modules 2>nul
	-@rmdir /s /q packages\shared\dist 2>nul
	-@rmdir /s /q apps\client\dist 2>nul
	-@rmdir /s /q apps\server\dist 2>nul
	-@rmdir /s /q apps\server\drizzle 2>nul
	@echo "✅ Limpeza concluída!"

# Docker commands
docker-build:
	@echo "🐳 Build das imagens Docker..."
	$(DOCKER_COMPOSE) build
	@echo "✅ Build das imagens concluído!"

docker-up:
	@echo "🐳 Subindo containers Docker..."
	$(DOCKER_COMPOSE) up -d
	@echo "✅ Containers iniciados!"
	@echo "🌐 Frontend: http://localhost:5173"
	@echo "🔧 Backend: http://localhost:3000"
	@echo "🗄️  Database: localhost:5432"

down:
	@echo "🐳 Parando containers Docker..."
	$(DOCKER_COMPOSE) down
	@echo "✅ Containers parados!"

logs:
	@echo "📋 Logs dos containers..."
	$(DOCKER_COMPOSE) logs -f

logs-server:
	@echo "📋 Logs do servidor..."
	$(DOCKER_COMPOSE) logs -f projetointegrador_server

logs-client:
	@echo "📋 Logs do cliente..."
	$(DOCKER_COMPOSE) logs -f projetointegrador_client


# Database commands
db-generate:
	@echo "🗄️ Gerando migrações do banco..."
	cd apps/server && bun run db:generate
	@echo "✅ Migrações geradas!"

db-migrate:
	@echo "🗄️ Executando migrações..."
	cd apps/server && bun run db:migrate
	@echo "✅ Migrações executadas!"

# Setup inicial do projeto
setup:
	@echo "🚀 Setup inicial do projeto..."
	@make install
	@make docker-up
	@echo "⏳ Aguardando serviços iniciarem..."
	@sleep 10
	@make db-generate
	@make db-migrate
	@echo "✅ Setup concluído!"
	@echo "🌐 Acesse: http://localhost:5173"

# Comandos de desenvolvimento rápido
dev-server:
	@echo "🔧 Iniciando apenas o servidor..."
	cd apps/server && bun run dev

dev-client:
	@echo "🎨 Iniciando apenas o cliente..."
	cd apps/client && bun run dev

# Comandos de teste
test:
	@echo "🧪 Executando testes..."
	bun test

# Comandos de linting
lint:
	@echo "🔍 Executando linting..."
	bun run lint

lint-fix:
	@echo "🔧 Corrigindo problemas de linting..."
	bun run lint --fix

# Comandos de type checking
type-check:
	@echo "🔍 Verificando tipos..."
	bun run type-check 