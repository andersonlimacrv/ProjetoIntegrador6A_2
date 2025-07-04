import { Hono } from "hono";
import { cors } from "hono/cors";
import { ActivityController } from "../controllers/ActivityController";
import { Config } from "../config";

const activities = new Hono();

// Middleware CORS
activities.use(
  "*",
  cors({
    origin: Config.getCorsOrigins(),
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Rotas básicas CRUD
activities.get("/", ActivityController.getAllActivities);
activities.get("/:id", ActivityController.getActivityById);
activities.post("/", ActivityController.createActivity);
activities.put("/:id", ActivityController.updateActivity);
activities.delete("/:id", ActivityController.deleteActivity);

// Rotas por usuário
activities.get("/user/:userId", ActivityController.getActivitiesByUser);

// Rotas por projeto
activities.get(
  "/project/:projectId",
  ActivityController.getActivitiesByProject
);

// Rotas por tarefa
activities.get("/task/:taskId", ActivityController.getActivitiesByTask);

// Rotas por tipo
activities.get("/type/:type", ActivityController.getActivitiesByType);

// Rotas de feed
activities.get("/feed/:userId", ActivityController.getUserFeed);

export default activities;
