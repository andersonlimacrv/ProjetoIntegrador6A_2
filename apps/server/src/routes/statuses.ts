import { Hono } from "hono";
import { StatusController } from "../controllers/StatusController";

const statuses = new Hono();

// GET /api/statuses - Listar todos os status
statuses.get("/", StatusController.getAllStatuses);

// GET /api/statuses/project/:projectId - Buscar status por projeto
statuses.get("/project/:projectId", StatusController.getStatusesByProject);

// GET /api/statuses/:id - Buscar status por ID
statuses.get("/:id", StatusController.getStatusById);

export default statuses;
