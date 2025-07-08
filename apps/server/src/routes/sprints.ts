import { Hono } from "hono";
import { cors } from "hono/cors";
import { SprintController } from "../controllers/SprintController";
import { Config } from "../config";

const sprints = new Hono();

// Middleware CORS
sprints.use(
  "*",
  cors({
    origin: Config.getCorsOrigins(),
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Rotas básicas CRUD
sprints.get("/:id", SprintController.getSprintById);
sprints.post("/", SprintController.createSprint);
sprints.put("/:id", SprintController.updateSprint);
sprints.delete("/:id", SprintController.deleteSprint);

// Rotas por projeto
sprints.get("/project/:projectId", SprintController.getSprintsByProject);

// Rotas de backlog
sprints.get("/:id/backlog", SprintController.getSprintBacklog);
sprints.post("/:id/backlog", SprintController.addStoryToBacklog);
sprints.delete(
  "/:id/backlog/:storyId",
  SprintController.removeStoryFromBacklog
);

// Rotas de métricas
sprints.get("/:id/metrics", SprintController.getSprintMetrics);
sprints.post("/:id/metrics", SprintController.createSprintMetrics);

// Rotas de status
sprints.patch("/:id/start", SprintController.startSprint);
sprints.patch("/:id/complete", SprintController.completeSprint);
sprints.patch("/:id/cancel", SprintController.cancelSprint);

export default sprints;
