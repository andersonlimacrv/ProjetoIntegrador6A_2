# Servidor - Projeto Integrador 6A

Backend desenvolvido com **Hono.js**, **Drizzle ORM** e **PostgreSQL**, seguindo o padrão **MVC estrito**.

## 🏗️ Arquitetura MVC

### Estrutura de Pastas

```
src/
├── config/          # Configurações do servidor
├── controllers/     # Controladores (orquestração)
├── db/             # Configuração e schema do banco
├── middlewares/    # Middlewares (validação, erros)
├── models/         # Modelos (tipos e interfaces)
├── repositories/   # Repositórios (acesso a dados)
├── routes/         # Rotas da API
├── services/       # Serviços (lógica de negócio)
├── types/          # Tipos específicos do servidor
├── utils/          # Utilitários
└── server.ts       # Ponto de entrada
```

### Padrão MVC Implementado

#### 1. **Models** (`src/models/`)

- Definem as interfaces e tipos dos dados
- Exemplo: `User.ts` - Interface do usuário

#### 2. **Repositories** (`src/repositories/`)

- Responsáveis pelo acesso direto ao banco de dados
- Implementam operações CRUD básicas
- Exemplo: `UserRepository.ts` - Operações de usuário no banco

#### 3. **Services** (`src/services/`)

- Contêm a lógica de negócio
- Orquestram operações entre repositories
- Implementam regras de validação complexas
- Exemplo: `UserService.ts` - Lógica de negócio de usuários

#### 4. **Controllers** (`src/controllers/`)

- Recebem requisições HTTP
- Validam dados de entrada
- Chamam services apropriados
- Retornam respostas padronizadas
- Exemplo: `userController.ts` - Endpoints de usuário

#### 5. **Routes** (`src/routes/`)

- Definem os endpoints da API
- Conectam URLs aos controllers
- Exemplo: `users.ts` - Rotas de usuário

#### 6. **Middlewares** (`src/middlewares/`)

- Validação de dados com Zod
- Tratamento global de erros
- Logging de requisições
- Exemplo: `validation.ts`, `errorHandler.ts`

## 🚀 Como Executar

### Desenvolvimento Local

```bash
# Instalar dependências
bun install

# Executar servidor
bun run dev

# Ou via Makefile (raiz do projeto)
make dev
```

### Scripts Disponíveis

```bash
bun run dev        # Desenvolvimento com hot reload
bun run build      # Build para produção
bun run start      # Executar em produção
bun run seed       # Popular banco com dados
bun run seed reset # Resetar banco (limpar + popular)
```

## 📊 Endpoints da API

### Health Check

```
GET /health
```

**Resposta:**

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected"
}
```

### Usuários

```
GET    /api/users     # Listar todos
GET    /api/users/:id # Buscar por ID
POST   /api/users     # Criar novo
PUT    /api/users/:id # Atualizar
DELETE /api/users/:id # Deletar
```

## 🔧 Configuração

### Variáveis de Ambiente

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
```

## 🗄️ Banco de Dados

### Schema Principal

```sql
-- Tabela de usuários
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Operações de Banco

```bash
# Popular com dados de exemplo
bun run seed

# Resetar banco (limpar + popular)
bun run seed reset
```

## 🛡️ Validação e Segurança

### Validação com Zod

- Todos os dados de entrada são validados
- Schemas reutilizáveis do pacote `shared`
- Mensagens de erro padronizadas

### Tratamento de Erros

- Middleware global de tratamento de erros
- Respostas padronizadas para diferentes tipos de erro
- Logs detalhados para debugging

### CORS

- Configuração de CORS para desenvolvimento
- Origem configurável via variável de ambiente

## 📝 Logs

O servidor inclui logs detalhados:

- Requisições HTTP com método, URL e tempo de resposta
- Erros de validação com detalhes
- Status da conexão com banco de dados
- Operações CRUD com identificadores

## 🧪 Testes

### Testando Endpoints

```bash
# Health check
curl http://localhost:3001/health

# Listar usuários
curl http://localhost:3001/api/users

# Criar usuário
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "João Silva", "email": "joao@example.com"}'
```

## 📚 Dependências Principais

- **Hono.js** - Framework web moderno
- **Drizzle ORM** - ORM type-safe para PostgreSQL
- **Zod** - Validação de esquemas
- **PostgreSQL** - Banco de dados relacional
- **@shared** - Tipos e utilitários compartilhados

## 🔄 Integração com Frontend

O servidor se integra com o frontend através:

- **API REST** - Endpoints padronizados
- **Tipos Compartilhados** - Via pacote `shared`
- **CORS** - Configurado para desenvolvimento
- **Respostas Padronizadas** - Estrutura consistente

## 🚨 Códigos de Erro

- **400** - Dados inválidos (validação falhou)
- **404** - Recurso não encontrado
- **409** - Conflito (ex: email já existe)
- **500** - Erro interno do servidor
