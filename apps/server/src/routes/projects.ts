import { Hono } from "hono";
import { cors } from "hono/cors";
import { ProjectController } from "../controllers/ProjectController";
import { Config } from "../config";

const projects = new Hono();

// Middleware CORS
projects.use(
  "*",
  cors({
    origin: Config.getCorsOrigins(),
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Rotas básicas CRUD
projects.get("/", ProjectController.getAllProjects);
projects.get("/:id", ProjectController.getProjectById);
projects.get("/slug/:slug", ProjectController.getProjectBySlug);
projects.post("/", ProjectController.createProject);
projects.put("/:id", ProjectController.updateProject);
projects.delete("/:id", ProjectController.deleteProject);

// Rotas por tenant
projects.get("/tenant/:tenantId", ProjectController.getProjectsByTenant);
projects.get("/owner/:ownerId", ProjectController.getProjectsByOwner);

// Rotas de equipes
projects.get("/:id/teams", ProjectController.getProjectTeams);
projects.post("/:id/teams/:teamId", ProjectController.addTeamToProject);
projects.delete("/:id/teams/:teamId", ProjectController.removeTeamFromProject);

// Rotas de configurações
projects.get("/:id/settings", ProjectController.getProjectSettings);
projects.post("/:id/settings", ProjectController.createProjectSettings);
projects.put("/:id/settings", ProjectController.updateProjectSettings);

// Rotas de etiquetas
projects.get("/:id/labels", ProjectController.getProjectLabels);
projects.post("/:id/labels", ProjectController.createProjectLabel);
projects.put("/:id/labels/:labelId", ProjectController.updateProjectLabel);
projects.delete("/:id/labels/:labelId", ProjectController.deleteProjectLabel);

// Rotas de fluxos de status
projects.get("/:id/status-flows", ProjectController.getProjectStatusFlows);
projects.post("/:id/status-flows", ProjectController.createStatusFlow);

export default projects; 