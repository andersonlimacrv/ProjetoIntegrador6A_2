import { Hono } from "hono";
import { cors } from "hono/cors";
import {
  UserController,
  validateCreateUser,
  validateUpdateUser,
  validateUserId,
} from "../controllers/userController";
import { Config } from "../config";

const users = new Hono();

// Middleware CORS
users.use(
  "*",
  cors({
    origin: Config.getCorsOrigins(),
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// GET /users - Listar todos os usuários
users.get("/", UserController.getAllUsers);

// GET /users/:id - Buscar usuário por ID
users.get("/:id", validateUserId, UserController.getUserById);

// POST /users - Criar novo usuário
users.post("/", validateCreateUser, UserController.createUser);

// PUT /users/:id - Atualizar usuário
users.put(
  "/:id",
  validateUserId,
  validateUpdateUser,
  UserController.updateUser
);

// DELETE /users/:id - Deletar usuário
users.delete("/:id", validateUserId, UserController.deleteUser);

export default users;
