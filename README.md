# Projeto Integrador 6A

Um sistema completo de gerenciamento desenvolvido com tecnologias modernas, incluindo um monorepo com frontend React, backend Hono.js, banco de dados PostgreSQL com Drizzle ORM, e containerização Docker.

## 🚀 Tecnologias

### Backend

- **Bun** - Runtime JavaScript rápido
- **Hono.js** - Framework web moderno e leve
- **Drizzle ORM** - ORM type-safe para PostgreSQL
- **PostgreSQL** - Banco de dados relacional
- **TypeScript** - Tipagem estática

### Frontend

- **React 18** - Biblioteca de interface
- **Vite** - Build tool rápida
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes UI modernos
- **TypeScript** - Tipagem estática

### Infraestrutura

- **Docker** - Containerização
- **Docker Compose** - Orquestração de containers
- **Monorepo** - Estrutura com workspaces

## 📁 Estrutura do Projeto

```
ProjetoIntegrador6A_2/
├── apps/
│   ├── client/          # Frontend React
│   └── server/          # Backend Hono.js
├── packages/
│   └── shared/          # Tipos e utilitários compartilhados
├── infra/
│   ├── docker/          # Dockerfiles
│   └── db/              # Scripts de banco
├── docker-compose.yml   # Orquestração Docker
├── Makefile            # Comandos automatizados
└── README.md           # Documentação
```

## 🛠️ Instalação e Configuração

### Pré-requisitos

- [Bun](https://bun.sh/) (versão 1.0+)
- [Docker](https://docker.com/) (versão 20.0+)
- [Docker Compose](https://docs.docker.com/compose/) (versão 2.0+)

### Setup Rápido

1. **Clone o repositório**

   ```bash
   git clone <url-do-repositorio>
   cd ProjetoIntegrador6A_2
   ```

2. **Configure as variáveis de ambiente**

   ```bash
   cp env.example .env
   # Edite o arquivo .env conforme necessário
   ```

3. **Setup completo com Docker**
   ```bash
   make setup
   ```

### Setup Manual

1. **Instalar dependências**

   ```bash
   make install
   ```

2. **Subir containers Docker**

   ```bash
   make docker-up
   ```

3. **Gerar e executar migrações**
   ```bash
   make db-generate
   make db-migrate
   ```

## 🚀 Como Executar

### Desenvolvimento

```bash
# Executar tudo em modo desenvolvimento
make dev

# Ou executar separadamente
make dev-server  # Apenas backend
make dev-client  # Apenas frontend
```

### Produção

```bash
# Build e execução
make build
make start

# Ou com Docker
make docker-build
make docker-up
```

## 📋 Comandos Disponíveis

### Desenvolvimento

- `make dev` - Executar em modo desenvolvimento
- `make dev-server` - Executar apenas o servidor
- `make dev-client` - Executar apenas o cliente
- `make build` - Build do projeto
- `make start` - Executar em modo produção

### Docker

- `make docker-build` - Build das imagens Docker
- `make docker-up` - Subir containers
- `make docker-down` - Parar containers
- `make docker-logs` - Ver logs

### Banco de Dados

- `make db-generate` - Gerar migrações
- `make db-migrate` - Executar migrações
- `make db-studio` - Abrir Drizzle Studio

### Utilitários

- `make install` - Instalar dependências
- `make clean` - Limpar arquivos temporários
- `make type-check` - Verificar tipos
- `make lint` - Executar linting

## 🌐 URLs de Acesso

Após executar o projeto:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **Drizzle Studio**: http://localhost:4983 (apenas em desenvolvimento)

## 📊 API Endpoints

### Usuários

- `GET /api/users` - Listar todos os usuários
- `GET /api/users/:id` - Buscar usuário por ID
- `POST /api/users` - Criar novo usuário
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário

### Sistema

- `GET /health` - Health check do servidor
- `GET /` - Informações da API

## 🗄️ Banco de Dados

O projeto utiliza PostgreSQL com Drizzle ORM. As tabelas são criadas automaticamente através de migrações.

### Estrutura das Tabelas

```sql
-- Tabela de usuários
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de posts (futura implementação)
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  author_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔧 Configuração

### Variáveis de Ambiente

Copie o arquivo `env.example` para `.env` e configure:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/projetointegrador"
DB_HOST=localhost
DB_PORT=5432
DB_NAME=projetointegrador
DB_USER=postgres
DB_PASSWORD=password

# Server
SERVER_PORT=3000
NODE_ENV=development

# Client
CLIENT_PORT=5173
VITE_API_URL=http://localhost:3000

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# CORS
CORS_ORIGIN=http://localhost:5173
```

## 🐳 Docker

### Containers

- **postgres**: Banco de dados PostgreSQL
- **server**: Backend Hono.js
- **client**: Frontend React com Vite Dev Server
- **drizzle-studio**: Interface para gerenciar o banco (dev)

### Volumes

- `postgres_data`: Dados persistentes do PostgreSQL

### Networks

- `app-network`: Rede interna dos containers

## 🧪 Desenvolvimento

### Estrutura de Código

- **TypeScript** em todo o projeto
- **ESLint** para linting
- **Prettier** para formatação
- **Husky** para git hooks (futura implementação)

### Padrões

- **Monorepo** com workspaces
- **Componentes reutilizáveis** no frontend
- **Controllers** para lógica de negócio
- **Schemas** para validação de dados
- **Tipos compartilhados** entre frontend e backend

## 📝 Scripts NPM/Bun

### Raiz do Projeto

- `bun run dev` - Desenvolvimento completo
- `bun run build` - Build completo
- `bun run start` - Produção completa
- `bun run type-check` - Verificação de tipos
- `bun run lint` - Linting

### Servidor

- `bun run dev` - Desenvolvimento
- `bun run build` - Build
- `bun run db:generate` - Gerar migrações
- `bun run db:migrate` - Executar migrações
- `bun run db:studio` - Drizzle Studio

### Cliente

- `bun run dev` - Desenvolvimento
- `bun run build` - Build
- `bun run preview` - Preview da build

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique a documentação
2. Execute `make help` para ver todos os comandos
3. Verifique os logs com `make docker-logs`
4. Abra uma issue no repositório

---

**Desenvolvido com ❤️ usando Bun, React, Hono.js e TypeScript**
