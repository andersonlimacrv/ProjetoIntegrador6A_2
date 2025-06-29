import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import users from "./routes/users";
import tasks from "./routes/tasks";
import { Config } from "./config";
import {
  errorHandler,
  requestLogger,
  securityHeaders,
} from "./middlewares/errorHandler";
import { checkDatabaseHealth } from "./db/init";
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
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Health check
app.get("/health", healthCheck);

// Rota raiz
app.get("/", (c) => {
  return c.json({
    message: "API do Projeto Integrador 6A",
    version: "1.0.0",
    environment: Config.NODE_ENV,
    endpoints: {
      health: "/health",
      users: "/api/users",
    },
    documentation: {
      users: {
        "GET /api/users": "Listar todos os usuários",
        "GET /api/users/:id": "Buscar usuário por ID",
        "POST /api/users": "Criar novo usuário",
        "PUT /api/users/:id": "Atualizar usuário",
        "DELETE /api/users/:id": "Deletar usuário",
      },
    },
  });
});

// Rotas da API
app.route("/api/users", users);
app.route("/api/tasks", tasks);

// Middleware 404
app.notFound((c) => {
  return c.json(
    {
      success: false,
      error: "Rota não encontrada",
      message: `A rota ${c.req.path} não existe`,
    },
    404
  );
});

export default app;
