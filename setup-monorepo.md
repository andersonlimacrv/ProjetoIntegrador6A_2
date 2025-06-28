# Setup de Monorepo com Vite, Hono.js, Bun e Docker (Configuração TypeScript Completa)

## Passo 1: Criar Estrutura Inicial e Inicializar Projetos

### No terminal:
```bash
# Criar pasta do projeto
mkdir ProjetoIntegrador6A_2
cd ProjetoIntegrador6A_2

# Inicializar projeto raiz com Bun
bun init -y
bun add -d @types/node

# Criar estrutura de pastas
mkdir client, server/src/controllers, server/src/models, server/src/routes, server/src/utils, shared/types

# Inicializar frontend com Vite (executar na raiz)
bun create vite client --template react-ts

# Inicializar backend (Hono)
bun create hono@latest server

create-hono version 0.19.1                                                                                                                             
✔ Using target directory … server
✔ Which template do you want to use? bun
✔ Directory not empty. Continue? Yes
✔ Do you want to install project dependencies? Yes
✔ Which package manager do you want to use? bun
✔ Cloning the template
✔ Installing project dependencies

```

## Passo 2: Configurações para monorepo - utilize workspaces

<!-- mostre aqui como ficaria cada tsconfig ( tanto os do client, que são gerados pelo proprio vite, quanto o do server, gerado pelo hono, quando shared e tsconfig.base da raiz do projeto para poder usar aliases corretamente e organizar tudo da maneira mais simples) -->



## Passo 3: Configurar Frontend (Vite + React/TS)

### `client/vite.config.ts` (com alias para shared):
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@shared": fileURLToPath(new URL("../shared", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
```

### `client/src/App.tsx` (usando tipos compartilhados):
```tsx
import { useEffect, useState } from 'react';
import { User } from '@shared/types/user';

