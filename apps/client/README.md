# Cliente - Projeto Integrador 6A

Frontend desenvolvido com **React**, **Vite**, **Tailwind CSS** e **shadcn/ui**, integrado com o backend via API REST.

## 🏗️ Arquitetura

### Estrutura de Pastas

```
src/
├── components/     # Componentes React
│   ├── ui/        # Componentes shadcn/ui
│   └── UserList.tsx # Componente de exemplo
├── services/      # Cliente HTTP para API
│   └── api.ts     # Configuração e métodos da API
├── lib/           # Utilitários
│   └── utils.ts   # Funções helper
├── App.tsx        # Componente principal
├── main.tsx       # Ponto de entrada
└── index.css      # Estilos globais
```

### Integração com API

#### 1. **Services** (`src/services/`)

- Cliente HTTP configurado para comunicação com backend
- Métodos para cada endpoint da API
- Tratamento de erros padronizado
- Tipos importados do pacote `shared`

#### 2. **Tipos Compartilhados**

- Interfaces e DTOs importados do `packages/shared`
- Garantia de consistência entre frontend e backend
- Validação de dados com Zod schemas

#### 3. **Componentes**

- Componentes React reutilizáveis
- Integração com shadcn/ui para UI moderna
- Estados gerenciados localmente ou via Context (futuro)

## 🚀 Como Executar

### Desenvolvimento Local

```bash
# Instalar dependências
bun install

# Executar em desenvolvimento
bun run dev

# Ou via Makefile (raiz do projeto)
make dev
```

### Scripts Disponíveis

```bash
bun run dev        # Desenvolvimento com hot reload
bun run build      # Build para produção
bun run preview    # Preview da build
```

## 🔧 Configuração

### Variáveis de Ambiente

```env
# API
VITE_API_URL=http://localhost:3001

# Desenvolvimento
CLIENT_PORT=5190
```

### Configuração do Vite

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    port: 5190,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
```

## 📊 Integração com API

### Cliente HTTP

```typescript
// src/services/api.ts
import { User, CreateUserRequest, UpdateUserRequest } from "@shared/types";

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || "http://localhost:3001";
  }

  // Usuários
  async getUsers(): Promise<User[]> {
    const response = await fetch(`${this.baseURL}/api/users`);
    return response.json();
  }

  async getUser(id: number): Promise<User> {
    const response = await fetch(`${this.baseURL}/api/users/${id}`);
    return response.json();
  }

  async createUser(data: CreateUserRequest): Promise<User> {
    const response = await fetch(`${this.baseURL}/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async updateUser(id: number, data: UpdateUserRequest): Promise<User> {
    const response = await fetch(`${this.baseURL}/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async deleteUser(id: number): Promise<void> {
    await fetch(`${this.baseURL}/api/users/${id}`, {
      method: "DELETE",
    });
  }
}

export const api = new ApiClient();
```

### Uso em Componentes

```typescript
// src/components/UserList.tsx
import { useState, useEffect } from "react";
import { User } from "@shared/types";
import { api } from "../services/api";

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    } finally {
      setLoading(false);
    }
  }

  // ... resto do componente
}
```

## 🎨 UI e Componentes

### shadcn/ui

- Componentes modernos e acessíveis
- Integração com Tailwind CSS
- Tema customizável
- Componentes: Button, Card, Input, Label, etc.

### Tailwind CSS

- Framework CSS utilitário
- Classes responsivas
- Customização via `tailwind.config.js`

### Estrutura de Componentes

```typescript
// Componente de exemplo
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { User } from "@shared/types";

interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (id: number) => void;
}

export function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{user.email}</p>
        <div className="flex gap-2 mt-4">
          {onEdit && <Button onClick={() => onEdit(user)}>Editar</Button>}
          {onDelete && (
            <Button variant="destructive" onClick={() => onDelete(user.id)}>
              Deletar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

## 🔄 Estado e Gerenciamento

### Estado Local

- `useState` para estado simples
- `useEffect` para efeitos colaterais
- Estados de loading e erro

### Futuras Implementações

- **Context API** para estado global
- **React Query** para cache de dados
- **Zustand** para gerenciamento de estado

## 🛡️ Tratamento de Erros

### Cliente HTTP

```typescript
async function handleApiCall<T>(
  apiCall: () => Promise<T>
): Promise<{ data?: T; error?: string }> {
  try {
    const data = await apiCall();
    return { data };
  } catch (error) {
    console.error("Erro na API:", error);
    return { error: "Erro ao processar requisição" };
  }
}
```

### Componentes

```typescript
const [error, setError] = useState<string | null>(null);

async function loadData() {
  const result = await handleApiCall(() => api.getUsers());

  if (result.error) {
    setError(result.error);
  } else {
    setUsers(result.data!);
  }
}
```

## 📱 Responsividade

### Breakpoints Tailwind

- **sm**: 640px+
- **md**: 768px+
- **lg**: 1024px+
- **xl**: 1280px+
- **2xl**: 1536px+

### Exemplo de Layout Responsivo

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {users.map((user) => (
    <UserCard key={user.id} user={user} />
  ))}
</div>
```

## 🧪 Testes

### Testando Componentes

```bash
# Instalar dependências de teste
bun add -D @testing-library/react @testing-library/jest-dom

# Executar testes
bun test
```

### Testando API

```typescript
// Teste de integração
test("should fetch users from API", async () => {
  const users = await api.getUsers();
  expect(Array.isArray(users)).toBe(true);
});
```

## 📚 Dependências Principais

### Core

- **React 18** - Biblioteca de interface
- **Vite** - Build tool rápida
- **TypeScript** - Tipagem estática

### UI

- **Tailwind CSS** - Framework CSS
- **shadcn/ui** - Componentes UI
- **Lucide React** - Ícones

### Integração

- **@shared** - Tipos e utilitários compartilhados

## 🔄 Desenvolvimento

### Hot Reload

- Vite Dev Server com hot reload
- Atualizações automáticas em desenvolvimento
- Fast Refresh para React

### Build

```bash
# Build para produção
bun run build

# Preview da build
bun run preview
```

### Deploy

- Build otimizado para produção
- Assets estáticos servidos via nginx (Docker)
- Configuração de proxy para API
