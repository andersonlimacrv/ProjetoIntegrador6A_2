import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { Config } from "./config";

// Importar todas as rotas
import users from "./routes/users";
import tasks from "./routes/tasks";
import tenants from "./routes/tenants";
import projects from "./routes/projects";
import teams from "./routes/teams";
import epics from "./routes/epics";
import userStories from "./routes/userStories";
import sprints from "./routes/sprints";
import comments from "./routes/comments";
import activities from "./routes/activities";
import statuses from "./routes/statuses";
import auth from "./routes/auth";

// Importar middlewares e controllers
import {
  errorHandler,
  requestLogger,
  securityHeaders,
} from "./middlewares/errorHandler";
import { healthCheck } from "./controllers/healthController";

const app = new Hono();

// Middlewares globais
app.use("*", errorHandler);
app.use("*", requestLogger);
app.use("*", securityHeaders);
app.use("*", logger());
app.use("*", secureHeaders());
app.use(
  "*",
  cors({
    origin: Config.getCorsOrigins(),
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Health check
app.get("/health", healthCheck);

// Rota raiz com documentação completa da API
app.get("/", (c) => {
  return c.json({
    message: "API do Projeto Integrador 6A - Sistema de Gestão de Projetos",
    version: "1.0.0",
    environment: Config.NODE_ENV,
    server: {
      port: Config.SERVER_PORT,
      corsOrigins: Config.getCorsOrigins(),
    },
    database: {
      host: Config.DB_HOST,
      port: Config.DB_PORT,
      name: Config.DB_NAME,
    },
    endpoints: {
      health: "/health",
      tenants: "/api/tenants",
      users: "/api/users",
      projects: "/api/projects",
      teams: "/api/teams",
      epics: "/api/epics",
      userStories: "/api/user-stories",
      tasks: "/api/tasks",
      sprints: "/api/sprints",
      comments: "/api/comments",
      activities: "/api/activities",
    },
    documentation: {
      tenants: {
        "GET /api/tenants": "Listar todos os tenants",
        "GET /api/tenants/:id": "Buscar tenant por ID",
        "POST /api/tenants": "Criar novo tenant",
        "PUT /api/tenants/:id": "Atualizar tenant",
        "DELETE /api/tenants/:id": "Deletar tenant",
      },
      users: {
        "GET /api/users": "Listar todos os usuários",
        "GET /api/users/:id": "Buscar usuário por ID",
        "POST /api/users": "Criar novo usuário",
        "PUT /api/users/:id": "Atualizar usuário",
        "DELETE /api/users/:id": "Deletar usuário",
        "POST /api/users/login": "Login do usuário",
        "POST /api/users/logout": "Logout do usuário",
        "GET /api/users/:id/projects": "Listar projetos do usuário",
        "GET /api/users/:id/teams": "Listar equipes do usuário",
      },
      projects: {
        "GET /api/projects": "Listar todos os projetos",
        "GET /api/projects/:id": "Buscar projeto por ID",
        "POST /api/projects": "Criar novo projeto",
        "PUT /api/projects/:id": "Atualizar projeto",
        "DELETE /api/projects/:id": "Deletar projeto",
        "GET /api/projects/:id/teams": "Listar equipes do projeto",
        "GET /api/projects/:id/epics": "Listar epics do projeto",
        "GET /api/projects/:id/user-stories": "Listar user stories do projeto",
        "GET /api/projects/:id/tasks": "Listar tarefas do projeto",
      },
      teams: {
        "GET /api/teams": "Listar todas as equipes",
        "GET /api/teams/:id": "Buscar equipe por ID",
        "POST /api/teams": "Criar nova equipe",
        "PUT /api/teams/:id": "Atualizar equipe",
        "DELETE /api/teams/:id": "Deletar equipe",
        "GET /api/teams/:id/members": "Listar membros da equipe",
        "POST /api/teams/:id/members": "Adicionar membro à equipe",
        "DELETE /api/teams/:id/members/:userId": "Remover membro da equipe",
        "GET /api/teams/:id/projects": "Listar projetos da equipe",
      },
      epics: {
        "GET /api/epics": "Listar todos os epics",
        "GET /api/epics/:id": "Buscar epic por ID",
        "POST /api/epics": "Criar novo epic",
        "PUT /api/epics/:id": "Atualizar epic",
        "DELETE /api/epics/:id": "Deletar epic",
        "GET /api/epics/:id/user-stories": "Listar user stories do epic",
      },
      userStories: {
        "GET /api/user-stories": "Listar todas as user stories",
        "GET /api/user-stories/:id": "Buscar user story por ID",
        "POST /api/user-stories": "Criar nova user story",
        "PUT /api/user-stories/:id": "Atualizar user story",
        "DELETE /api/user-stories/:id": "Deletar user story",
        "GET /api/user-stories/:id/tasks": "Listar tarefas da user story",
      },
      tasks: {
        "GET /api/tasks": "Listar todas as tarefas",
        "GET /api/tasks/:id": "Buscar tarefa por ID",
        "POST /api/tasks": "Criar nova tarefa",
        "PUT /api/tasks/:id": "Atualizar tarefa",
        "DELETE /api/tasks/:id": "Deletar tarefa",
        "GET /api/tasks/:id/comments": "Listar comentários da tarefa",
        "POST /api/tasks/:id/comments": "Adicionar comentário à tarefa",
        "GET /api/tasks/:id/activities": "Listar atividades da tarefa",
      },
      sprints: {
        "GET /api/sprints": "Listar todos os sprints",
        "GET /api/sprints/:id": "Buscar sprint por ID",
        "POST /api/sprints": "Criar novo sprint",
        "PUT /api/sprints/:id": "Atualizar sprint",
        "DELETE /api/sprints/:id": "Deletar sprint",
        "GET /api/sprints/:id/tasks": "Listar tarefas do sprint",
        "POST /api/sprints/:id/tasks": "Adicionar tarefa ao sprint",
        "DELETE /api/sprints/:id/tasks/:taskId": "Remover tarefa do sprint",
        "GET /api/sprints/:id/metrics": "Obter métricas do sprint",
      },
      comments: {
        "GET /api/comments": "Listar todos os comentários",
        "GET /api/comments/:id": "Buscar comentário por ID",
        "POST /api/comments": "Criar novo comentário",
        "PUT /api/comments/:id": "Atualizar comentário",
        "DELETE /api/comments/:id": "Deletar comentário",
      },
      activities: {
        "GET /api/activities": "Listar todas as atividades",
        "GET /api/activities/:id": "Buscar atividade por ID",
        "POST /api/activities": "Criar nova atividade",
        "PUT /api/activities/:id": "Atualizar atividade",
        "DELETE /api/activities/:id": "Deletar atividade",
        "GET /api/activities/user/:userId": "Listar atividades do usuário",
        "GET /api/activities/project/:projectId":
          "Listar atividades do projeto",
      },
    },
    status: "online",
    timestamp: new Date().toISOString(),
  });
});

// Rotas da API - Todas as entidades do diagrama ER
app.route("/api/tenants", tenants);
app.route("/api/users", users);
app.route("/api/projects", projects);
app.route("/api/teams", teams);
app.route("/api/epics", epics);
app.route("/api/user-stories", userStories);
app.route("/api/tasks", tasks);
app.route("/api/sprints", sprints);
app.route("/api/comments", comments);
app.route("/api/activities", activities);
app.route("/api/statuses", statuses);
app.route("/api/auth", auth);

// Middleware 404
app.notFound((c) => {
  return c.json(
    {
      success: false,
      error: "Rota não encontrada",
      message: `A rota ${c.req.path} não existe`,
      availableEndpoints: [
        "/health",
        "/api/tenants",
        "/api/users",
        "/api/projects",
        "/api/teams",
        "/api/epics",
        "/api/user-stories",
        "/api/tasks",
        "/api/sprints",
        "/api/comments",
        "/api/activities",
      ],
    },
    404
  );
});

export default app;
