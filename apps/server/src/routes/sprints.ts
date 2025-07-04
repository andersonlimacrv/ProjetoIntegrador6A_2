import { Hono } from "hono";
import { cors } from "hono/cors";
import { SprintController } from "../controllers/SprintController";
import { Config } from "../config";

const sprints = new Hono();
const sprintController = new SprintController();

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
sprints.get("/", (c) => sprintController.getAllSprints(c));
sprints.get("/:id", (c) => sprintController.getSprintById(c));
sprints.post("/", (c) => sprintController.createSprint(c));
sprints.put("/:id", (c) => sprintController.updateSprint(c));
sprints.delete("/:id", (c) => sprintController.deleteSprint(c));

// Rotas por projeto
sprints.get("/project/:projectId", (c) =>
  sprintController.getSprintsByProject(c)
);

// Rotas de backlog
sprints.get("/:id/backlog", (c) => sprintController.getSprintBacklog(c));
sprints.post("/:id/backlog", (c) => sprintController.addStoryToBacklog(c));
sprints.delete("/:id/backlog/:storyId", (c) =>
  sprintController.removeStoryFromBacklog(c)
);

// Rotas de métricas
sprints.get("/:id/metrics", (c) => sprintController.getSprintMetrics(c));
sprints.post("/:id/metrics", (c) => sprintController.createSprintMetrics(c));

// Rotas de status
sprints.patch("/:id/start", (c) => sprintController.startSprint(c));
sprints.patch("/:id/complete", (c) => sprintController.completeSprint(c));
sprints.patch("/:id/cancel", (c) => sprintController.cancelSprint(c));

export default sprints;
