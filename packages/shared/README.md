# 📦 Shared Package - Tipos e Utilitários Compartilhados

Pacote compartilhado contendo tipos TypeScript, interfaces e utilitários utilizados tanto pelo frontend quanto pelo backend do sistema de gerenciamento de tarefas ágeis.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Tipos](#tipos)
- [Interfaces](#interfaces)
- [Utilitários](#utilitários)
- [Instalação](#instalação)
- [Uso](#uso)
- [Desenvolvimento](#desenvolvimento)

## 🎯 Visão Geral

O pacote `shared` é o coração da arquitetura do sistema, fornecendo:

- **Tipos TypeScript**: Definições de tipos para todas as entidades
- **Interfaces de API**: Contratos para comunicação frontend-backend
- **DTOs**: Data Transfer Objects para operações CRUD
- **Utilitários**: Funções compartilhadas entre aplicações
- **Constantes**: Valores constantes do sistema
- **Validações**: Schemas de validação compartilhados

## 🏗️ Arquitetura

### Estrutura do Pacote

```
src/
├── types/              # Definições de tipos
│   ├── user.ts         # Tipos de usuário
│   ├── project.ts      # Tipos de projeto
│   ├── team.ts         # Tipos de equipe
│   ├── sprint.ts       # Tipos de sprint
│   ├── userStory.ts    # Tipos de user story
│   ├── task.ts         # Tipos de tarefa
│   ├── tenant.ts       # Tipos de tenant
│   ├── comment.ts      # Tipos de comentário
│   ├── activity.ts     # Tipos de atividade
│   └── session.ts      # Tipos de sessão
├── utils/              # Utilitários
│   └── index.ts        # Funções utilitárias
└── index.ts            # Ponto de entrada
```

### Princípios de Design

1. **Single Source of Truth**: Todas as definições de tipos vêm de um único local
2. **Type Safety**: Tipagem forte em toda a aplicação
3. **Consistência**: Interfaces consistentes entre frontend e backend
4. **Extensibilidade**: Fácil adição de novos tipos e funcionalidades
5. **Documentação**: Tipos bem documentados com JSDoc

## 📝 Tipos

### 🧑‍💼 User Types

```typescript
// apps/shared/src/types/user.ts

/**
 * Usuário do sistema
 */
export interface User {
  /** ID único do usuário */
  id: string;
  /** Email do usuário (único) */
  email: string;
  /** Nome completo do usuário */
  name: string;
  /** URL do avatar do usuário */
  avatarUrl?: string;
  /** Status de ativação do usuário */
  isActive: boolean;
  /** Data do último login */
  lastLogin?: Date;
  /** Data de criação */
  createdAt: Date;
  /** Data da última atualização */
  updatedAt: Date;
}

/**
 * DTO para criação de usuário
 */
export interface CreateUserDTO {
  /** Email do usuário */
  email: string;
  /** Senha do usuário */
  password: string;
  /** Nome completo do usuário */
  name: string;
  /** URL do avatar (opcional) */
  avatarUrl?: string;
}

/**
 * DTO para atualização de usuário
 */
export interface UpdateUserDTO {
  /** Nome do usuário */
  name?: string;
  /** Email do usuário */
  email?: string;
  /** URL do avatar */
  avatarUrl?: string;
  /** Status de ativação */
  isActive?: boolean;
}

/**
 * DTO para login de usuário
 */
export interface LoginUserDTO {
  /** Email do usuário */
  email: string;
  /** Senha do usuário */
  password: string;
}
```

### 🏢 Tenant Types

```typescript
// apps/shared/src/types/tenant.ts

/**
 * Tenant (Empresa/Organização)
 */
export interface Tenant {
  /** ID único do tenant */
  id: string;
  /** Nome da empresa */
  name: string;
  /** Slug único da empresa */
  slug: string;
  /** Descrição da empresa */
  description?: string;
  /** URL do avatar da empresa */
  avatarUrl?: string;
  /** Data de criação */
  createdAt: Date;
  /** Data da última atualização */
  updatedAt: Date;
}

/**
 * DTO para criação de tenant
 */
export interface CreateTenantDTO {
  /** Nome da empresa */
  name: string;
  /** Slug da empresa */
  slug: string;
  /** Descrição da empresa */
  description?: string;
  /** URL do avatar */
  avatarUrl?: string;
}

/**
 * DTO para atualização de tenant
 */
export interface UpdateTenantDTO {
  /** Nome da empresa */
  name?: string;
  /** Slug da empresa */
  slug?: string;
  /** Descrição da empresa */
  description?: string;
  /** URL do avatar */
  avatarUrl?: string;
}
```

### 📋 Project Types

```typescript
// apps/shared/src/types/project.ts

/**
 * Projeto do sistema
 */
export interface Project {
  /** ID único do projeto */
  id: string;
  /** ID do tenant */
  tenantId: string;
  /** Nome do projeto */
  name: string;
  /** Slug único do projeto */
  slug: string;
  /** Descrição do projeto */
  description?: string;
  /** Chave única do projeto */
  projectKey: string;
  /** Status do projeto */
  status: ProjectStatus;
  /** ID do proprietário */
  ownerId: string;
  /** Data de início */
  startDate?: Date;
  /** Data de término */
  endDate?: Date;
  /** Data de criação */
  createdAt: Date;
  /** Data da última atualização */
  updatedAt: Date;
}

/**
 * Status do projeto
 */
export type ProjectStatus = "active" | "archived" | "completed";

/**
 * DTO para criação de projeto
 */
export interface CreateProjectDTO {
  /** ID do tenant */
  tenantId: string;
  /** Nome do projeto */
  name: string;
  /** Slug do projeto */
  slug: string;
  /** Descrição do projeto */
  description?: string;
  /** Chave do projeto */
  projectKey: string;
  /** ID do proprietário */
  ownerId: string;
  /** Data de início */
  startDate?: Date;
  /** Data de término */
  endDate?: Date;
}

/**
 * DTO para atualização de projeto
 */
export interface UpdateProjectDTO {
  /** Nome do projeto */
  name?: string;
  /** Slug do projeto */
  slug?: string;
  /** Descrição do projeto */
  description?: string;
  /** Chave do projeto */
  projectKey?: string;
  /** Status do projeto */
  status?: ProjectStatus;
  /** Data de início */
  startDate?: Date;
  /** Data de término */
  endDate?: Date;
}
```

### 👥 Team Types

```typescript
// apps/shared/src/types/team.ts

/**
 * Equipe do sistema
 */
export interface Team {
  /** ID único da equipe */
  id: string;
  /** ID do tenant */
  tenantId: string;
  /** Nome da equipe */
  name: string;
  /** Descrição da equipe */
  description?: string;
  /** Data de criação */
  createdAt: Date;
  /** Data da última atualização */
  updatedAt: Date;
}

/**
 * DTO para criação de equipe
 */
export interface CreateTeamDTO {
  /** ID do tenant */
  tenantId: string;
  /** Nome da equipe */
  name: string;
  /** Descrição da equipe */
  description?: string;
}

/**
 * DTO para atualização de equipe
 */
export interface UpdateTeamDTO {
  /** Nome da equipe */
  name?: string;
  /** Descrição da equipe */
  description?: string;
}
```

### 🏃 Sprint Types

```typescript
// apps/shared/src/types/sprint.ts

/**
 * Sprint ágil
 */
export interface Sprint {
  /** ID único do sprint */
  id: string;
  /** ID do projeto */
  projectId: string;
  /** Nome do sprint */
  name: string;
  /** Descrição do sprint */
  description?: string;
  /** Data de início */
  startDate: Date;
  /** Data de término */
  endDate: Date;
  /** Status do sprint */
  status: SprintStatus;
  /** Data de criação */
  createdAt: Date;
  /** Data da última atualização */
  updatedAt: Date;
}

/**
 * Status do sprint
 */
export type SprintStatus = "planned" | "active" | "completed" | "cancelled";

/**
 * DTO para criação de sprint
 */
export interface CreateSprintDTO {
  /** ID do projeto */
  projectId: string;
  /** Nome do sprint */
  name: string;
  /** Descrição do sprint */
  description?: string;
  /** Data de início */
  startDate: Date;
  /** Data de término */
  endDate: Date;
}

/**
 * DTO para atualização de sprint
 */
export interface UpdateSprintDTO {
  /** Nome do sprint */
  name?: string;
  /** Descrição do sprint */
  description?: string;
  /** Data de início */
  startDate?: Date;
  /** Data de término */
  endDate?: Date;
  /** Status do sprint */
  status?: SprintStatus;
}
```

### 📖 User Story Types

```typescript
// apps/shared/src/types/userStory.ts

/**
 * User Story (História de Usuário)
 */
export interface UserStory {
  /** ID único da user story */
  id: string;
  /** ID do épico (opcional) */
  epicId?: string;
  /** ID do projeto */
  projectId: string;
  /** ID do status */
  statusId: string;
  /** Título da user story */
  title: string;
  /** Descrição da user story */
  description?: string;
  /** Critérios de aceitação */
  acceptanceCriteria?: string;
  /** Story points */
  storyPoints?: number;
  /** Prioridade (1-5) */
  priority: number;
  /** ID do responsável */
  assigneeId?: string;
  /** Data de vencimento */
  dueDate?: Date;
  /** Data de criação */
  createdAt: Date;
  /** Data da última atualização */
  updatedAt: Date;
}

/**
 * DTO para criação de user story
 */
export interface CreateUserStoryDTO {
  /** ID do épico */
  epicId?: string;
  /** ID do projeto */
  projectId: string;
  /** ID do status */
  statusId: string;
  /** Título da user story */
  title: string;
  /** Descrição da user story */
  description?: string;
  /** Critérios de aceitação */
  acceptanceCriteria?: string;
  /** Story points */
  storyPoints?: number;
  /** Prioridade */
  priority?: number;
  /** ID do responsável */
  assigneeId?: string;
  /** Data de vencimento */
  dueDate?: Date;
}

/**
 * DTO para atualização de user story
 */
export interface UpdateUserStoryDTO {
  /** ID do épico */
  epicId?: string;
  /** ID do status */
  statusId?: string;
  /** Título da user story */
  title?: string;
  /** Descrição da user story */
  description?: string;
  /** Critérios de aceitação */
  acceptanceCriteria?: string;
  /** Story points */
  storyPoints?: number;
  /** Prioridade */
  priority?: number;
  /** ID do responsável */
  assigneeId?: string;
  /** Data de vencimento */
  dueDate?: Date;
}
```

### ✅ Task Types

```typescript
// apps/shared/src/types/task.ts

/**
 * Tarefa do sistema
 */
export interface Task {
  /** ID único da tarefa */
  id: string;
  /** ID da user story (opcional) */
  storyId?: string;
  /** ID do projeto */
  projectId: string;
  /** ID do status */
  statusId: string;
  /** Título da tarefa */
  title: string;
  /** Descrição da tarefa */
  description?: string;
  /** Prioridade (1-5) */
  priority: number;
  /** Horas estimadas */
  estimatedHours?: number;
  /** Horas reais */
  actualHours?: number;
  /** ID do responsável */
  assigneeId?: string;
  /** ID do reportador */
  reporterId: string;
  /** Data de vencimento */
  dueDate?: Date;
  /** Data de criação */
  createdAt: Date;
  /** Data da última atualização */
  updatedAt: Date;
}

/**
 * DTO para criação de tarefa
 */
export interface CreateTaskDTO {
  /** ID da user story */
  storyId?: string;
  /** ID do projeto */
  projectId: string;
  /** ID do status */
  statusId: string;
  /** Título da tarefa */
  title: string;
  /** Descrição da tarefa */
  description?: string;
  /** Prioridade */
  priority?: number;
  /** Horas estimadas */
  estimatedHours?: number;
  /** ID do responsável */
  assigneeId?: string;
  /** ID do reportador */
  reporterId: string;
  /** Data de vencimento */
  dueDate?: Date;
}

/**
 * DTO para atualização de tarefa
 */
export interface UpdateTaskDTO {
  /** ID da user story */
  storyId?: string;
  /** ID do status */
  statusId?: string;
  /** Título da tarefa */
  title?: string;
  /** Descrição da tarefa */
  description?: string;
  /** Prioridade */
  priority?: number;
  /** Horas estimadas */
  estimatedHours?: number;
  /** Horas reais */
  actualHours?: number;
  /** ID do responsável */
  assigneeId?: string;
  /** Data de vencimento */
  dueDate?: Date;
}
```

### 💬 Comment Types

```typescript
// apps/shared/src/types/comment.ts

/**
 * Comentário do sistema
 */
export interface Comment {
  /** ID único do comentário */
  id: string;
  /** ID da entidade comentada */
  entityId: string;
  /** Tipo da entidade */
  entityType: EntityType;
  /** ID do autor */
  authorId: string;
  /** Conteúdo do comentário */
  content: string;
  /** Data de criação */
  createdAt: Date;
  /** Data da última atualização */
  updatedAt: Date;
}

/**
 * Tipo de entidade comentável
 */
export type EntityType = "project" | "task" | "user_story" | "sprint";

/**
 * DTO para criação de comentário
 */
export interface CreateCommentDTO {
  /** ID da entidade comentada */
  entityId: string;
  /** Tipo da entidade */
  entityType: EntityType;
  /** ID do autor */
  authorId: string;
  /** Conteúdo do comentário */
  content: string;
}

/**
 * DTO para atualização de comentário
 */
export interface UpdateCommentDTO {
  /** Conteúdo do comentário */
  content: string;
}
```

### 📊 Activity Types

```typescript
// apps/shared/src/types/activity.ts

/**
 * Atividade do sistema
 */
export interface Activity {
  /** ID único da atividade */
  id: string;
  /** ID do usuário */
  userId: string;
  /** ID do tenant */
  tenantId: string;
  /** Ação realizada */
  action: string;
  /** Tipo da entidade */
  entityType: string;
  /** ID da entidade */
  entityId: string;
  /** Valores antigos (JSON) */
  oldValues?: any;
  /** Valores novos (JSON) */
  newValues?: any;
  /** Data de criação */
  createdAt: Date;
}

/**
 * DTO para criação de atividade
 */
export interface CreateActivityDTO {
  /** ID do usuário */
  userId: string;
  /** ID do tenant */
  tenantId: string;
  /** Ação realizada */
  action: string;
  /** Tipo da entidade */
  entityType: string;
  /** ID da entidade */
  entityId: string;
  /** Valores antigos */
  oldValues?: any;
  /** Valores novos */
  newValues?: any;
}
```

### 🔐 Session Types

```typescript
// apps/shared/src/types/session.ts

/**
 * Sessão do usuário
 */
export interface Session {
  /** ID único da sessão */
  id: string;
  /** ID do usuário */
  userId: string;
  /** Hash do token */
  tokenHash: string;
  /** Data de expiração */
  expiresAt: Date;
  /** Data de criação */
  createdAt: Date;
}

/**
 * DTO para criação de sessão
 */
export interface CreateSessionDTO {
  /** ID do usuário */
  userId: string;
  /** Hash do token */
  tokenHash: string;
  /** Data de expiração */
  expiresAt: Date;
}
```

## 🔧 Interfaces

### API Response

```typescript
/**
 * Resposta padrão da API
 */
export interface ApiResponse<T = any> {
  /** Indica se a operação foi bem-sucedida */
  success: boolean;
  /** Dados da resposta */
  data?: T;
  /** Mensagem de sucesso */
  message?: string;
  /** Mensagem de erro */
  error?: string;
}
```

### Pagination

```typescript
/**
 * Parâmetros de paginação
 */
export interface PaginationParams {
  /** Página atual */
  page?: number;
  /** Itens por página */
  limit?: number;
  /** Campo de ordenação */
  sortBy?: string;
  /** Direção da ordenação */
  sortOrder?: "asc" | "desc";
}

/**
 * Resposta paginada
 */
export interface PaginatedResponse<T> {
  /** Dados da página */
  data: T[];
  /** Informações de paginação */
  pagination: {
    /** Página atual */
    page: number;
    /** Itens por página */
    limit: number;
    /** Total de itens */
    total: number;
    /** Total de páginas */
    totalPages: number;
    /** Tem próxima página */
    hasNext: boolean;
    /** Tem página anterior */
    hasPrev: boolean;
  };
}
```

### Filters

```typescript
/**
 * Filtros comuns
 */
export interface CommonFilters {
  /** Termo de busca */
  search?: string;
  /** Status */
  status?: string;
  /** Data de início */
  startDate?: Date;
  /** Data de fim */
  endDate?: Date;
  /** IDs específicos */
  ids?: string[];
}

/**
 * Filtros de projeto
 */
export interface ProjectFilters extends CommonFilters {
  /** ID do tenant */
  tenantId?: string;
  /** ID do proprietário */
  ownerId?: string;
  /** Status do projeto */
  status?: ProjectStatus;
}

/**
 * Filtros de tarefa
 */
export interface TaskFilters extends CommonFilters {
  /** ID do projeto */
  projectId?: string;
  /** ID do responsável */
  assigneeId?: string;
  /** ID do reportador */
  reporterId?: string;
  /** Prioridade */
  priority?: number;
}
```

## 🛠️ Utilitários

### Type Guards

```typescript
// apps/shared/src/utils/index.ts

/**
 * Verifica se é um usuário válido
 */
export function isUser(obj: any): obj is User {
  return (
    obj &&
    typeof obj.id === "string" &&
    typeof obj.email === "string" &&
    typeof obj.name === "string"
  );
}

/**
 * Verifica se é um projeto válido
 */
export function isProject(obj: any): obj is Project {
  return (
    obj &&
    typeof obj.id === "string" &&
    typeof obj.name === "string" &&
    typeof obj.tenantId === "string"
  );
}

/**
 * Verifica se é uma resposta de API válida
 */
export function isApiResponse(obj: any): obj is ApiResponse {
  return obj && typeof obj.success === "boolean";
}
```

### Validation Helpers

```typescript
/**
 * Valida email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida slug
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9-]+$/;
  return slugRegex.test(slug) && !slug.startsWith("-") && !slug.endsWith("-");
}

/**
 * Valida project key
 */
export function isValidProjectKey(key: string): boolean {
  const keyRegex = /^[A-Z0-9]+$/;
  return keyRegex.test(key) && key.length >= 2 && key.length <= 10;
}
```

### Date Helpers

```typescript
/**
 * Formata data para exibição
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("pt-BR");
}

/**
 * Formata data e hora para exibição
 */
export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleString("pt-BR");
}

/**
 * Calcula diferença em dias
 */
export function daysBetween(start: Date, end: Date): number {
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
```

### String Helpers

```typescript
/**
 * Gera slug a partir de string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^a-z0-9\s-]/g, "") // Remove caracteres especiais
    .replace(/\s+/g, "-") // Substitui espaços por hífens
    .replace(/-+/g, "-") // Remove hífens consecutivos
    .replace(/^-+|-+$/g, ""); // Remove hífens no início e fim
}

/**
 * Gera project key a partir de string
 */
export function generateProjectKey(text: string): string {
  return text
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^A-Z0-9\s]/g, "") // Remove caracteres especiais
    .split(" ")
    .map((word) => word.slice(0, 3)) // Pega as 3 primeiras letras de cada palavra
    .join("")
    .slice(0, 10); // Máximo 10 caracteres
}

/**
 * Capitaliza primeira letra
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}
```

## 🚀 Instalação

### No Backend

```bash
# No diretório apps/server
bun add @packages/shared
```

### No Frontend

```bash
# No diretório apps/client
bun add @packages/shared
```

## 📖 Uso

### Importação de Tipos

```typescript
// Importar tipos específicos
import type { User, CreateUserDTO, UpdateUserDTO } from "@packages/shared";

// Importar interfaces
import type { ApiResponse, PaginationParams } from "@packages/shared";

// Importar utilitários
import { generateSlug, isValidEmail } from "@packages/shared";
```

### Uso no Backend

```typescript
// Controller
import type { CreateProjectDTO, ApiResponse, Project } from "@packages/shared";

export class ProjectController {
  async createProject(req: Request, res: Response) {
    const projectData: CreateProjectDTO = req.body;

    const result: ApiResponse<Project> =
      await this.projectService.createProject(projectData);

    return res.json(result);
  }
}
```

### Uso no Frontend

```typescript
// Service
import type { CreateProjectDTO, ApiResponse, Project } from "@packages/shared";

export const projectsApi = {
  create: async (data: CreateProjectDTO): Promise<ApiResponse<Project>> => {
    const response = await apiClient.post("/projects", data);
    return response.data;
  },
};

// Component
import type { Project } from "@packages/shared";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div>
      <h3>{project.name}</h3>
      <p>{project.description}</p>
    </div>
  );
}
```

## 🔧 Desenvolvimento

### Adicionando Novos Tipos

1. **Criar arquivo de tipos**

```typescript
// src/types/newEntity.ts
export interface NewEntity {
  id: string;
  name: string;
  // ...
}

export interface CreateNewEntityDTO {
  name: string;
  // ...
}
```

2. **Exportar no index**

```typescript
// src/index.ts
export * from "./types/newEntity";
```

3. **Atualizar documentação**

```typescript
/**
 * Nova entidade do sistema
 * @description Descrição da entidade
 */
export interface NewEntity {
  // ...
}
```

### Validação de Tipos

```bash
# Verificar tipos
bun run type-check

# Build do pacote
bun run build
```

### Testes

```bash
# Executar testes
bun run test

# Testes em modo watch
bun run test:watch
```

## 📚 Documentação

### JSDoc

Todos os tipos e interfaces são documentados com JSDoc:

````typescript
/**
 * Usuário do sistema
 * @description Representa um usuário autenticado no sistema
 * @example
 * ```typescript
 * const user: User = {
 *   id: "123",
 *   email: "user@example.com",
 *   name: "João Silva",
 *   isActive: true
 * };
 * ```
 */
export interface User {
  /** ID único do usuário */
  id: string;
  /** Email do usuário (único) */
  email: string;
  // ...
}
````

### Exemplos de Uso

```typescript
// Exemplo de criação de projeto
const projectData: CreateProjectDTO = {
  tenantId: "tenant-123",
  name: "Meu Projeto",
  slug: "meu-projeto",
  description: "Descrição do projeto",
  projectKey: "MP",
  ownerId: "user-123",
};

// Exemplo de resposta da API
const response: ApiResponse<Project> = {
  success: true,
  data: {
    id: "project-123",
    tenantId: "tenant-123",
    name: "Meu Projeto",
    // ...
  },
  message: "Projeto criado com sucesso",
};
```

## 🔄 Versionamento

### Semântico

O pacote segue versionamento semântico:

- **MAJOR**: Mudanças incompatíveis
- **MINOR**: Novas funcionalidades compatíveis
- **PATCH**: Correções de bugs compatíveis

### Changelog

```markdown
# Changelog

## [1.2.0] - 2024-01-15

### Added

- Novos tipos para comentários
- Utilitários de validação

### Changed

- Melhorada documentação dos tipos

## [1.1.0] - 2024-01-10

### Added

- Tipos para atividades
- Filtros de busca

## [1.0.0] - 2024-01-01

### Added

- Tipos básicos do sistema
- Interfaces de API
- Utilitários compartilhados
```

---

**📦 Pacote compartilhado robusto, fornecendo tipagem forte e consistência entre frontend e backend!**
