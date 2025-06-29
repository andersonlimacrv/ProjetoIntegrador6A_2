# Projeto Integrador 6A

Sistema de gerenciamento desenvolvido com **Bun**, **React**, **Vite**, **Hono.js**, **Drizzle ORM**, **Tailwind CSS** e **shadcn/ui**.

## 🏗️ Arquitetura

### Estrutura do Projeto

```
ProjetoIntegrador6A_2/
├── apps/
│   ├── client/          # Frontend React + Vite
│   └── server/          # Backend Hono + Drizzle
├── packages/
│   └── shared/          # Tipos e utilitários compartilhados
├── infra/               # Configurações Docker e banco
└── docker-compose.yml   # Orquestração dos serviços
```

### Padrão MVC no Servidor

O servidor segue um padrão **MVC estrito** com **reutilização máxima**:

#### **Models** (`src/models/`)

- **Re-exportam tipos** do pacote `shared`
- **Sem duplicação** de interfaces
- Exemplo: `User.ts` e `Task.ts` apenas re-exportam do `@packages/shared`

#### **Repositories** (`src/repositories/`)

- **Acesso direto** ao banco de dados
- **Usam tipos** do pacote `shared`
- Implementam operações CRUD básicas
- Exemplo: `UserRepository.ts`, `TaskRepository.ts`

#### **Services** (`src/services/`)

- **Lógica de negócio** simples e direta
- **Validações** de regras de negócio
- **Usam tipos** do pacote `shared`
- Exemplo: `UserService.ts`, `TaskService.ts`

#### **Controllers** (`src/controllers/`)

- **Orquestração** das operações
- **Validação** com schemas do `shared`
- **Respostas padronizadas**
- Exemplo: `userController.ts`, `taskController.ts`

#### **Routes** (`src/routes/`)

- **Endpoints** da API
- **Middlewares** de validação
- Exemplo: `users.ts`, `tasks.ts`

### Pacote Shared (Reutilização Máxima)

O `packages/shared` é o **coração da reutilização**:

#### **Tipos TypeScript**

```typescript
// Compartilhados entre frontend e backend
export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}
```

#### **Schemas de Validação**

```typescript
// Zod schemas reutilizáveis
export const CreateUserSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
});

export const CreateTaskSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  userId: z.number().positive(),
});
```

#### **Vantagens da Reutilização**

- **Type Safety** em toda aplicação
- **Validação consistente** frontend/backend
- **Manutenibilidade** centralizada
- **Zero duplicação** de código
- **Desenvolvimento mais rápido**

## 🚀 Como Executar

### Desenvolvimento Local

```bash
# Instalar dependências
bun install

# Executar em desenvolvimento
make dev
```

### Docker

```bash
# Construir e executar
make docker-up

# Parar containers
make docker-down
```

## 📊 Endpoints da API

### Health Check

- `GET /health` - Status do servidor e banco de dados

### Usuários

- `GET /api/users` - Listar todos os usuários
- `GET /api/users/:id` - Buscar usuário por ID
- `POST /api/users` - Criar novo usuário
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário

### Tasks

- `GET /api/tasks` - Listar todas as tasks
- `GET /api/tasks/:id` - Buscar task por ID
- `GET /api/tasks/user/:userId` - Tasks de um usuário
- `GET /api/tasks/completed` - Tasks completadas
- `GET /api/tasks/pending` - Tasks pendentes
- `POST /api/tasks` - Criar nova task
- `PUT /api/tasks/:id` - Atualizar task
- `PATCH /api/tasks/:id/complete` - Marcar como completa
- `PATCH /api/tasks/:id/incomplete` - Marcar como incompleta
- `DELETE /api/tasks/:id` - Deletar task

## 🛠️ Comandos Úteis

### Desenvolvimento

```bash
make dev          # Executar em desenvolvimento
make build        # Construir para produção
make clean        # Limpar arquivos temporários
```

### Docker

```bash
make docker-up    # Subir containers
make docker-down  # Parar containers
make docker-rebuild # Reconstruir containers
```

### Banco de Dados

```bash
make db-seed      # Popular banco com dados de exemplo
make db-reset     # Resetar banco (limpar + popular)
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Servidor
NODE_ENV=development
SERVER_PORT=3001

# Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_NAME=integrador_db
DB_USER=useryabuser
DB_PASSWORD=senha_spr_sekreta
DATABASE_URL=postgresql://useryabuser:senha_spr_sekreta@localhost:5432/integrador_db

# CORS
CORS_ORIGIN=http://localhost:5190

# Frontend
CLIENT_PORT=5190
VITE_API_URL=http://localhost:3001
```

## 📚 Estrutura do Código

### Frontend (apps/client)

- **Components** - Componentes React reutilizáveis
- **Services** - Cliente HTTP para comunicação com API
- **Types** - Tipos importados do pacote shared

### Backend (apps/server)

- **MVC Pattern** - Separação clara de responsabilidades
- **Validação** - Middlewares de validação com Zod
- **Tratamento de Erros** - Middleware global de erros
- **Logs** - Sistema de logging detalhado

### Shared (packages/shared)

- **Types** - Interfaces e DTOs compartilhados
- **Schemas** - Validação Zod reutilizável
- **Utils** - Funções utilitárias

## 🔄 Fluxo de Desenvolvimento

### 1. Definir Tipos no Shared

```typescript
// packages/shared/src/types/user.ts
export interface User {
  id: number;
  name: string;
  email: string;
}
```

### 2. Criar Schema no Shared

```typescript
// packages/shared/src/types/user.ts
export const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});
```

### 3. Implementar no Backend

```typescript
// apps/server/src/models/User.ts
export * from "@packages/shared";

// apps/server/src/repositories/UserRepository.ts
import { User, CreateUserDTO } from "@packages/shared";

// apps/server/src/controllers/userController.ts
import { CreateUserSchema } from "@packages/shared";
```

### 4. Usar no Frontend

```typescript
// apps/client/src/services/api.ts
import { User, CreateUserDTO } from "@packages/shared";

// apps/client/src/components/UserList.tsx
import { User } from "@packages/shared";
```

## 🧪 Testes

### API

```bash
# Health check
curl http://localhost:3001/health

# Listar usuários
curl http://localhost:3001/api/users

# Listar tasks
curl http://localhost:3001/api/tasks

# Criar task
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Nova Task", "description": "Descrição", "userId": 1}'
```

## 🚨 Tratamento de Erros

- **400** - Dados inválidos
- **404** - Recurso não encontrado
- **409** - Conflito (ex: email já existe)
- **500** - Erro interno do servidor

## 📝 Logs

O sistema inclui logs detalhados:

- Requisições HTTP com tempo de resposta
- Erros de validação
- Status da conexão com banco
- Operações de CRUD

## 🔍 Monitoramento

- **Health Check** - `/health` para verificar status
- **Logs** - Console logs detalhados
- **Docker** - Logs dos containers

## 📚 Dependências Principais

### Backend

- **Hono.js** - Framework web
- **Drizzle ORM** - ORM para PostgreSQL
- **Zod** - Validação de esquemas
- **PostgreSQL** - Banco de dados

### Frontend

- **React** - Framework UI
- **Vite** - Build tool
- **Tailwind CSS** - Framework CSS
- **shadcn/ui** - Componentes UI

### Shared

- **TypeScript** - Tipagem estática
- **Zod** - Validação de esquemas
