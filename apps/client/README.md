# 🎨 Frontend - Sistema de Gerenciamento de Tarefas Ágeis

Interface moderna e responsiva construída com React, TypeScript e arquitetura MVC para o sistema de gerenciamento de tarefas ágeis.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura MVC Frontend](#arquitetura-mvc-frontend)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Boas Práticas](#boas-práticas)
- [Instalação](#instalação)
- [Desenvolvimento](#desenvolvimento)
- [Componentes](#componentes)
- [Roteamento](#roteamento)
- [Estado Global](#estado-global)

## 🎯 Visão Geral

O frontend implementa uma interface moderna e intuitiva com arquitetura MVC adaptada para React, oferecendo:

- **Interface Responsiva**: Design adaptável para desktop e mobile
- **Sistema de Autenticação**: Login/registro com multi-tenancy
- **Dashboard Interativo**: Visão geral de projetos e atividades
- **Gestão de Projetos**: CRUD completo com validações
- **Sistema de Equipes**: Organização visual de equipes
- **Sprints Ágeis**: Interface para planejamento de sprints
- **User Stories**: Criação e gestão de histórias
- **Tarefas**: Sistema completo de tasks com drag & drop
- **Sistema de Notificações**: Toasts e feedback visual
- **Tema Escuro/Claro**: Suporte a múltiplos temas

## 🏗️ Arquitetura MVC Frontend

### Adaptação MVC para React

O frontend adapta o padrão MVC para o ecossistema React:

```
src/
├── components/      # Components (V) - Interface do usuário
├── pages/          # Pages (V) - Páginas da aplicação
├── services/       # Services (C) - Comunicação com API
├── contexts/       # Contexts (M) - Estado global
├── hooks/          # Hooks (C) - Lógica reutilizável
├── lib/           # Utils (M) - Utilitários
└── types/         # Types (M) - Definições TypeScript
```

### 🎨 Components (V) - Camada de Visualização

**Responsabilidade**: Renderizar interface do usuário e capturar interações.

```typescript
// Exemplo: CreateProjectPage.tsx
export function CreateProjectPage() {
  const { addToast } = useToast();
  const { user: currentUser, tenant: currentTenant } = useAuth();
  const [formData, setFormData] = useState<CreateProjectDTO>({
    name: "",
    slug: "",
    description: "",
    projectKey: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação no frontend
    const validation = validateForm();
    if (!validation.isValid) {
      addToast({
        title: "Dados inválidos",
        description: validation.errors.join(". "),
        type: "error",
      });
      return;
    }

    // Delega para o service
    const res = await projectsApi.create({
      ...formData,
      tenantId: currentTenant.id,
      ownerId: currentUser.id,
    });

    // Trata resposta
    if (res.ok && res.data.success) {
      addToast({
        title: "Projeto criado",
        description: "O projeto foi criado com sucesso!",
        type: "success",
      });
      navigate("/dashboard/projects");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input value={formData.name} onChange={handleInputChange} />
      <Button type="submit">Criar Projeto</Button>
    </form>
  );
}
```

**Características**:

- Renderização da interface
- Captura de interações do usuário
- Validação de formulários
- Feedback visual
- Navegação

### 🔧 Services (C) - Camada de Controle

**Responsabilidade**: Comunicação com API, transformação de dados e orquestração de operações.

```typescript
// Exemplo: projectsApi.ts
export const projectsApi = {
  getAll: async () => {
    const response = await apiClient.get<ApiResponse<Project[]>>("/projects");
    return response;
  },

  create: async (data: CreateProjectDTO) => {
    console.log("📤 projectsApi.create - Enviando dados:", data);

    const response = await apiClient.post<ApiResponse<Project>>(
      "/projects",
      data
    );

    console.log("📥 projectsApi.create - Resposta recebida:", {
      status: response.status,
      ok: response.ok,
      data: response.data,
    });

    return response;
  },

  update: async (id: string | number, data: UpdateProjectDTO) => {
    const response = await apiClient.put<ApiResponse<Project>>(
      `/projects/${id}`,
      data
    );
    return response;
  },

  delete: async (id: string | number) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/projects/${id}`
    );
    return response;
  },
};
```

**Características**:

- Comunicação HTTP com backend
- Transformação de dados
- Tratamento de erros de rede
- Logs de debug
- Interface consistente

### 🧠 Contexts (M) - Camada de Modelo

**Responsabilidade**: Gerenciar estado global da aplicação e lógica de negócio.

```typescript
// Exemplo: auth-context.tsx
interface AuthContextType {
  user: User | null;
  tenant: Tenant | null;
  isAuthenticated: boolean;
  login: (userData: User, tenantData?: Tenant) => void;
  logout: () => void;
  isLoading: boolean;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Carregar dados de autenticação do localStorage
    const savedUser = localStorage.getItem("user");
    const savedTenant = localStorage.getItem("tenant");
    const token = localStorage.getItem("token");

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
      if (savedTenant) {
        setTenant(JSON.parse(savedTenant));
      }
    }

    setIsLoading(false);
  }, []);

  const login = (userData: User, tenantData?: Tenant) => {
    setUser(userData);
    if (tenantData) {
      setTenant(tenantData);
    }
  };

  const logout = () => {
    setUser(null);
    setTenant(null);
    localStorage.removeItem("user");
    localStorage.removeItem("tenant");
    localStorage.removeItem("token");
    localStorage.removeItem("sessionId");
  };

  const isAuthenticated = !!user && !!localStorage.getItem("token");

  return (
    <AuthContext.Provider
      value={{
        user,
        tenant,
        isAuthenticated,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
```

**Características**:

- Estado global da aplicação
- Persistência de dados
- Lógica de negócio
- Gerenciamento de sessão
- Isolamento de responsabilidades

### 🎣 Hooks (C) - Lógica Reutilizável

**Responsabilidade**: Encapsular lógica reutilizável e customizar comportamento de componentes.

```typescript
// Exemplo: use-mobile.ts
export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

// Exemplo: use-debounce.ts
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

## 🛠️ Tecnologias

### Core

- **React 18** - Biblioteca para interfaces
- **TypeScript 5+** - Linguagem tipada
- **Vite** - Build tool rápida
- **React Router 6** - Roteamento

### UI/UX

- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn/ui** - Componentes UI modernos
- **Framer Motion** - Animações fluidas
- **Lucide React** - Ícones consistentes

### Formulários e Validação

- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de esquemas
- **@hookform/resolvers** - Integração React Hook Form + Zod

### Estado e Comunicação

- **Context API** - Estado global
- **React Query** - Cache e sincronização de dados
- **Axios** - Cliente HTTP

### Desenvolvimento

- **ESLint** - Linting de código
- **Prettier** - Formatação de código
- **TypeScript** - Verificação de tipos

## 📁 Estrutura do Projeto

```
src/
├── components/              # Componentes reutilizáveis
│   ├── auth/               # Componentes de autenticação
│   │   ├── LoginDialog.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── UserButton.tsx
│   ├── common/             # Componentes comuns
│   │   ├── BlurText.tsx
│   │   ├── LoadingPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── forms/              # Componentes de formulário
│   ├── layout/             # Componentes de layout
│   │   ├── app-sidebar.tsx
│   │   ├── DynamicBreadcrumb.tsx
│   │   ├── nav-main.tsx
│   │   ├── nav-projects.tsx
│   │   ├── nav-secondary.tsx
│   │   ├── theme-switcher.tsx
│   │   └── workspace-switcher.tsx
│   ├── pages/              # Componentes de página
│   │   ├── dashboard/
│   │   ├── landing/
│   │   │   ├── CTASection.tsx
│   │   │   ├── DashboardPreview.tsx
│   │   │   ├── FeaturesSection.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── MetricsSection.tsx
│   │   │   └── Navbar.tsx
│   └── ui/                 # Componentes UI base
│       ├── alert-dialog.tsx
│       ├── animated-circular-progress-bar.tsx
│       ├── aurora-text.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── breadcrumb.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── chart.tsx
│       ├── collapsible.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── icons.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── navigation-menu.tsx
│       ├── progress.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── sidebar.tsx
│       ├── skeleton.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       └── tooltip.tsx
├── contexts/               # Contextos (Estado global)
│   ├── auth-context.tsx    # Contexto de autenticação
│   ├── theme-context.tsx   # Contexto de tema
│   └── toast-context.tsx   # Contexto de notificações
├── hooks/                  # Hooks customizados
│   └── use-mobile.ts       # Hook para detectar mobile
├── lib/                    # Utilitários
│   ├── constants.ts        # Constantes da aplicação
│   └── utils.ts            # Funções utilitárias
├── pages/                  # Páginas da aplicação
│   ├── admin/              # Páginas administrativas
│   │   └── index.tsx
│   ├── analytics/          # Páginas de analytics
│   │   ├── index.tsx
│   │   ├── metrics.tsx
│   │   └── reports.tsx
│   ├── dashboard/          # Páginas do dashboard
│   │   ├── DashboardHome.tsx
│   │   └── index.tsx
│   ├── epics/              # Páginas de épicos
│   │   ├── board.tsx
│   │   ├── index.tsx
│   │   └── timeline.tsx
│   ├── feedback/           # Páginas de feedback
│   │   └── index.tsx
│   ├── LandingPage/        # Página inicial
│   │   └── index.tsx
│   ├── projects/           # Páginas de projetos
│   │   ├── all-project.tsx
│   │   ├── create-project.tsx
│   │   └── index.tsx
│   ├── settings/           # Páginas de configurações
│   │   ├── billing.tsx
│   │   ├── general.tsx
│   │   ├── index.tsx
│   │   ├── limits.tsx
│   │   └── team.tsx
│   ├── sprints/            # Páginas de sprints
│   │   ├── current.tsx
│   │   ├── index.tsx
│   │   └── planning.tsx
│   ├── support/            # Páginas de suporte
│   │   └── index.tsx
│   ├── teams/              # Páginas de equipes
│   │   ├── index.tsx
│   │   ├── members.tsx
│   │   ├── permissions.tsx
│   │   └── roles.tsx
│   ├── user-stories/       # Páginas de user stories
│   │   ├── backlog.tsx
│   │   ├── index.tsx
│   │   └── templates.tsx
├── services/               # Serviços de API
│   ├── apiClient.ts        # Cliente HTTP base
│   └── domains/            # APIs por domínio
│       ├── projectsApi.ts
│       ├── teamsApi.ts
│       ├── sprintsApi.ts
│       ├── userStoriesApi.ts
│       ├── tasksApi.ts
│       ├── usersApi.ts
│       ├── tenantsApi.ts
│       ├── commentsApi.ts
│       ├── activitiesApi.ts
│       └── authApi.ts
├── App.tsx                 # Componente principal
├── main.tsx                # Ponto de entrada
├── globals.css             # Estilos globais
└── env.d.ts                # Definições de ambiente
```

## ✨ Boas Práticas Implementadas

### 🎯 Arquitetura

#### 1. **Separação de Responsabilidades**

- **Components**: Apenas renderização e interação
- **Services**: Comunicação com API
- **Contexts**: Estado global e lógica de negócio
- **Hooks**: Lógica reutilizável

#### 2. **Componentes Reutilizáveis**

```typescript
// Componente genérico de card
export function Card({
  children,
  title,
  description,
  className = "",
}: CardProps) {
  return (
    <div className={`card ${className}`}>
      {title && <h3 className="card-title">{title}</h3>}
      {description && <p className="card-description">{description}</p>}
      <div className="card-content">{children}</div>
    </div>
  );
}
```

#### 3. **Hooks Customizados**

```typescript
// Hook para autenticação
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Hook para notificações
export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
```

### 🔒 Segurança

#### 1. **Validação de Formulários**

```typescript
const validateForm = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!formData.name.trim()) {
    errors.push("Nome do projeto é obrigatório");
  }

  if (!/^[A-Z0-9]+$/.test(formData.projectKey)) {
    errors.push(
      "Chave do projeto deve conter apenas letras maiúsculas e números"
    );
  }

  return { isValid: errors.length === 0, errors };
};
```

#### 2. **Proteção de Rotas**

```typescript
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
```

#### 3. **Sanitização de Dados**

```typescript
// Geração segura de slug
const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^a-z0-9\s-]/g, "") // Remove caracteres especiais
    .replace(/\s+/g, "-") // Substitui espaços por hífens
    .replace(/-+/g, "-") // Remove hífens consecutivos
    .replace(/^-+|-+$/g, ""); // Remove hífens no início e fim
};
```

### 🎨 UX/UI

#### 1. **Sistema de Toast**

```typescript
// Notificações temporárias
addToast({
  title: "Sucesso",
  description: "Operação realizada com sucesso!",
  type: "success",
});

addToast({
  title: "Erro",
  description: "Ocorreu um erro na operação.",
  type: "error",
});
```

#### 2. **Loading States**

```typescript
const [loading, setLoading] = useState(false);

// Durante operação
setLoading(true);
try {
  await api.create(data);
} finally {
  setLoading(false);
}

// No JSX
<Button disabled={loading}>{loading ? "Criando..." : "Criar Projeto"}</Button>;
```

#### 3. **Responsividade**

```typescript
// Hook para detectar mobile
export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}
```

### 📱 Performance

#### 1. **Lazy Loading**

```typescript
// Carregamento sob demanda
const Dashboard = lazy(() => import("./pages/dashboard"));
const Projects = lazy(() => import("./pages/projects"));

// Suspense para loading
<Suspense fallback={<LoadingPage />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/projects" element={<Projects />} />
  </Routes>
</Suspense>;
```

#### 2. **Memoização**

```typescript
// Memoização de componentes
export const ProjectCard = memo(({ project }: ProjectCardProps) => {
  return (
    <Card>
      <h3>{project.name}</h3>
      <p>{project.description}</p>
    </Card>
  );
});

// Memoização de valores
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);
```

#### 3. **Debounce**

```typescript
// Debounce para inputs
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

## 🚀 Instalação

### Pré-requisitos

- Node.js 18+
- Bun (recomendado) ou npm

### Passos

1. **Instalar dependências**

```bash
bun install
```

2. **Configurar variáveis de ambiente**

```bash
# Criar .env.local se necessário
VITE_API_URL=http://localhost:8080
```

3. **Iniciar desenvolvimento**

```bash
bun run dev
```

## 🔧 Desenvolvimento

### Scripts Disponíveis

```bash
# Desenvolvimento
bun run dev          # Inicia servidor de desenvolvimento
bun run build        # Compila para produção
bun run preview      # Preview da build

# Linting
bun run lint         # Executa ESLint
bun run lint:fix     # Corrige problemas de linting

# Type checking
bun run type-check   # Verifica tipos TypeScript
```

### Estrutura de Desenvolvimento

1. **Novo Componente**

   ```typescript
   // 1. Criar componente
   export function NewComponent({ prop }: NewComponentProps) {
     return <div>{prop}</div>;
   }

   // 2. Adicionar tipos
   interface NewComponentProps {
     prop: string;
   }

   // 3. Exportar
   export { NewComponent };
   ```

2. **Nova Página**

   ```typescript
   // 1. Criar página
   export function NewPage() {
     return (
       <div>
         <h1>Nova Página</h1>
       </div>
     );
   }

   // 2. Adicionar rota
   <Route path="/new-page" element={<NewPage />} />;
   ```

3. **Novo Service**

   ```typescript
   // 1. Criar API
   export const newApi = {
     getAll: async () => {
       return await apiClient.get("/new-endpoint");
     },
   };

   // 2. Usar no componente
   const { data } = await newApi.getAll();
   ```

## 🎨 Componentes

### Componentes Base (UI)

- **Button**: Botões com variantes e estados
- **Input**: Campos de entrada com validação
- **Card**: Containers para conteúdo
- **Dialog**: Modais e popups
- **Table**: Tabelas de dados
- **Form**: Formulários com validação

### Componentes de Layout

- **AppSidebar**: Sidebar principal
- **NavigationMenu**: Menu de navegação
- **Breadcrumb**: Navegação hierárquica
- **ThemeSwitcher**: Alternador de tema

### Componentes de Página

- **DashboardHome**: Página inicial do dashboard
- **CreateProject**: Formulário de criação de projeto
- **AllProjects**: Lista de projetos
- **ProjectBoard**: Quadro de projeto

## 🛣️ Roteamento

### Estrutura de Rotas

```typescript
<Routes>
  {/* Página inicial */}
  <Route path="/" element={<LandingPage />} />

  {/* Dashboard protegido */}
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<DashboardHome />} />

    {/* Projetos */}
    <Route path="projects" element={<ProjectsLayout />}>
      <Route index element={<AllProjects />} />
      <Route path="create" element={<CreateProject />} />
    </Route>

    {/* Equipes */}
    <Route path="teams" element={<TeamsLayout />}>
      <Route index element={<AllTeams />} />
      <Route path="create" element={<CreateTeam />} />
    </Route>

    {/* Sprints */}
    <Route path="sprints" element={<SprintsLayout />}>
      <Route index element={<AllSprints />} />
      <Route path="create" element={<CreateSprint />} />
    </Route>

    {/* User Stories */}
    <Route path="user-stories" element={<UserStoriesLayout />}>
      <Route index element={<AllUserStories />} />
      <Route path="create" element={<CreateUserStory />} />
    </Route>

    {/* Tarefas */}
    <Route path="tasks" element={<TasksLayout />}>
      <Route index element={<AllTasks />} />
      <Route path="create" element={<CreateTask />} />
    </Route>

    {/* Configurações */}
    <Route path="settings" element={<SettingsLayout />}>
      <Route index element={<GeneralSettings />} />
      <Route path="team" element={<TeamSettings />} />
      <Route path="billing" element={<BillingSettings />} />
    </Route>
  </Route>

  {/* Páginas de erro */}
  <Route path="*" element={<NotFoundPage />} />
</Routes>
```

### Proteção de Rotas

```typescript
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
```

## 🧠 Estado Global

### Contextos Principais

#### 1. **AuthContext**

```typescript
interface AuthContextType {
  user: User | null;
  tenant: Tenant | null;
  isAuthenticated: boolean;
  login: (userData: User, tenantData?: Tenant) => void;
  logout: () => void;
  isLoading: boolean;
}
```

#### 2. **ThemeContext**

```typescript
interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}
```

#### 3. **ToastContext**

```typescript
interface ToastContextType {
  addToast: (toast: Toast) => void;
  removeToast: (id: string) => void;
}
```

### Persistência de Estado

```typescript
// Carregar do localStorage
useEffect(() => {
  const savedUser = localStorage.getItem("user");
  const savedTenant = localStorage.getItem("tenant");

  if (savedUser) {
    setUser(JSON.parse(savedUser));
  }

  if (savedTenant) {
    setTenant(JSON.parse(savedTenant));
  }
}, []);

// Salvar no localStorage
const login = (userData: User, tenantData?: Tenant) => {
  setUser(userData);
  localStorage.setItem("user", JSON.stringify(userData));

  if (tenantData) {
    setTenant(tenantData);
    localStorage.setItem("tenant", JSON.stringify(tenantData));
  }
};
```

## 📱 Responsividade

### Breakpoints

```css
/* Tailwind CSS breakpoints */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

### Componentes Responsivos

```typescript
// Sidebar responsiva
export function AppSidebar() {
  const isMobile = useMobile();

  if (isMobile) {
    return <MobileSidebar />;
  }

  return <DesktopSidebar />;
}

// Grid responsivo
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {projects.map((project) => (
    <ProjectCard key={project.id} project={project} />
  ))}
</div>;
```

## 🎨 Temas

### Sistema de Temas

```typescript
// Theme provider
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme}>{children}</div>
    </ThemeContext.Provider>
  );
}
```

### Variáveis CSS

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  /* ... */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  /* ... */
}
```

## 🧪 Testes

### Estrutura de Testes

```
__tests__/
├── components/      # Testes de componentes
├── pages/          # Testes de páginas
├── hooks/          # Testes de hooks
├── services/       # Testes de serviços
└── utils/          # Testes de utilitários
```

### Exemplo de Teste

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { CreateProjectPage } from "../CreateProjectPage";

describe("CreateProjectPage", () => {
  it("should create project successfully", async () => {
    render(<CreateProjectPage />);

    fireEvent.change(screen.getByLabelText("Nome do Projeto"), {
      target: { value: "Meu Projeto" },
    });

    fireEvent.click(screen.getByText("Criar Projeto"));

    expect(await screen.findByText("Projeto criado")).toBeInTheDocument();
  });
});
```

## 📊 Performance

### Otimizações Implementadas

1. **Code Splitting**

   - Lazy loading de páginas
   - Bundle splitting por rota

2. **Memoização**

   - React.memo para componentes
   - useMemo para valores computados
   - useCallback para funções

3. **Virtualização**

   - Listas grandes com virtualização
   - Paginação de dados

4. **Cache**
   - Cache de requisições HTTP
   - Persistência de estado

## 🔄 Deploy

### Build de Produção

```bash
# Build
bun run build

# Preview
bun run preview
```

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 5173
CMD ["npm", "run", "preview"]
```

### Variáveis de Ambiente

```env
# API
VITE_API_URL=http://localhost:8080

# Build
VITE_APP_NAME=Sistema de Gerenciamento
VITE_APP_VERSION=1.0.0
```

---

**🎨 Frontend moderno com arquitetura MVC bem estruturada, oferecendo excelente experiência do usuário!**
