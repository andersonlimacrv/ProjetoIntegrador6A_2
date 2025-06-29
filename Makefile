# Makefile para Projeto Integrador
.PHONY: help dev build clean docker-up docker-down docker-rebuild db-seed db-reset

# Variáveis
NODE_ENV ?= development
DOCKER_COMPOSE = docker-compose

# Comandos principais
help:
	@echo "Comandos disponíveis:"
	@echo "  dev           - Executar em desenvolvimento"
	@echo "  build         - Construir para produção"
	@echo "  clean         - Limpar arquivos temporários"
	@echo "  docker-up     - Subir containers"
	@echo "  docker-down   - Parar containers"
	@echo "  docker-rebuild- Reconstruir containers"
	@echo "  db-seed       - Popular banco com dados"
	@echo "  db-reset      - Resetar banco"

# Desenvolvimento
dev:
	bun run dev

build:
	bun run build

clean:
	rm -rf node_modules
	rm -rf apps/*/node_modules
	rm -rf packages/*/node_modules
	rm -rf apps/*/dist
	rm -rf packages/*/dist

# Docker
docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-rebuild:
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d

# Banco de dados
db-seed:
	cd apps/server && bun run seed

db-reset:
	cd apps/server && bun run seed reset

# Instalar dependências
install:
	@echo "📦 Instalando dependências..."
	bun install
	@echo "✅ Dependências instaladas!"

# Executar em modo produção
start:
	@echo "🚀 Iniciando modo produção..."
	bun run start

# Docker commands
docker-build:
	@echo "🐳 Build das imagens Docker..."
	$(DOCKER_COMPOSE) build
	@echo "✅ Build das imagens concluído!"

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