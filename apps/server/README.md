# 🎯 Backend - Sistema de Gerenciamento de Tarefas Ágeis

Servidor backend construído com Node.js, TypeScript e arquitetura MVC robusta para o sistema de gerenciamento de tarefas ágeis.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura MVC](#arquitetura-mvc)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Boas Práticas](#boas-práticas)
- [Instalação](#instalação)
- [Desenvolvimento](#desenvolvimento)
- [API Endpoints](#api-endpoints)
- [Banco de Dados](#banco-de-dados)
- [Testes](#testes)

## 🎯 Visão Geral

O backend implementa uma API RESTful completa com arquitetura MVC (Model-View-Controller) para gerenciar:

- **Autenticação e Autorização**: Sistema JWT com multi-tenancy
- **Gestão de Projetos**: CRUD completo de projetos
- **Sistema de Equipes**: Organização e permissões
- **Sprints Ágeis**: Planejamento e execução
- **User Stories**: Histórias de usuário com critérios
- **Tarefas**: Sistema completo de tasks
- **Epics**: Organização de funcionalidades
- **Comentários**: Sistema de comunicação
- **Atividades**: Log de todas as ações
- **Multi-tenancy**: Isolamento por empresa

## 🏗️ Arquitetura MVC

### Implementação MVC no Backend

O projeto segue rigorosamente o padrão MVC com separação clara de responsabilidades:

```
src/
├── controllers/     # Controllers (C) - Recebem requisições HTTP
├── services/        # Services (M) - Lógica de negócio
├── repositories/    # Repositories (M) - Acesso a dados
├── models/          # Models (M) - Definições de entidades
├── routes/          # Routes - Definição de endpoints
├── middlewares/     # Middlewares - Validação e autenticação
├── db/             # Database - Schema e conexão
└── types/          # Tipos TypeScript
```

### 🎮 Controllers (C) - Camada de Controle

**Responsabilidade**: Receber requisições HTTP, validar dados de entrada e coordenar respostas.

```typescript
// Exemplo: ProjectController.ts
export class ProjectController {
  private projectService: ProjectService;

  constructor() {
    this.projectService = new ProjectService();
  }

  async createProject(req: Request, res: Response) {
    try {
      console.log(
        "🚀 ProjectController.createProject - Payload recebido:",
        req.body
      );

      const result = await this.projectService.createProject(req.body);

      console.log(
        "📤 ProjectController.createProject - Resposta do service:",
        result
      );

      return res.json(result);
    } catch (error) {
      console.error("💥 ProjectController.createProject - Erro:", error);
      return res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  }
}
```

**Características**:

- Recebem requisições HTTP
- Validam dados de entrada
- Delegam lógica para services
- Formatam respostas
- Tratam erros de requisição

### 🧠 Services (M) - Camada de Negócio

**Responsabilidade**: Contém toda a lógica de negócio, validações e orquestração de operações.

```typescript
// Exemplo: ProjectService.ts
export class ProjectService {
  private projectRepository: ProjectRepository;

  constructor() {
    this.projectRepository = new ProjectRepository();
  }

  async createProject(data: CreateProjectDTO): Promise<ApiResponse<Project>> {
    try {
      console.log("🔍 ProjectService.createProject - Iniciando criação:", data);

      // Validações de negócio
      if (!data.tenantId) {
        return {
          success: false,
          error: "Tenant ID é obrigatório",
        };
      }

      // Verificar se project key já existe
      const existingProject = await this.projectRepository.findByProjectKey(
        data.projectKey,
        data.tenantId
      );

      if (existingProject) {
        return {
          success: false,
          error: "Project key já existe neste tenant",
        };
      }

      // Criar projeto
      const project = await this.projectRepository.create(data);

      return {
        success: true,
        data: project,
        message: "Projeto criado com sucesso",
      };
    } catch (error) {
      console.error("💥 ProjectService.createProject - Erro:", error);
      return {
        success: false,
        error: "Erro ao criar projeto",
      };
    }
  }
}
```

**Características**:

- Lógica de negócio centralizada
- Validações complexas
- Orquestração de operações
- Regras de negócio
- Tratamento de erros de negócio

### 🗄️ Repositories (M) - Camada de Dados

**Responsabilidade**: Acesso direto ao banco de dados, operações CRUD e queries complexas.

```typescript
// Exemplo: ProjectRepository.ts
export class ProjectRepository {
  async create(data: CreateProjectDTO): Promise<Project> {
    const [project] = await db
      .insert(projects)
      .values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    if (!project) {
      throw new Error("Falha ao criar projeto");
    }

    return project;
  }

  async findByProjectKey(
    projectKey: string,
    tenantId: string
  ): Promise<Project | null> {
    const [project] = await db
      .select()
      .from(projects)
      .where(
        and(
          eq(projects.projectKey, projectKey),
          eq(projects.tenantId, tenantId)
        )
      );

    return project || null;
  }

  async findByTenant(tenantId: string): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.tenantId, tenantId))
      .orderBy(desc(projects.createdAt));
  }
}
```

**Características**:

- Operações diretas no banco
- Queries otimizadas
- Mapeamento de dados
- Transações quando necessário
- Isolamento de responsabilidades

### 📊 Models (M) - Definições de Entidades

**Responsabilidade**: Definir a estrutura dos dados e relacionamentos.

```typescript
// Exemplo: Project.ts (definido no schema.ts)
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id")
    .references(() => tenants.id)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull(),
  description: text("description"),
  projectKey: varchar("project_key", { length: 10 }).notNull(),
  status: varchar("status", { length: 20 }).default("active").notNull(),
  ownerId: uuid("owner_id")
    .references(() => users.id)
    .notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

## 🛠️ Tecnologias

### Core

- **Node.js 18+** - Runtime JavaScript
- **TypeScript 5+** - Linguagem tipada
- **Hono** - Framework web rápido e moderno
- **Drizzle ORM** - ORM type-safe para TypeScript

### Banco de Dados

- **PostgreSQL** - Banco de dados relacional
- **Drizzle Kit** - Migrations e schema management

### Autenticação & Segurança

- **JWT** - Autenticação baseada em tokens
- **bcrypt** - Criptografia de senhas
- **CORS** - Cross-Origin Resource Sharing

### Desenvolvimento

- **Bun** - Runtime JavaScript rápido
- **ESLint** - Linting de código
- **Prettier** - Formatação de código

## 📁 Estrutura do Projeto

```
src/
├── config/                 # Configurações da aplicação
│   └── index.ts           # Configurações centralizadas
├── controllers/           # Controllers MVC
│   ├── ProjectController.ts
│   ├── UserController.ts
│   ├── TeamController.ts
│   ├── SprintController.ts
│   ├── UserStoryController.ts
│   ├── TaskController.ts
│   ├── AuthController.ts
│   ├── TenantController.ts
│   ├── CommentController.ts
│   └── ActivityController.ts
├── services/             # Services MVC
│   ├── ProjectService.ts
│   ├── UserService.ts
│   ├── TeamService.ts
│   ├── SprintService.ts
│   ├── UserStoryService.ts
│   ├── TaskService.ts
│   ├── TenantService.ts
│   ├── CommentService.ts
│   └── ActivityService.ts
├── repositories/         # Repositories MVC
│   ├── ProjectRepository.ts
│   ├── UserRepository.ts
│   ├── TeamRepository.ts
│   ├── SprintRepository.ts
│   ├── UserStoryRepository.ts
│   ├── TaskRepository.ts
│   ├── TenantRepository.ts
│   ├── CommentRepository.ts
│   └── ActivityRepository.ts
├── models/              # Models MVC
│   ├── Project.ts
│   ├── User.ts
│   ├── Team.ts
│   ├── Sprint.ts
│   ├── UserStory.ts
│   ├── Task.ts
│   ├── Tenant.ts
│   ├── Comment.ts
│   └── Activity.ts
├── routes/              # Definição de rotas
│   ├── projects.ts
│   ├── users.ts
│   ├── teams.ts
│   ├── sprints.ts
│   ├── userStories.ts
│   ├── tasks.ts
│   ├── auth.ts
│   ├── tenants.ts
│   ├── comments.ts
│   └── activities.ts
├── middlewares/         # Middlewares
│   ├── errorHandler.ts  # Tratamento de erros
│   └── validation.ts    # Validação de dados
├── db/                 # Banco de dados
│   ├── connection.ts   # Conexão com banco
│   ├── schema.ts       # Schema do banco
│   ├── init.ts         # Inicialização
│   └── scripts/        # Scripts de banco
├── types/              # Tipos TypeScript
│   └── hono.ts         # Tipos do Hono
├── utils/              # Utilitários
│   └── errors.ts       # Classes de erro
├── server.ts           # Configuração do servidor
└── index.ts            # Ponto de entrada
```

## ✨ Boas Práticas Implementadas

### 🎯 Arquitetura

#### 1. **Separação de Responsabilidades**

- Controllers: Apenas recebem requisições e formatam respostas
- Services: Lógica de negócio centralizada
- Repositories: Acesso isolado aos dados
- Models: Definições claras de entidades

#### 2. **Padrão Repository**

```typescript
// Interface consistente para todos os repositories
export class BaseRepository<T> {
  async create(data: CreateDTO): Promise<T> {
    /* ... */
  }
  async findById(id: string): Promise<T | null> {
    /* ... */
  }
  async update(id: string, data: UpdateDTO): Promise<T | null> {
    /* ... */
  }
  async delete(id: string): Promise<boolean> {
    /* ... */
  }
}
```

#### 3. **Respostas Padronizadas**

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
```

### 🔒 Segurança

#### 1. **Autenticação JWT**

```typescript
// Geração de token
const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
  expiresIn: "7d",
});

// Validação de token
const decoded = jwt.verify(token, JWT_SECRET) as any;
```

#### 2. **Criptografia de Senhas**

```typescript
// Hash de senha
const hashedPassword = await bcrypt.hash(password, 12);

// Verificação de senha
const isValid = await bcrypt.compare(password, hashedPassword);
```

#### 3. **Multi-tenancy**

- Isolamento de dados por tenant
- Validação de permissões por tenant
- Queries filtradas por tenant

### 📝 Logs e Monitoramento

#### 1. **Logs Estruturados**

```typescript
console.log("🚀 Controller.method - Payload recebido:", payload);
console.log("📤 Controller.method - Resposta do service:", result);
console.log("💥 Controller.method - Erro:", error);
```

#### 2. **Tratamento de Erros**

```typescript
try {
  // Operação
} catch (error) {
  console.error("Erro detalhado:", error);
  return {
    success: false,
    error: "Mensagem amigável para o usuário",
  };
}
```

### 🧪 Testabilidade

#### 1. **Injeção de Dependências**

```typescript
export class ProjectService {
  constructor(private projectRepository: ProjectRepository) {}
}
```

#### 2. **Métodos Puros**

- Services com lógica de negócio isolada
- Repositories com operações de dados isoladas
- Fácil mock para testes

## 🚀 Instalação

### Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- Bun (recomendado) ou npm

### Passos

1. **Instalar dependências**

```bash
bun install
```

2. **Configurar variáveis de ambiente**

```bash
cp .env.example .env
# Editar .env com suas configurações
```

3. **Configurar banco de dados**

```bash
# Criar banco PostgreSQL
createdb projetointegrador

# Executar migrations
bun run db:migrate

# Executar seed (opcional)
bun run db:seed
```

4. **Iniciar desenvolvimento**

```bash
bun run dev
```

## 🔧 Desenvolvimento

### Scripts Disponíveis

```bash
# Desenvolvimento
bun run dev          # Inicia servidor de desenvolvimento
bun run build        # Compila para produção
bun run start        # Inicia servidor de produção

# Banco de dados
bun run db:migrate   # Executa migrations
bun run db:seed      # Executa seed
bun run db:drop      # Remove todas as tabelas
bun run db:validate  # Valida schema

# Linting
bun run lint         # Executa ESLint
bun run lint:fix     # Corrige problemas de linting
```

### Estrutura de Desenvolvimento

1. **Nova Funcionalidade**

   - Criar Controller
   - Criar Service
   - Criar Repository
   - Criar Model (se necessário)
   - Criar Routes
   - Adicionar testes

2. **Fluxo de Desenvolvimento**

   ```typescript
   // 1. Definir interface no shared
   interface CreateProjectDTO {
     name: string;
     description?: string;
     // ...
   }

   // 2. Implementar Repository
   async create(data: CreateProjectDTO): Promise<Project> { /* ... */ }

   // 3. Implementar Service
   async createProject(data: CreateProjectDTO): Promise<ApiResponse<Project>> { /* ... */ }

   // 4. Implementar Controller
   async createProject(req: Request, res: Response) { /* ... */ }

   // 5. Definir rota
   app.post("/projects", controller.createProject);
   ```

## 📡 API Endpoints

### Autenticação

- `POST /api/auth/register` - Cadastro de usuário com tenant
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/logout` - Logout de usuário

### Projetos

- `GET /api/projects` - Listar projetos do tenant
- `POST /api/projects` - Criar novo projeto
- `GET /api/projects/:id` - Buscar projeto por ID
- `PUT /api/projects/:id` - Atualizar projeto
- `DELETE /api/projects/:id` - Deletar projeto
- `GET /api/projects/tenant/:tenantId` - Projetos por tenant
- `GET /api/projects/owner/:ownerId` - Projetos por proprietário

### Equipes

- `GET /api/teams` - Listar equipes do tenant
- `POST /api/teams` - Criar nova equipe
- `GET /api/teams/:id` - Buscar equipe por ID
- `PUT /api/teams/:id` - Atualizar equipe
- `DELETE /api/teams/:id` - Deletar equipe

### Sprints

- `GET /api/sprints` - Listar sprints do tenant
- `POST /api/sprints` - Criar novo sprint
- `GET /api/sprints/:id` - Buscar sprint por ID
- `PUT /api/sprints/:id` - Atualizar sprint
- `DELETE /api/sprints/:id` - Deletar sprint

### User Stories

- `GET /api/user-stories` - Listar user stories
- `POST /api/user-stories` - Criar nova user story
- `GET /api/user-stories/:id` - Buscar user story por ID
- `PUT /api/user-stories/:id` - Atualizar user story
- `DELETE /api/user-stories/:id` - Deletar user story

### Tarefas

- `GET /api/tasks` - Listar tarefas
- `POST /api/tasks` - Criar nova tarefa
- `GET /api/tasks/:id` - Buscar tarefa por ID
- `PUT /api/tasks/:id` - Atualizar tarefa
- `DELETE /api/tasks/:id` - Deletar tarefa

### Usuários

- `GET /api/users` - Listar usuários do tenant
- `POST /api/users` - Criar novo usuário
- `GET /api/users/:id` - Buscar usuário por ID
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário

### Tenants

- `GET /api/tenants` - Listar tenants (admin)
- `POST /api/tenants` - Criar novo tenant
- `GET /api/tenants/:id` - Buscar tenant por ID
- `PUT /api/tenants/:id` - Atualizar tenant
- `DELETE /api/tenants/:id` - Deletar tenant

## 🗄️ Banco de Dados

### Schema Principal

```sql
-- Tenants (Empresas)
tenants (id, name, slug, description, avatar_url, created_at, updated_at)

-- Usuários
users (id, email, password_hash, name, avatar_url, is_active, last_login, created_at, updated_at)

-- Relacionamento Usuário-Tenant
user_tenants (user_id, tenant_id, status, joined_at)

-- Projetos
projects (id, tenant_id, name, slug, description, project_key, status, owner_id, start_date, end_date, created_at, updated_at)

-- Equipes
teams (id, tenant_id, name, description, created_at, updated_at)

-- Sprints
sprints (id, project_id, name, description, start_date, end_date, status, created_at, updated_at)

-- User Stories
user_stories (id, epic_id, project_id, status_id, title, description, acceptance_criteria, story_points, priority, assignee_id, due_date, created_at, updated_at)

-- Tarefas
tasks (id, story_id, project_id, status_id, title, description, priority, estimated_hours, actual_hours, assignee_id, reporter_id, due_date, created_at, updated_at)
```

### Relacionamentos

- **Tenant** → **Users** (via user_tenants)
- **Tenant** → **Projects** (1:N)
- **Tenant** → **Teams** (1:N)
- **Project** → **Sprints** (1:N)
- **Project** → **User Stories** (1:N)
- **Project** → **Tasks** (1:N)
- **User Story** → **Tasks** (1:N)
- **Epic** → **User Stories** (1:N)

### Índices de Performance

```sql
-- Índices principais
CREATE INDEX idx_projects_tenant_id ON projects(tenant_id);
CREATE INDEX idx_projects_owner_id ON projects(owner_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_user_stories_project_id ON user_stories(project_id);
CREATE INDEX idx_sprints_project_id ON sprints(project_id);
```

## 🧪 Testes

### Estrutura de Testes

```
tests/
├── http-client.env.json    # Configurações do HTTP Client
├── projects.http          # Testes de projetos
├── users.http             # Testes de usuários
├── teams.http             # Testes de equipes
├── sprints.http           # Testes de sprints
├── userStories.http       # Testes de user stories
├── tasks.http             # Testes de tarefas
├── auth.http              # Testes de autenticação
└── README.md              # Documentação dos testes
```

### Executando Testes

```bash
# Testes manuais com HTTP Client
# Use o VS Code REST Client ou similar

# Testes automatizados (futuro)
bun run test
bun run test:watch
bun run test:coverage
```

### Exemplo de Teste

```http
### Criar projeto
POST http://localhost:8080/api/projects
Content-Type: application/json

{
  "name": "Projeto Teste",
  "slug": "projeto-teste",
  "description": "Descrição do projeto teste",
  "projectKey": "PT",
  "tenantId": "{{tenantId}}",
  "ownerId": "{{userId}}"
}
```

## 📊 Monitoramento

### Logs Estruturados

- **🚀** - Início de operação
- **📥** - Dados recebidos
- **📤** - Dados enviados
- **🔍** - Processamento
- **✅** - Sucesso
- **❌** - Erro
- **💥** - Erro crítico

### Métricas Importantes

- Tempo de resposta das APIs
- Taxa de erro por endpoint
- Uso de memória e CPU
- Conexões ativas no banco
- Queries lentas

## 🔄 Deploy

### Produção

```bash
# Build
bun run build

# Start
bun run start
```

### Docker

```bash
# Build da imagem
docker build -t projetointegrador-server .

# Executar container
docker run -p 8080:8080 projetointegrador-server
```

### Variáveis de Ambiente

```env
# Banco de dados
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname

# JWT
JWT_SECRET=your-secret-key

# Servidor
PORT=8080
NODE_ENV=production

# CORS
CORS_ORIGIN=http://localhost:5173
```

---

**🎯 Backend robusto com arquitetura MVC bem definida, seguindo as melhores práticas de desenvolvimento!**
