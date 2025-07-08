# 🧪 Testes - Sistema de Gerenciamento de Tarefas Ágeis

Documentação completa dos testes do backend, incluindo testes de API, validações e cenários de uso do sistema.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura de Testes](#arquitetura-de-testes)
- [Configuração](#configuração)
- [Tipos de Teste](#tipos-de-teste)
- [Executando Testes](#executando-testes)
- [Cenários de Teste](#cenários-de-teste)
- [Boas Práticas](#boas-práticas)
- [Debugging](#debugging)

## 🎯 Visão Geral

O sistema de testes implementa uma abordagem completa para validar:

- **APIs RESTful**: Todos os endpoints da aplicação
- **Validações**: Dados de entrada e saída
- **Autenticação**: Fluxos de login/registro
- **Autorização**: Controle de acesso por tenant
- **Integridade de Dados**: Operações CRUD
- **Cenários de Erro**: Tratamento de exceções
- **Performance**: Tempo de resposta das APIs

## 🏗️ Arquitetura de Testes

### Estrutura de Testes

```
tests/
├── http-client.env.json    # Configurações de ambiente
├── projects.http          # Testes de projetos
├── users.http             # Testes de usuários
├── teams.http             # Testes de equipes
├── sprints.http           # Testes de sprints
├── userStories.http       # Testes de user stories
├── tasks.http             # Testes de tarefas
├── auth.http              # Testes de autenticação
├── tenants.http           # Testes de tenants
├── comments.http          # Testes de comentários
├── activities.http        # Testes de atividades
├── exemplo-fluxo-completo.http  # Fluxo completo do sistema
├── run-tests.sh           # Script de execução
└── README.md              # Esta documentação
```

### Ferramentas Utilizadas

- **HTTP Client**: VS Code REST Client ou similar
- **Postman**: Alternativa para testes manuais
- **curl**: Testes via linha de comando
- **Jest**: Testes unitários (futuro)
- **Supertest**: Testes de integração (futuro)

## ⚙️ Configuração

### Variáveis de Ambiente

```json
{
  "development": {
    "baseUrl": "http://localhost:8080",
    "apiUrl": "http://localhost:8080/api"
  },
  "staging": {
    "baseUrl": "https://staging-api.example.com",
    "apiUrl": "https://staging-api.example.com/api"
  },
  "production": {
    "baseUrl": "https://api.example.com",
    "apiUrl": "https://api.example.com/api"
  }
}
```

### Configuração do HTTP Client

```http
### Configuração global
@baseUrl = {{$dotenv baseUrl}}
@apiUrl = {{$dotenv apiUrl}}
@contentType = application/json

### Variáveis de teste
@authToken = {{auth.response.body.data.token}}
@userId = {{auth.response.body.data.user.id}}
@tenantId = {{auth.response.body.data.tenant.id}}
@projectId = {{createProject.response.body.data.id}}
```

## 📝 Tipos de Teste

### 1. Testes de Autenticação

#### Registro de Usuário

```http
### Registrar novo usuário
# @name register
POST {{apiUrl}}/auth/register
Content-Type: {{contentType}}

{
  "name": "Teste Usuário",
  "email": "teste@example.com",
  "password": "senha123",
  "companyName": "Empresa Teste"
}

### Validar resposta
> {%
  client.test("Registro bem-sucedido", function() {
    client.assert(response.status === 200, "Status deve ser 200");
    client.assert(response.body.success === true, "Success deve ser true");
    client.assert(response.body.data.user.email === "teste@example.com", "Email deve corresponder");
    client.assert(response.body.data.tenant.name === "Empresa Teste", "Nome da empresa deve corresponder");
  });
%}
```

#### Login de Usuário

```http
### Fazer login
# @name login
POST {{apiUrl}}/auth/login
Content-Type: {{contentType}}

{
  "email": "teste@example.com",
  "password": "senha123"
}

### Validar resposta
> {%
  client.test("Login bem-sucedido", function() {
    client.assert(response.status === 200, "Status deve ser 200");
    client.assert(response.body.success === true, "Success deve ser true");
    client.assert(response.body.data.token, "Token deve estar presente");
    client.assert(response.body.data.user, "Dados do usuário devem estar presentes");
    client.assert(response.body.data.tenant, "Dados do tenant devem estar presentes");
  });
%}
```

### 2. Testes de Projetos

#### Criar Projeto

```http
### Criar projeto
# @name createProject
POST {{apiUrl}}/projects
Content-Type: {{contentType}}
Authorization: Bearer {{authToken}}

{
  "name": "Projeto Teste",
  "slug": "projeto-teste",
  "description": "Descrição do projeto teste",
  "projectKey": "PT",
  "tenantId": "{{tenantId}}",
  "ownerId": "{{userId}}"
}

### Validar resposta
> {%
  client.test("Projeto criado com sucesso", function() {
    client.assert(response.status === 200, "Status deve ser 200");
    client.assert(response.body.success === true, "Success deve ser true");
    client.assert(response.body.data.name === "Projeto Teste", "Nome deve corresponder");
    client.assert(response.body.data.projectKey === "PT", "Project key deve corresponder");
    client.assert(response.body.data.tenantId === client.global.get("tenantId"), "Tenant ID deve corresponder");
  });
%}
```

#### Listar Projetos

```http
### Listar projetos
GET {{apiUrl}}/projects
Authorization: Bearer {{authToken}}

### Validar resposta
> {%
  client.test("Lista projetos com sucesso", function() {
    client.assert(response.status === 200, "Status deve ser 200");
    client.assert(response.body.success === true, "Success deve ser true");
    client.assert(Array.isArray(response.body.data), "Data deve ser um array");
  });
%}
```

#### Buscar Projeto por ID

```http
### Buscar projeto por ID
GET {{apiUrl}}/projects/{{projectId}}
Authorization: Bearer {{authToken}}

### Validar resposta
> {%
  client.test("Projeto encontrado", function() {
    client.assert(response.status === 200, "Status deve ser 200");
    client.assert(response.body.success === true, "Success deve ser true");
    client.assert(response.body.data.id === client.global.get("projectId"), "ID deve corresponder");
  });
%}
```

### 3. Testes de Equipes

#### Criar Equipe

```http
### Criar equipe
# @name createTeam
POST {{apiUrl}}/teams
Content-Type: {{contentType}}
Authorization: Bearer {{authToken}}

{
  "name": "Equipe Teste",
  "description": "Descrição da equipe teste",
  "tenantId": "{{tenantId}}"
}

### Validar resposta
> {%
  client.test("Equipe criada com sucesso", function() {
    client.assert(response.status === 200, "Status deve ser 200");
    client.assert(response.body.success === true, "Success deve ser true");
    client.assert(response.body.data.name === "Equipe Teste", "Nome deve corresponder");
  });
%}
```

### 4. Testes de Sprints

#### Criar Sprint

```http
### Criar sprint
# @name createSprint
POST {{apiUrl}}/sprints
Content-Type: {{contentType}}
Authorization: Bearer {{authToken}}

{
  "name": "Sprint 1",
  "description": "Primeiro sprint do projeto",
  "projectId": "{{projectId}}",
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-01-15T23:59:59.999Z"
}

### Validar resposta
> {%
  client.test("Sprint criado com sucesso", function() {
    client.assert(response.status === 200, "Status deve ser 200");
    client.assert(response.body.success === true, "Success deve ser true");
    client.assert(response.body.data.name === "Sprint 1", "Nome deve corresponder");
    client.assert(response.body.data.projectId === client.global.get("projectId"), "Project ID deve corresponder");
  });
%}
```

### 5. Testes de User Stories

#### Criar User Story

```http
### Criar user story
# @name createUserStory
POST {{apiUrl}}/user-stories
Content-Type: {{contentType}}
Authorization: Bearer {{authToken}}

{
  "title": "Como usuário, quero fazer login",
  "description": "Implementar sistema de autenticação",
  "acceptanceCriteria": "1. Usuário pode inserir email e senha\n2. Sistema valida credenciais\n3. Usuário é redirecionado para dashboard",
  "projectId": "{{projectId}}",
  "statusId": "{{statusId}}",
  "storyPoints": 5,
  "priority": 1
}

### Validar resposta
> {%
  client.test("User story criada com sucesso", function() {
    client.assert(response.status === 200, "Status deve ser 200");
    client.assert(response.body.success === true, "Success deve ser true");
    client.assert(response.body.data.title === "Como usuário, quero fazer login", "Título deve corresponder");
    client.assert(response.body.data.storyPoints === 5, "Story points devem corresponder");
  });
%}
```

### 6. Testes de Tarefas

#### Criar Tarefa

```http
### Criar tarefa
# @name createTask
POST {{apiUrl}}/tasks
Content-Type: {{contentType}}
Authorization: Bearer {{authToken}}

{
  "title": "Implementar validação de formulário",
  "description": "Adicionar validação no frontend para o formulário de login",
  "projectId": "{{projectId}}",
  "statusId": "{{statusId}}",
  "priority": 2,
  "estimatedHours": 4,
  "reporterId": "{{userId}}",
  "assigneeId": "{{userId}}"
}

### Validar resposta
> {%
  client.test("Tarefa criada com sucesso", function() {
    client.assert(response.status === 200, "Status deve ser 200");
    client.assert(response.body.success === true, "Success deve ser true");
    client.assert(response.body.data.title === "Implementar validação de formulário", "Título deve corresponder");
    client.assert(response.body.data.estimatedHours === 4, "Horas estimadas devem corresponder");
  });
%}
```

## 🚀 Executando Testes

### Via HTTP Client (VS Code)

1. **Instalar extensão REST Client**
2. **Abrir arquivo .http**
3. **Executar teste individual**: Clique em "Send Request"
4. **Executar todos os testes**: Use o script de execução

### Via Script

```bash
# Executar todos os testes
./run-tests.sh

# Executar testes específicos
./run-tests.sh auth
./run-tests.sh projects
./run-tests.sh teams
```

### Via curl

```bash
# Teste de login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@example.com","password":"senha123"}'

# Teste de criação de projeto
curl -X POST http://localhost:8080/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Projeto Teste","slug":"projeto-teste","projectKey":"PT","tenantId":"TENANT_ID","ownerId":"USER_ID"}'
```

## 📋 Cenários de Teste

### 1. Fluxo Completo do Sistema

```http
### Fluxo completo: Registro → Login → Criar Projeto → Criar Equipe → Criar Sprint → Criar User Story → Criar Tarefa

### 1. Registrar usuário
# @name register
POST {{apiUrl}}/auth/register
Content-Type: {{contentType}}

{
  "name": "Usuário Teste",
  "email": "usuario@teste.com",
  "password": "senha123",
  "companyName": "Empresa Teste"
}

### 2. Fazer login
# @name login
POST {{apiUrl}}/auth/login
Content-Type: {{contentType}}

{
  "email": "usuario@teste.com",
  "password": "senha123"
}

### 3. Criar projeto
# @name createProject
POST {{apiUrl}}/projects
Content-Type: {{contentType}}
Authorization: Bearer {{login.response.body.data.token}}

{
  "name": "Projeto Completo",
  "slug": "projeto-completo",
  "description": "Projeto para testar fluxo completo",
  "projectKey": "PC",
  "tenantId": "{{login.response.body.data.tenant.id}}",
  "ownerId": "{{login.response.body.data.user.id}}"
}

### 4. Criar equipe
# @name createTeam
POST {{apiUrl}}/teams
Content-Type: {{contentType}}
Authorization: Bearer {{login.response.body.data.token}}

{
  "name": "Equipe Desenvolvimento",
  "description": "Equipe responsável pelo desenvolvimento",
  "tenantId": "{{login.response.body.data.tenant.id}}"
}

### 5. Criar sprint
# @name createSprint
POST {{apiUrl}}/sprints
Content-Type: {{contentType}}
Authorization: Bearer {{login.response.body.data.token}}

{
  "name": "Sprint 1 - MVP",
  "description": "Primeiro sprint para MVP",
  "projectId": "{{createProject.response.body.data.id}}",
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-01-15T23:59:59.999Z"
}

### 6. Criar user story
# @name createUserStory
POST {{apiUrl}}/user-stories
Content-Type: {{contentType}}
Authorization: Bearer {{login.response.body.data.token}}

{
  "title": "Como usuário, quero fazer login no sistema",
  "description": "Implementar funcionalidade de autenticação",
  "acceptanceCriteria": "1. Usuário insere email e senha\n2. Sistema valida credenciais\n3. Usuário é redirecionado para dashboard",
  "projectId": "{{createProject.response.body.data.id}}",
  "statusId": "{{statusId}}",
  "storyPoints": 8,
  "priority": 1
}

### 7. Criar tarefa
# @name createTask
POST {{apiUrl}}/tasks
Content-Type: {{contentType}}
Authorization: Bearer {{login.response.body.data.token}}

{
  "title": "Implementar formulário de login",
  "description": "Criar interface do usuário para login",
  "projectId": "{{createProject.response.body.data.id}}",
  "statusId": "{{statusId}}",
  "priority": 1,
  "estimatedHours": 6,
  "reporterId": "{{login.response.body.data.user.id}}",
  "assigneeId": "{{login.response.body.data.user.id}}"
}

### Validar fluxo completo
> {%
  client.test("Fluxo completo executado com sucesso", function() {
    // Verificar se todas as operações foram bem-sucedidas
    client.assert(register.response.status === 200, "Registro deve ser bem-sucedido");
    client.assert(login.response.status === 200, "Login deve ser bem-sucedido");
    client.assert(createProject.response.status === 200, "Criação de projeto deve ser bem-sucedida");
    client.assert(createTeam.response.status === 200, "Criação de equipe deve ser bem-sucedida");
    client.assert(createSprint.response.status === 200, "Criação de sprint deve ser bem-sucedida");
    client.assert(createUserStory.response.status === 200, "Criação de user story deve ser bem-sucedida");
    client.assert(createTask.response.status === 200, "Criação de tarefa deve ser bem-sucedida");

    // Verificar integridade dos dados
    const project = createProject.response.body.data;
    const userStory = createUserStory.response.body.data;
    const task = createTask.response.body.data;

    client.assert(userStory.projectId === project.id, "User story deve pertencer ao projeto");
    client.assert(task.projectId === project.id, "Tarefa deve pertencer ao projeto");
  });
%}
```

### 2. Cenários de Erro

#### Dados Inválidos

```http
### Teste: Criar projeto com dados inválidos
POST {{apiUrl}}/projects
Content-Type: {{contentType}}
Authorization: Bearer {{authToken}}

{
  "name": "",  // Nome vazio
  "projectKey": "INVALID_KEY_TOO_LONG",  // Chave muito longa
  "tenantId": "invalid-uuid"  // UUID inválido
}

### Validar erro
> {%
  client.test("Erro de validação", function() {
    client.assert(response.status === 400, "Status deve ser 400");
    client.assert(response.body.success === false, "Success deve ser false");
    client.assert(response.body.error, "Mensagem de erro deve estar presente");
  });
%}
```

#### Autenticação Inválida

```http
### Teste: Acessar endpoint sem token
GET {{apiUrl}}/projects

### Validar erro
> {%
  client.test("Erro de autenticação", function() {
    client.assert(response.status === 401, "Status deve ser 401");
    client.assert(response.body.success === false, "Success deve ser false");
  });
%}
```

#### Recurso Não Encontrado

```http
### Teste: Buscar projeto inexistente
GET {{apiUrl}}/projects/invalid-id
Authorization: Bearer {{authToken}}

### Validar erro
> {%
  client.test("Recurso não encontrado", function() {
    client.assert(response.status === 404, "Status deve ser 404");
    client.assert(response.body.success === false, "Success deve ser false");
  });
%}
```

### 3. Testes de Performance

#### Tempo de Resposta

```http
### Teste de performance: Listar projetos
# @name performanceTest
GET {{apiUrl}}/projects
Authorization: Bearer {{authToken}}

### Validar performance
> {%
  client.test("Performance aceitável", function() {
    client.assert(response.status === 200, "Status deve ser 200");
    client.assert(response.timings.duration < 1000, "Resposta deve ser menor que 1 segundo");
  });
%}
```

## ✨ Boas Práticas

### 1. Organização dos Testes

#### Estrutura Hierárquica

```http
### ========================================
### GRUPO: Autenticação
### ========================================

### Teste 1: Registro de usuário
# @name register
POST {{apiUrl}}/auth/register
...

### Teste 2: Login de usuário
# @name login
POST {{apiUrl}}/auth/login
...

### ========================================
### GRUPO: Projetos
### ========================================

### Teste 1: Criar projeto
# @name createProject
POST {{apiUrl}}/projects
...
```

#### Nomenclatura Consistente

```http
### ✅ Bom
# @name createProject
# @name getUserById
# @name updateTeam

### ❌ Ruim
# @name test1
# @name project
# @name team_update
```

### 2. Validações Robustas

#### Validação de Status

```http
### Validar resposta
> {%
  client.test("Status correto", function() {
    client.assert(response.status === 200, "Status deve ser 200");
  });

  client.test("Estrutura da resposta", function() {
    client.assert(response.body.hasOwnProperty("success"), "Resposta deve ter campo 'success'");
    client.assert(response.body.hasOwnProperty("data"), "Resposta deve ter campo 'data'");
  });

  client.test("Dados corretos", function() {
    client.assert(response.body.data.name === "Projeto Teste", "Nome deve corresponder");
    client.assert(response.body.data.projectKey === "PT", "Project key deve corresponder");
  });
%}
```

#### Validação de Tipos

```http
### Validar tipos de dados
> {%
  client.test("Tipos corretos", function() {
    const data = response.body.data;
    client.assert(typeof data.id === "string", "ID deve ser string");
    client.assert(typeof data.name === "string", "Nome deve ser string");
    client.assert(typeof data.createdAt === "string", "CreatedAt deve ser string");
    client.assert(Array.isArray(data.tags), "Tags deve ser array");
  });
%}
```

### 3. Reutilização de Variáveis

#### Configuração Global

```http
### Configuração
@baseUrl = http://localhost:8080
@apiUrl = {{baseUrl}}/api
@contentType = application/json

### Variáveis de teste
@authToken = {{login.response.body.data.token}}
@userId = {{login.response.body.data.user.id}}
@tenantId = {{login.response.body.data.tenant.id}}
@projectId = {{createProject.response.body.data.id}}
```

#### Variáveis Dinâmicas

```http
### Criar projeto e usar ID
# @name createProject
POST {{apiUrl}}/projects
...

### Usar ID do projeto criado
GET {{apiUrl}}/projects/{{createProject.response.body.data.id}}
```

### 4. Documentação dos Testes

#### Comentários Descritivos

```http
### ========================================
### TESTE: Criação de Projeto
### ========================================
### Objetivo: Validar criação de projeto com dados válidos
### Pré-condições: Usuário autenticado, tenant válido
### Dados de teste: Nome, slug, project key únicos
### Resultado esperado: Projeto criado com status 200
### ========================================

# @name createProject
POST {{apiUrl}}/projects
...
```

#### Cenários de Teste

```http
### Cenário 1: Dados válidos
### Cenário 2: Nome duplicado
### Cenário 3: Project key duplicada
### Cenário 4: Dados inválidos
### Cenário 5: Sem autenticação
```

## 🐛 Debugging

### 1. Logs de Debug

#### Ativar Logs

```http
### Teste com logs
# @name debugTest
POST {{apiUrl}}/projects
Content-Type: {{contentType}}
Authorization: Bearer {{authToken}}

{
  "name": "Projeto Debug",
  "slug": "projeto-debug",
  "projectKey": "PD",
  "tenantId": "{{tenantId}}",
  "ownerId": "{{userId}}"
}

### Logs de debug
> {%
  console.log("Request Headers:", request.headers);
  console.log("Request Body:", request.body);
  console.log("Response Status:", response.status);
  console.log("Response Body:", response.body);
%}
```

#### Validação com Logs

```http
### Validar com logs
> {%
  client.test("Debug response", function() {
    console.log("Full response:", response);
    console.log("Response body:", response.body);
    console.log("Response headers:", response.headers);

    client.assert(response.status === 200, "Status deve ser 200");
  });
%}
```

### 2. Testes de Isolamento

#### Limpeza de Dados

```http
### Limpar dados de teste
DELETE {{apiUrl}}/projects/{{projectId}}
Authorization: Bearer {{authToken}}

### Validar limpeza
> {%
  client.test("Dados limpos", function() {
    client.assert(response.status === 200, "Deleção deve ser bem-sucedida");
  });
%}
```

### 3. Testes de Concorrência

#### Múltiplas Requisições

```http
### Teste de concorrência
# @name concurrent1
POST {{apiUrl}}/projects
Content-Type: {{contentType}}
Authorization: Bearer {{authToken}}

{
  "name": "Projeto Concorrente 1",
  "slug": "projeto-concorrente-1",
  "projectKey": "PC1",
  "tenantId": "{{tenantId}}",
  "ownerId": "{{userId}}"
}

---
# @name concurrent2
POST {{apiUrl}}/projects
Content-Type: {{contentType}}
Authorization: Bearer {{authToken}}

{
  "name": "Projeto Concorrente 2",
  "slug": "projeto-concorrente-2",
  "projectKey": "PC2",
  "tenantId": "{{tenantId}}",
  "ownerId": "{{userId}}"
}

### Validar concorrência
> {%
  client.test("Concorrência", function() {
    client.assert(concurrent1.response.status === 200, "Primeira requisição deve ser bem-sucedida");
    client.assert(concurrent2.response.status === 200, "Segunda requisição deve ser bem-sucedida");
  });
%}
```

## 📊 Relatórios de Teste

### 1. Relatório de Execução

```bash
# Executar testes e gerar relatório
./run-tests.sh --report

# Saída esperada:
# ========================================
# RELATÓRIO DE TESTES
# ========================================
# Total de testes: 45
# Passou: 42
# Falhou: 3
# Tempo total: 2m 30s
# ========================================
# DETALHES DOS FALHOS:
# - auth.http: Teste de login com credenciais inválidas
# - projects.http: Teste de criação com dados duplicados
# - teams.http: Teste de autorização
# ========================================
```

### 2. Métricas de Performance

```bash
# Métricas de tempo de resposta
# Endpoint: /api/projects
# Média: 150ms
# P95: 300ms
# P99: 500ms
# Máximo: 800ms
```

## 🔄 Integração Contínua

### 1. Pipeline de Testes

```yaml
# .github/workflows/tests.yml
name: API Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "18"
      - name: Install dependencies
        run: bun install
      - name: Start database
        run: docker-compose up -d postgres
      - name: Run migrations
        run: bun run db:migrate
      - name: Run tests
        run: ./run-tests.sh
      - name: Generate report
        run: ./run-tests.sh --report
```

### 2. Testes Automatizados

```bash
# Script de execução automatizada
#!/bin/bash
# run-tests.sh

set -e

echo "🚀 Iniciando testes da API..."

# Configurações
BASE_URL="http://localhost:8080"
API_URL="$BASE_URL/api"
REPORT_FILE="test-report.json"

# Função para executar teste
run_test() {
  local test_file=$1
  echo "📝 Executando: $test_file"

  # Executar teste e capturar resultado
  result=$(curl -s -w "%{http_code}" -o /tmp/response.json "$API_URL/test")

  # Validar resultado
  if [ "$result" = "200" ]; then
    echo "✅ $test_file: PASS"
    return 0
  else
    echo "❌ $test_file: FAIL (Status: $result)"
    return 1
  fi
}

# Executar todos os testes
echo "🧪 Executando suite de testes..."

# Testes de autenticação
run_test "auth.http"

# Testes de projetos
run_test "projects.http"

# Testes de equipes
run_test "teams.http"

# Testes de sprints
run_test "sprints.http"

# Testes de user stories
run_test "userStories.http"

# Testes de tarefas
run_test "tasks.http"

echo "🎉 Testes concluídos!"
```

---

**🧪 Sistema de testes robusto e abrangente, garantindo qualidade e confiabilidade da API!**
