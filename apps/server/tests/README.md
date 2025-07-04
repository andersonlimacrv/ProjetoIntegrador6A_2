# Testes da API - Arquivos HTTP

Este diretório contém arquivos de teste HTTP para todas as rotas da API, organizados por entidade do diagrama ER.

## 📁 Estrutura dos Arquivos

- `tenants.http` - Testes para gestão de tenants e multi-tenancy
- `users.http` - Testes para usuários, autenticação e sessões
- `projects.http` - Testes para projetos e configurações
- `teams.http` - Testes para equipes e membros
- `epics.http` - Testes para épicos
- `userStories.http` - Testes para histórias de usuário
- `tasks.http` - Testes para tarefas e atribuições
- `sprints.http` - Testes para sprints e backlog
- `comments.http` - Testes para comentários e reações
- `activities.http` - Testes para atividades e feed

## 🚀 Como Usar

### 1. Configurar o Ambiente

Certifique-se de que o servidor está rodando:

```bash
cd apps/server
bun run dev
```

### 2. Configurar Variáveis de Ambiente

Cada arquivo `.http` contém variáveis de ambiente no final do arquivo. Você pode:

#### Opção A: Editar diretamente no arquivo

Descomente e configure as variáveis no final de cada arquivo:

```http
# @user_id = 123e4567-e89b-12d3-a456-426614174000
# @auth_token = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Opção B: Usar arquivo de ambiente

Crie um arquivo `http-client.env.json` na raiz do projeto:

```json
{
  "development": {
    "base_url": "http://localhost:3000",
    "auth_token": "seu_token_aqui",
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "tenant_id": "456e7890-e89b-12d3-a456-426614174001",
    "project_id": "789e0123-e89b-12d3-a456-426614174002"
  }
}
```

### 3. Executar os Testes

#### Usando VS Code com extensão REST Client:

1. Abra qualquer arquivo `.http`
2. Clique em "Send Request" acima de cada requisição
3. Veja a resposta no painel lateral

#### Usando IntelliJ IDEA:

1. Abra qualquer arquivo `.http`
2. Clique no ícone ▶️ ao lado de cada requisição
3. Veja a resposta na aba "HTTP Client"

#### Usando linha de comando:

```bash
# Instalar httpie se não tiver
npm install -g httpie

# Exemplo de teste
http POST localhost:3000/api/users name="João Silva" email="joao@exemplo.com"
```

## 🔄 Fluxo de Testes Recomendado

### 1. Configuração Inicial

```bash
# 1. Criar tenant
POST /api/tenants

# 2. Criar usuário
POST /api/users

# 3. Fazer login
POST /api/users/login

# 4. Usar o token retornado nas demais requisições
```

### 2. Sequência de Testes por Entidade

#### Tenants

1. Criar tenant
2. Listar tenants
3. Buscar por ID/slug
4. Atualizar tenant
5. Criar roles
6. Criar convites
7. Gerenciar usuários

#### Users

1. Criar usuário
2. Fazer login
3. Listar usuários
4. Atualizar usuário
5. Gerenciar sessões
6. Ver atividades

#### Projects

1. Criar projeto
2. Listar projetos
3. Configurar projeto
4. Adicionar equipes
5. Criar etiquetas
6. Configurar fluxos

#### Teams

1. Criar equipe
2. Adicionar membros
3. Listar membros
4. Atualizar roles
5. Ver projetos da equipe

#### Epics

1. Criar épico
2. Listar épicos do projeto
3. Atualizar épico
4. Ver histórias do épico

#### User Stories

1. Criar história
2. Listar histórias
3. Atualizar história
4. Adicionar ao sprint
5. Ver tarefas da história

#### Tasks

1. Criar tarefa
2. Listar tarefas
3. Atribuir tarefa
4. Adicionar etiquetas
5. Adicionar comentários
6. Atualizar tempo
7. Ver dependências

#### Sprints

1. Criar sprint
2. Adicionar histórias ao backlog
3. Iniciar sprint
4. Ver métricas
5. Completar sprint

#### Comments

1. Criar comentário
2. Listar comentários
3. Adicionar reações
4. Criar respostas

#### Activities

1. Ver atividades do usuário
2. Ver atividades do projeto
3. Ver feed
4. Filtrar por tipo

## 🔐 Autenticação

A maioria das rotas requer autenticação via Bearer Token. Para obter um token:

1. Crie um usuário:

```http
POST http://localhost:3000/api/users
Content-Type: application/json

{
  "name": "Teste",
  "email": "teste@exemplo.com",
  "password": "senha123"
}
```

2. Faça login:

```http
POST http://localhost:3000/api/users/login
Content-Type: application/json

{
  "email": "teste@exemplo.com",
  "password": "senha123"
}
```

3. Use o token retornado no header Authorization:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📊 Status Codes Esperados

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Dados inválidos
- `401` - Não autorizado
- `403` - Proibido
- `404` - Não encontrado
- `409` - Conflito (ex: slug duplicado)
- `500` - Erro interno do servidor

## 🐛 Troubleshooting

### Erro de CORS

Certifique-se de que o servidor está configurado para aceitar requisições do seu cliente HTTP.

### Token Expirado

Se receber erro 401, faça login novamente para obter um novo token.

### Dados Não Encontrados

Certifique-se de que os IDs nas variáveis de ambiente existem no banco de dados.

### Banco de Dados

Execute os scripts de criação de tabelas antes de testar:

```bash
cd apps/server
bun run scripts:create-tables
```

## 📝 Notas

- Os arquivos `.http` são compatíveis com VS Code REST Client, IntelliJ IDEA e outros editores
- As variáveis de ambiente são substituídas automaticamente durante a execução
- Mantenha os tokens seguros e não os compartilhe
- Os testes podem ser executados em qualquer ordem, mas recomenda-se seguir o fluxo sugerido
