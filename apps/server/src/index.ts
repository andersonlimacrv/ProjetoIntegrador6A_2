import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import users from "./routes/users";
import { Config } from "./config";
import {
  errorHandler,
  requestLogger,
  securityHeaders,
} from "./middlewares/errorHandler";
import { checkDatabaseHealth } from "./db/init";

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
app.get("/health", async (c) => {
  const dbHealth = await checkDatabaseHealth();

  return c.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: Config.NODE_ENV,
    database: dbHealth,
    version: "1.0.0",
  });
});

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
