# 🚀 Sistema de Gerenciamento de Tarefas Ágeis

Um sistema completo de gerenciamento de projetos ágeis com arquitetura moderna, construído com TypeScript, React, Node.js e PostgreSQL.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura MVC](#arquitetura-mvc)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Boas Práticas Implementadas](#boas-práticas-implementadas)
- [Instalação](#instalação)
- [Uso](#uso)
- [API Documentation](#api-documentation)
- [Contribuição](#contribuição)

## 🎯 Visão Geral

Este projeto implementa um sistema completo de gerenciamento de tarefas ágeis com as seguintes funcionalidades:

- **Gestão de Projetos**: Criação, edição e acompanhamento de projetos
- **Sistema de Equipes**: Organização de equipes por projeto
- **Sprints**: Planejamento e execução de sprints ágeis
- **User Stories**: Criação e gestão de histórias de usuário
- **Tarefas**: Sistema completo de tarefas com status e prioridades
- **Epics**: Organização de funcionalidades em épicos
- **Sistema de Comentários**: Comunicação entre membros da equipe
- **Atividades**: Log de todas as atividades do sistema
- **Multi-tenancy**: Suporte a múltiplas empresas/tenants
- **Autenticação**: Sistema completo de login/registro

## 🏗️ Arquitetura MVC

### O que é MVC?

**MVC (Model-View-Controller)** é um padrão arquitetural que separa a aplicação em três componentes principais:

1. **Model (Modelo)**: Gerencia os dados e a lógica de negócio
2. **View (Visão)**: Responsável pela apresentação dos dados ao usuário
3. **Controller (Controlador)**: Recebe as requisições do usuário e coordena as ações

### Implementação MVC no Projeto

#### 🎯 Backend (Server)

```
apps/server/src/
├── controllers/     # Controllers (C) - Recebem requisições HTTP
├── services/        # Services (M) - Lógica de negócio
├── repositories/    # Repositories (M) - Acesso a dados
├── models/          # Models (M) - Definições de entidades
├── routes/          # Routes - Definição de endpoints
├── middlewares/     # Middlewares - Validação e autenticação
└── db/             # Database - Schema e conexão
```

**Controllers (C)**: Recebem requisições HTTP e delegam para os services

```typescript
// Exemplo: ProjectController.ts
export class ProjectController {
  async createProject(req: Request, res: Response) {
    // Recebe requisição HTTP
    const projectData = req.body;

    // Delega para o service
    const result = await this.projectService.createProject(projectData);

    // Retorna resposta
    return res.json(result);
  }
}
```

**Services (M)**: Contêm a lógica de negócio

```typescript
// Exemplo: ProjectService.ts
export class ProjectService {
  async createProject(data: CreateProjectDTO): Promise<ApiResponse<Project>> {
    // Validações de negócio
    // Regras de negócio
    // Orquestração de operações
    return await this.projectRepository.create(data);
  }
}
```

**Repositories (M)**: Acesso aos dados

```typescript
// Exemplo: ProjectRepository.ts
export class ProjectRepository {
  async create(data: CreateProjectDTO): Promise<Project> {
    // Operações diretas no banco de dados
    return await db.insert(projects).values(data).returning();
  }
}
```

#### 🎨 Frontend (Client)

```
apps/client/src/
├── components/      # Components (V) - Interface do usuário
├── pages/          # Pages (V) - Páginas da aplicação
├── services/       # Services (C) - Comunicação com API
├── contexts/       # Contexts (M) - Estado global
├── hooks/          # Hooks (C) - Lógica reutilizável
└── lib/           # Utils (M) - Utilitários
```

**Components (V)**: Interface do usuário

```typescript
// Exemplo: CreateProjectPage.tsx
export function CreateProjectPage() {
  // Renderiza interface
  return (
    <form onSubmit={handleSubmit}>
      <Input value={formData.name} />
      <Button type="submit">Criar Projeto</Button>
    </form>
  );
}
```

**Services (C)**: Comunicação com backend

```typescript
// Exemplo: projectsApi.ts
export const projectsApi = {
  create: async (data: CreateProjectDTO) => {
    // Comunicação com API
    return await apiClient.post("/projects", data);
  },
};
```

**Contexts (M)**: Estado global da aplicação

```typescript
// Exemplo: auth-context.tsx
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [tenant, setTenant] = useState(null);

  // Gerencia estado de autenticação
  return (
    <AuthContext.Provider value={{ user, tenant, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Vantagens da Arquitetura MVC

1. **Separação de Responsabilidades**: Cada camada tem uma responsabilidade específica
2. **Manutenibilidade**: Código organizado e fácil de manter
3. **Testabilidade**: Cada camada pode ser testada independentemente
4. **Reutilização**: Lógica de negócio pode ser reutilizada
5. **Escalabilidade**: Fácil adicionar novas funcionalidades

## 🛠️ Tecnologias

### Backend

- **Node.js** - Runtime JavaScript
- **TypeScript** - Linguagem tipada
- **Hono** - Framework web rápido
- **Drizzle ORM** - ORM moderno para TypeScript
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação baseada em tokens
- **bcrypt** - Criptografia de senhas

### Frontend

- **React 18** - Biblioteca para interfaces
- **TypeScript** - Linguagem tipada
- **Vite** - Build tool rápida
- **React Router** - Roteamento
- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn/ui** - Componentes UI
- **Framer Motion** - Animações
- **React Hook Form** - Gerenciamento de formulários

### DevOps

- **Docker** - Containerização
- **Docker Compose** - Orquestração de containers
- **Bun** - Runtime JavaScript rápido

## 📁 Estrutura do Projeto

```
ProjetoIntegrador6A_2/
├── apps/
│   ├── client/                 # Frontend React
│   │   ├── src/
│   │   │   ├── components/     # Componentes reutilizáveis
│   │   │   ├── pages/         # Páginas da aplicação
│   │   │   ├── services/      # APIs e comunicação
│   │   │   ├── contexts/      # Estado global
│   │   │   ├── hooks/         # Hooks customizados
│   │   │   └── lib/           # Utilitários
│   │   └── package.json
│   └── server/                 # Backend Node.js
│       ├── src/
│       │   ├── controllers/   # Controllers MVC
│       │   ├── services/      # Services MVC
│       │   ├── repositories/  # Repositories MVC
│       │   ├── models/        # Models MVC
│       │   ├── routes/        # Definição de rotas
│       │   ├── middlewares/   # Middlewares
│       │   └── db/           # Banco de dados
│       └── package.json
├── packages/
│   └── shared/                # Tipos compartilhados
│       └── src/
│           └── types/         # Definições TypeScript
├── infra/                     # Configurações de infraestrutura
│   └── docker/               # Dockerfiles
├── docker-compose.yml         # Orquestração Docker
└── package.json              # Workspace root
```

## ✨ Boas Práticas Implementadas

### 🎯 Backend

#### 1. **Arquitetura em Camadas**

- **Controllers**: Recebem requisições HTTP
- **Services**: Lógica de negócio
- **Repositories**: Acesso a dados
- **Models**: Definições de entidades

#### 2. **Padrão Repository**

```typescript
export class ProjectRepository {
  async create(data: CreateProjectDTO): Promise<Project> {
    return await db.insert(projects).values(data).returning();
  }

  async findById(id: string): Promise<Project | null> {
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id));
    return project || null;
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

#### 4. **Validação de Dados**

- Validação no frontend antes do envio
- Validação no backend com middlewares
- Tratamento de erros consistente

#### 5. **Logs Estruturados**

```typescript
console.log("🚀 ProjectController.createProject - Payload recebido:", payload);
console.log(
  "📤 ProjectController.createProject - Resposta do service:",
  result
);
```

#### 6. **Multi-tenancy**

- Suporte a múltiplas empresas
- Isolamento de dados por tenant
- Sistema de permissões

### 🎨 Frontend

#### 1. **Componentes Reutilizáveis**

```typescript
// Componente genérico de card
export function Card({ children, title, description }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{description}</p>
      {children}
    </div>
  );
}
```

#### 2. **Hooks Customizados**

```typescript
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
```

#### 3. **Gerenciamento de Estado**

- Context API para estado global
- useState para estado local
- Separação clara de responsabilidades

#### 4. **Tratamento de Erros**

```typescript
try {
  const response = await api.create(data);
  if (response.ok) {
    addToast({ type: "success", title: "Sucesso!" });
  } else {
    addToast({
      type: "error",
      title: "Erro",
      description: response.data.error,
    });
  }
} catch (error) {
  addToast({ type: "error", title: "Erro de conexão" });
}
```

#### 5. **Sistema de Toast**

- Notificações temporárias
- Diferentes tipos (success, error, warning)
- Auto-dismiss

#### 6. **Roteamento Organizado**

```typescript
// Rotas aninhadas para melhor organização
<Route path="/dashboard" element={<DashboardLayout />}>
  <Route path="projects" element={<ProjectsLayout />}>
    <Route index element={<AllProjects />} />
    <Route path="create" element={<CreateProject />} />
  </Route>
</Route>
```

### 🔒 Segurança

#### 1. **Autenticação JWT**

- Tokens com expiração
- Refresh tokens
- Sessões no banco de dados

#### 2. **Criptografia de Senhas**

```typescript
const hashedPassword = await bcrypt.hash(password, 12);
const isValid = await bcrypt.compare(password, hashedPassword);
```

#### 3. **Validação de Dados**

- Sanitização de inputs
- Validação de tipos
- Prevenção de SQL injection

#### 4. **CORS Configurado**

- Configuração específica para desenvolvimento
- Headers de segurança

### 📊 Banco de Dados

#### 1. **Schema Bem Definido**

```typescript
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  tenantId: uuid("tenant_id")
    .references(() => tenants.id)
    .notNull(),
  // ...
});
```

#### 2. **Relacionamentos**

- Foreign keys bem definidas
- Índices para performance
- Constraints de integridade

#### 3. **Migrations**

- Controle de versão do banco
- Rollback seguro
- Dados de seed

## 🚀 Instalação

### Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- Bun (opcional, mas recomendado)

### Passos

1. **Clone o repositório**

```bash
git clone <repository-url>
cd ProjetoIntegrador6A_2
```

2. **Configure as variáveis de ambiente**

```bash
cp env.example .env
# Edite o arquivo .env com suas configurações
```

3. **Inicie os containers**

```bash
docker-compose up -d
```

4. **Instale as dependências**

```bash
bun install
```

5. **Execute as migrations**

```bash
cd apps/server
bun run db:migrate
bun run db:seed
```

6. **Inicie o desenvolvimento**

```bash
# Terminal 1 - Backend
cd apps/server
bun run dev

# Terminal 2 - Frontend
cd apps/client
bun run dev
```

## 📖 Uso

### Primeiro Acesso

1. Acesse `http://localhost:5173`
2. Clique em "Cadastrar"
3. Preencha os dados da empresa e usuário
4. Faça login com as credenciais criadas

### Funcionalidades Principais

1. **Criar Projeto**

   - Nome, descrição e chave do projeto
   - Geração automática de slug
   - Associação com tenant

2. **Gerenciar Equipes**

   - Criar equipes
   - Adicionar membros
   - Definir roles

3. **Planejar Sprints**

   - Criar sprints
   - Definir duração
   - Adicionar user stories

4. **Criar User Stories**

   - Título e descrição
   - Critérios de aceitação
   - Story points

5. **Gerenciar Tarefas**
   - Criar tarefas
   - Definir prioridades
   - Atribuir responsáveis

## 📚 API Documentation

### Endpoints Principais

#### Autenticação

- `POST /api/auth/register` - Cadastro de usuário
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

#### Projetos

- `GET /api/projects` - Listar projetos
- `POST /api/projects` - Criar projeto
- `GET /api/projects/:id` - Buscar projeto
- `PUT /api/projects/:id` - Atualizar projeto
- `DELETE /api/projects/:id` - Deletar projeto

#### Equipes

- `GET /api/teams` - Listar equipes
- `POST /api/teams` - Criar equipe
- `GET /api/teams/:id` - Buscar equipe

#### Sprints

- `GET /api/sprints` - Listar sprints
- `POST /api/sprints` - Criar sprint
- `GET /api/sprints/:id` - Buscar sprint

#### User Stories

- `GET /api/user-stories` - Listar user stories
- `POST /api/user-stories` - Criar user story
- `GET /api/user-stories/:id` - Buscar user story

#### Tarefas

- `GET /api/tasks` - Listar tarefas
- `POST /api/tasks` - Criar tarefa
- `GET /api/tasks/:id` - Buscar tarefa

### Exemplo de Uso

```typescript
// Criar projeto
const project = await projectsApi.create({
  name: "Meu Projeto",
  slug: "meu-projeto",
  description: "Descrição do projeto",
  projectKey: "MP",
  tenantId: "tenant-id",
  ownerId: "user-id",
});

// Listar projetos
const projects = await projectsApi.getAll();
```

## 🤝 Contribuição

### Padrões de Código

1. **TypeScript**: Use tipagem forte
2. **ESLint**: Siga as regras de linting
3. **Prettier**: Formatação consistente
4. **Commits**: Use conventional commits

### Estrutura de Commits

```
feat: adiciona funcionalidade de criar projeto
fix: corrige erro de validação no formulário
docs: atualiza documentação da API
style: formata código com prettier
refactor: refatora service de projetos
test: adiciona testes para user stories
```

### Processo de Desenvolvimento

1. Crie uma branch para sua feature
2. Implemente as mudanças seguindo os padrões
3. Adicione testes quando necessário
4. Faça commit seguindo conventional commits
5. Abra um Pull Request
6. Aguarde review e merge

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Equipe

- **Desenvolvedor**: Anderson
- **Projeto**: Sistema de Gerenciamento de Tarefas Ágeis
- **Versão**: 1.0.0

---

**⭐ Se este projeto foi útil, considere dar uma estrela!**
