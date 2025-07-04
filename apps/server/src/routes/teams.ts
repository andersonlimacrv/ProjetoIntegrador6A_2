import { Hono } from "hono";
import { cors } from "hono/cors";
import { TeamController } from "../controllers/TeamController";
import { Config } from "../config";

const teams = new Hono();

// Middleware CORS
teams.use(
  "*",
  cors({
    origin: Config.getCorsOrigins(),
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Rotas básicas CRUD
teams.get("/", TeamController.getAllTeams);
teams.get("/:id", TeamController.getTeamById);
teams.post("/", TeamController.createTeam);
teams.put("/:id", TeamController.updateTeam);
teams.delete("/:id", TeamController.deleteTeam);

// Rotas por tenant
teams.get("/tenant/:tenantId", TeamController.getTeamsByTenant);

// Rotas de membros
teams.get("/:id/members", TeamController.getTeamMembers);
teams.post("/:id/members/:userId", TeamController.addMemberToTeam);
teams.put("/:id/members/:userId", TeamController.updateMemberRole);
teams.delete("/:id/members/:userId", TeamController.removeMemberFromTeam);

// Rotas de projetos
teams.get("/:id/projects", TeamController.getTeamProjects);

export default teams;
