import { Hono } from "hono";
import { cors } from "hono/cors";
import { EpicController } from "../controllers/EpicController";
import { Config } from "../config";

const epics = new Hono();

// Middleware CORS
epics.use(
  "*",
  cors({
    origin: Config.getCorsOrigins(),
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Rotas básicas CRUD
epics.get("/", EpicController.getAllEpics);
epics.get("/:id", EpicController.getEpicById);
epics.post("/", EpicController.createEpic);
epics.put("/:id", EpicController.updateEpic);
epics.delete("/:id", EpicController.deleteEpic);

// Rotas por projeto
epics.get("/project/:projectId", EpicController.getEpicsByProject);

// Rotas de histórias de usuário
epics.get("/:id/stories", EpicController.getEpicStories);

// Rotas de status
epics.patch("/:id/status/:statusId", EpicController.updateEpicStatus);

export default epics;
