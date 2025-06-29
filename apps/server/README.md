# Servidor - Projeto Integrador 6A

Este é o servidor backend do projeto, construído com **Hono.js**, **Drizzle ORM** e seguindo um padrão **MVC estrito**.

## 🏗️ Arquitetura MVC

### 📁 Estrutura de Pastas

```
src/
├── config/           # Configurações da aplicação
├── controllers/      # Controllers (Controladores)
├── db/              # Camada de dados
│   ├── connection.ts # Conexão com banco
│   ├── schema.ts     # Schema do Drizzle
│   └── init.ts       # Inicialização do banco
├── middlewares/      # Middlewares personalizados
├── models/           # Modelos e tipos
├── repositories/     # Repositórios (Acesso a dados)
├── routes/           # Rotas da API
├── services/         # Serviços (Lógica de negócio)
├── types/            # Tipos TypeScript
├── utils/            # Utilitários
├── index.ts          # Aplicação principal
└── server.ts         # Inicialização do servidor
```

### 🔄 Fluxo MVC

1. **Routes** → Recebe requisições HTTP
2. **Middlewares** → Valida dados de entrada
3. **Controllers** → Orquestra a operação
4. **Services** → Contém lógica de negócio
5. **Repositories** → Acessa o banco de dados
6. **Models** → Define tipos e interfaces

## 🚀 Como Executar

### Desenvolvimento

```bash
cd apps/server
bun run dev
```

### Produção

```bash
cd apps/server
bun run build
bun run start
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

## 🔧 Configuração

### Variáveis de Ambiente

```env
NODE_ENV=development
SERVER_PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/database
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

## 🛡️ Segurança

- **CORS** configurado para origens específicas
- **Headers de segurança** automáticos
- **Validação de entrada** com Zod
- **Tratamento de erros** padronizado

## 📝 Exemplos de Uso

### Criar Usuário

```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "João Silva", "email": "joao@example.com"}'
```

### Listar Usuários

```bash
curl http://localhost:3001/api/users
```

### Buscar Usuário por ID

```bash
curl http://localhost:3001/api/users/1
```

## 🧪 Testes

### Health Check

```bash
curl http://localhost:3001/health
```

Resposta esperada:

```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "development",
  "database": {
    "status": "healthy",
    "message": "Conexão OK (5ms)",
    "timestamp": "2024-01-01T00:00:00.000Z"
  },
  "version": "1.0.0"
}
```

## 🔍 Logs

O servidor inclui logs detalhados:

- Requisições HTTP com tempo de resposta
- Erros de validação
- Status da conexão com banco
- Operações de CRUD

## 🚨 Tratamento de Erros

- **400** - Dados inválidos
- **404** - Recurso não encontrado
- **409** - Conflito (ex: email já existe)
- **500** - Erro interno do servidor

## 📚 Dependências Principais

- **Hono.js** - Framework web
- **Drizzle ORM** - ORM para PostgreSQL
- **Zod** - Validação de esquemas
- **PostgreSQL** - Banco de dados
