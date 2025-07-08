# Makefile para Projeto Integrador
.PHONY: help dev build clean docker-up docker-down docker-rebuild db-create-tables db-seed db-clear db-reset

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
	@echo "  db-create-tables - Criar tabelas do banco"
	@echo "  db-seed       - Popular banco com dados"
	@echo "  db-clear      - Limpar dados do banco"
	@echo "  db-reset      - Resetar banco (limpar + popular)"

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

reborn:
	$(DOCKER_COMPOSE) down
	$(DOCKER_COMPOSE) build --no-cache
	$(DOCKER_COMPOSE) up -d
	$(DOCKER_COMPOSE) logs -f


# Banco de dados
db-create-tables:
	@echo "🗄️ Criando tabelas do banco..."
	cd apps/server && bun run db:create-tables
	@echo "✅ Tabelas criadas!"

db-seed:
	@echo "🌱 Populando banco com dados..."
	cd apps/server && bun run db:seed
	@echo "✅ Banco populado!"

db-clear:
	@echo "🧹 Limpando dados do banco..."
	cd apps/server && bun run db:clear
	@echo "✅ Dados limpos!"

db-reset:
	@echo "🔄 Resetando banco..."
	cd apps/server && bun run db:reset
	@echo "✅ Banco resetado!"

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
	@make db-create-tables
	@make db-seed
	@echo "✅ Setup concluído!"
	@echo "🌐 Acesse: http://localhost:5190"

# Comandos de desenvolvimento rápido
dev-server:
	@echo "�� Iniciando apenas o servidor..."
	cd apps/server && bun run dev

dev-client:
	@echo "🎨 Iniciando apenas o cliente..."
	cd apps/client && bun run dev