function App() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  return (
    <div>
      <h1>Projeto Integrador</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

## Passo 4: Configurar Backend (Hono.js + Drizzle ORM)

Instalação de pacotes via linha de comando:
```bash
cd server 
bun add drizzle-orm postgres -d drizzle-kit typescript
```

### `server/src/models/user.ts`:
```typescript
import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';
import { InferModel } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export type User = InferModel<typeof users>;
export type NewUser = InferModel<typeof users, 'insert'>;
```

### `server/src/utils/db.ts`:
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../models';

const connectionString = process.env.DATABASE_URL!;

const client = postgres(connectionString, {
  ssl: process.env.NODE_ENV === 'production' ? 'require' : 'prefer',
});

export const db = drizzle(client, { schema });
```

## Passo 5: Tipos Compartilhados e Integração

### `shared/types/user.ts`:
```typescript
export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

export type CreateUserDTO = {
  name: string;
  email: string;
};
```

### `server/src/controllers/userController.ts`:
```typescript
import { db } from '../utils/db';
import { users } from '../models/user';
import { eq } from 'drizzle-orm';
import type { CreateUserDTO, User } from '@shared/types/user';

export const getUsers = async (): Promise<User[]> => {
  return await db.select().from(users);
};

export const createUser = async (dto: CreateUserDTO): Promise<User> => {
  const [newUser] = await db.insert(users).values({
    name: dto.name,
    email: dto.email
  }).returning();
  
  return newUser;
};
```

## Passo 6: Configurar Docker com Suporte a Tipos

### `Dockerfile`:
```dockerfile
FROM oven/bun:1.1.5 as base

WORKDIR /app

# Instalar dependências
COPY package.json bun.lockb ./
COPY client/package.json ./client/
COPY server/package.json ./server/
COPY shared/package.json ./shared/

RUN bun install --frozen-lockfile

# Copiar código
COPY . .

# Verificação de tipos (opcional)
RUN bun run type-check

# Expor portas
EXPOSE 3000
EXPOSE 5173

# Comando para desenvolvimento
CMD ["bun", "run", "dev"]
```

### `docker-compose.yml`:
```yaml
version: "3.8"

services:
  web:
    build: .
    ports:
      - "5173:5173" # Frontend
      - "3000:3000" # Backend
    volumes:
      - ./client:/app/client
      - ./server:/app/server
      - ./shared:/app/shared
    environment:
      - DATABASE_URL=postgres://user:password@db:5432/projeto
      - NODE_ENV=development
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:17
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: projeto
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user"]
      interval: 5s
      timeout: 5s
      retries: 5
    volumes:
      - pg_data:/var/lib/postgresql/data

volumes:
  pg_data:
```

## Passo 7: Configurações Finais e Scripts

### `package.json` (raiz do projeto):
```json
{
  "name": "projeto-integrador-6a_2",
  "version": "1.0.0",
  "scripts": {
    "dev": "bun run --parallel client:dev server:dev",
    "client:dev": "bun --cwd client run dev",
    "server:dev": "bun --cwd server run dev",
    "type-check": "bun x tsc -b",
    "type-check:watch": "bun x tsc -b -w",
    "migrate": "bun --cwd server drizzle-kit generate:pg",
    "docker:up": "docker-compose up -d --build",
    "docker:down": "docker-compose down",
    "docker:logs": "docker-compose logs -f web"
  }
}
```

### `.env` (raiz do projeto):
```env
DATABASE_URL="postgres://user:password@localhost:5432/projeto"
```

## Passo 8: Fluxo de Trabalho com Tipos Compartilhados

1. **Definir tipos em `shared/types`**:
   ```typescript
   // shared/types/product.ts
   export interface Product {
     id: number;
     name: string;
     price: number;
   }
   ```

2. **Usar no backend**:
   ```typescript
   // server/src/controllers/productController.ts
   import type { Product } from '@shared/types/product';
   
   export const getProducts = async (): Promise<Product[]> => {
     // Implementação
   };
   ```

3. **Usar no frontend**:
   ```tsx
   // client/src/components/ProductList.tsx
   import { Product } from '@shared/types/product';
   
   const ProductList = ({ products }: { products: Product[] }) => (
     <ul>
       {products.map(product => (
         <li key={product.id}>{product.name} - ${product.price}</li>
       ))}
     </ul>
   );
   ```

## Estrutura Final Completa do Projeto

```
ProjetoIntegrador6A_2/
<!-- mostre como ficaria a estrutura -->
```

## Dicas de Manutenção Avançadas

### 1. Geração Automática de Tipos a partir do Banco
Adicione ao `package.json`:
```json
"scripts": {
  "db:types": "bun --cwd server drizzle-kit generate:types --out ../shared/types/db.d.ts"
}
```

### 2. Validação com Zod
```bash
bun --cwd server add zod
```

```typescript
// shared/validations/user.ts
import { z } from 'zod';

export const UserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email()
});

export type UserDTO = z.infer<typeof UserSchema>;
```

### 3. Configuração de Build para Produção
No `Dockerfile`:
```dockerfile
# Build de produção
FROM base as production

# Build do frontend
RUN bun --cwd client run build

# Build do backend
RUN bun --cwd server run build

# Runtime final
FROM oven/bun:1.1.5-slim
WORKDIR /app

COPY --from=production /app/client/dist ./client/dist
COPY --from=production /app/server/dist ./server/dist

CMD ["bun", "run", "server/dist/index.js"]
```



## Como Iniciar o Projeto

```bash
# Instalar dependências (apenas na primeira execução)
bun install

# Iniciar desenvolvimento local
bun run dev

# Ou usar Docker:
bun run docker:up
bun run migrate

# Verificar tipos (opcional)
bun run type-check
```

**URLs de Acesso:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Health Check: http://localhost:3000/health

Esta configuração oferece uma base sólida para seu projeto integrador com:
- ✅ Configuração TypeScript robusta para monorepo
- ✅ Integração perfeita das configurações do Vite (app/node)
- ✅ Compartilhamento de tipos entre frontend e backend
- ✅ Dockerização completa com hot-reload
- ✅ Arquitetura MVC no backend
- ✅ Drizzle ORM com PostgreSQL 17
- ✅ Bun como runtime principal
