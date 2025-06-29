# Pacote Shared - Projeto Integrador 6A

Pacote compartilhado contendo **tipos**, **schemas de validação** e **utilitários** reutilizáveis entre frontend e backend.

## 🎯 Objetivo

O pacote `shared` é o **coração da reutilização** no projeto, garantindo:

- **Consistência** de tipos entre frontend e backend
- **Reutilização** de schemas de validação
- **Manutenibilidade** com código centralizado
- **Type Safety** em toda a aplicação
- **Zero duplicação** de código

## 📁 Estrutura

```
packages/shared/
├── src/
│   ├── types/          # Interfaces e DTOs
│   │   ├── user.ts     # Tipos relacionados a usuários
│   │   └── task.ts     # Tipos relacionados a tasks
│   ├── utils/          # Funções utilitárias
│   │   └── index.ts    # Utilitários gerais
│   └── index.ts        # Ponto de entrada (exports)
├── package.json        # Configuração do pacote
└── tsconfig.json       # Configuração TypeScript
```

## 🔧 Configuração

### package.json

```json
{
  "name": "@packages/shared",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  }
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "declaration": true,
    "declarationMap": true
  }
}
```

## 📊 Tipos Compartilhados

### Interfaces de Usuário

```typescript
// src/types/user.ts
export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDTO {
  name: string;
  email: string;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
}
```

### Interfaces de Task

```typescript
// src/types/task.ts
export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  userId: number;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  completed?: boolean;
}
```

### Respostas Padronizadas

```typescript
// src/index.ts
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

## ✅ Schemas de Validação

### Schemas Zod

```typescript
// src/types/user.ts
export const CreateUserSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
});

export const UpdateUserSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").optional(),
  email: z.string().email("Email inválido").optional(),
});

// src/types/task.ts
export const CreateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .max(200, "Título muito longo"),
  description: z.string().max(1000, "Descrição muito longa").optional(),
  userId: z.number().int().positive("ID do usuário deve ser positivo"),
});

export const UpdateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .max(200, "Título muito longo")
    .optional(),
  description: z.string().max(1000, "Descrição muito longa").optional(),
  completed: z.boolean().optional(),
});
```

## 🛠️ Utilitários

### Formatação

```typescript
// src/utils/index.ts
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
```

### Validação

```typescript
// src/utils/index.ts
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidCPF(cpf: string): boolean {
  const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  return cpfRegex.test(cpf);
}
```

## 🔄 Uso no Backend

### Importação de Tipos

```typescript
// apps/server/src/controllers/userController.ts
import {
  User,
  CreateUserDTO,
  UpdateUserDTO,
  ApiResponse,
} from "@packages/shared";
import { CreateUserSchema, UpdateUserSchema } from "@packages/shared";
```

### Validação com Schemas

```typescript
// apps/server/src/controllers/userController.ts
export async function createUser(c: Context): Promise<Response> {
  const body = await c.req.json();

  const validation = validateData(CreateUserSchema, body);
  if (!validation.success) {
    return c.json({ success: false, error: validation.error }, 400);
  }

  const userData: CreateUserDTO = validation.data;
  // ... resto da lógica
}
```

### Repository com Tipos

```typescript
// apps/server/src/repositories/UserRepository.ts
import { User, CreateUserDTO, UpdateUserDTO } from "@packages/shared";

export class UserRepository {
  async create(data: CreateUserDTO): Promise<User> {
    // ... implementação
  }

  async update(id: number, data: UpdateUserDTO): Promise<User | null> {
    // ... implementação
  }
}
```

## 🔄 Uso no Frontend

### Importação de Tipos

```typescript
// apps/client/src/services/api.ts
import {
  User,
  CreateUserDTO,
  UpdateUserDTO,
  Task,
  CreateTaskDTO,
  ApiResponse,
} from "@packages/shared";
```

### Uso em Componentes

```typescript
// apps/client/src/components/UserList.tsx
import { User, formatDate } from "@packages/shared";

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);

  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <small>Criado em: {formatDate(user.createdAt)}</small>
        </div>
      ))}
    </div>
  );
}
```

### Cliente API Tipado

```typescript
// apps/client/src/services/api.ts
import { User, CreateUserDTO, Task, CreateTaskDTO } from "@packages/shared";

class ApiClient {
  async getUsers(): Promise<User[]> {
    const response = await fetch("/api/users");
    return response.json();
  }

  async createUser(data: CreateUserDTO): Promise<User> {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async getTasks(): Promise<Task[]> {
    const response = await fetch("/api/tasks");
    return response.json();
  }

  async createTask(data: CreateTaskDTO): Promise<Task> {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  }
}
```

## 🏗️ Build e Deploy

### Build do Pacote

```bash
# Na raiz do projeto
bun run build:shared

# Ou no diretório do pacote
cd packages/shared
bun run build
```

### Watch Mode (Desenvolvimento)

```bash
# Rebuild automático em mudanças
cd packages/shared
bun run dev
```

### Estrutura de Build

```
packages/shared/dist/
├── index.js          # Código compilado
├── index.d.ts        # Declarações de tipos
├── types/
│   ├── user.d.ts     # Tipos compilados
│   └── task.d.ts     # Tipos compilados
└── utils/
    └── index.d.ts    # Utilitários compilados
```

## 📦 Instalação e Configuração

### Workspace Configuration

```json
// package.json (raiz)
{
  "workspaces": ["apps/*", "packages/*"]
}
```

### Dependências

```json
// apps/server/package.json e apps/client/package.json
{
  "dependencies": {
    "@packages/shared": "workspace:*"
  }
}
```

## 🔍 Vantagens

### 1. **Type Safety**

- Tipos consistentes entre frontend e backend
- Detecção de erros em tempo de compilação
- IntelliSense melhorado

### 2. **Reutilização**

- Schemas de validação compartilhados
- Utilitários comuns
- Constantes centralizadas

### 3. **Manutenibilidade**

- Mudanças centralizadas
- Menos duplicação de código
- Versionamento único

### 4. **Consistência**

- Respostas padronizadas
- Validação uniforme
- Formatação consistente

### 5. **Desenvolvimento Rápido**

- Zero duplicação de tipos
- Validação automática
- Refatoração segura

## 🚀 Fluxo de Desenvolvimento

### 1. Definir Tipo no Shared

```typescript
// packages/shared/src/types/product.ts
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}
```

### 2. Criar Schema no Shared

```typescript
// packages/shared/src/types/product.ts
export const CreateProductSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  price: z.number().positive("Preço deve ser positivo"),
  category: z.string().min(1, "Categoria é obrigatória"),
});
```

### 3. Usar no Backend

```typescript
// apps/server/src/models/Product.ts
export * from "@packages/shared";

// apps/server/src/repositories/ProductRepository.ts
import { Product, CreateProductDTO } from "@packages/shared";

// apps/server/src/controllers/productController.ts
- Formatação de produtos
- Cálculos de preços
- Validação de estoque

## 📚 Dependências

- **TypeScript** - Tipagem estática
- **Zod** - Validação de esquemas
- **Bun** - Runtime e package manager
```
