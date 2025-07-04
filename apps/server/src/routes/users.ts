import { Hono } from "hono";
import { cors } from "hono/cors";
import { UserController } from "../controllers/UserController";
import { Config } from "../config";
import { ApiResponse } from "@shared";

const users = new Hono();
const userController = new UserController();

// Middleware CORS
users.use(
  "*",
  cors({
    origin: Config.getCorsOrigins(),
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Rotas básicas CRUD
users.get("/", (c) => userController.getAllUsers(c));
users.get("/:id", (c) => userController.getUserById(c));
users.post("/", (c) => userController.createUser(c));
users.put("/:id", (c) => userController.updateUser(c));
users.delete("/:id", (c) => userController.deleteUser(c));

// Rotas de autenticação
users.post("/login", (c) => userController.login(c));
users.post("/logout", (c) => userController.logout(c));
users.post("/refresh-token", (c) => userController.refreshToken(c));

// Rotas de sessões
users.get("/:id/sessions", (c) => userController.getUserSessions(c));
users.delete("/:id/sessions/:sessionId", (c) =>
  userController.deleteSession(c)
);

// Rotas de atividades
users.get("/:id/activities", (c) => userController.getUserActivities(c));

// Rotas de tenants do usuário
users.get("/:id/tenants", (c) => userController.getUserTenants(c));

// Rotas de equipes do usuário
users.get("/:id/teams", (c) => userController.getUserTeams(c));

export default users;
