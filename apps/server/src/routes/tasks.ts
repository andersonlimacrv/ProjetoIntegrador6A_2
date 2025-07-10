import { Hono } from "hono";
import { cors } from "hono/cors";
import { TaskController } from "../controllers/TaskController";
import { Config } from "../config";
import { ApiResponse } from "@shared";

const tasks = new Hono();
const taskController = new TaskController();

// Middleware CORS
tasks.use(
  "*",
  cors({
    origin: Config.getCorsOrigins(),
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Rotas básicas CRUD
tasks.get("/", TaskController.getAllTasks);
tasks.get("/:id", TaskController.getTaskById);
tasks.get("/:id/details", TaskController.getTaskByIdWithDetails);
tasks.post("/", TaskController.createTask);
tasks.put("/:id", TaskController.updateTask);
tasks.delete("/:id", TaskController.deleteTask);

// Rotas por projeto
tasks.get("/project/:projectId", TaskController.getTasksByProject);

// Rotas por história de usuário
tasks.get("/story/:storyId", (c) => taskController.getTasksByStory(c));

// Rotas por responsável
tasks.get("/assignee/:assigneeId", (c) => taskController.getTasksByAssignee(c));

// Rotas por reporter
tasks.get("/reporter/:reporterId", (c) => taskController.getTasksByReporter(c));

// Rotas por status
tasks.get("/status/:statusId", (c) => taskController.getTasksByStatus(c));

// Rotas por prioridade
tasks.get("/priority/:priority", (c) => taskController.getTasksByPriority(c));

// Rotas de atribuições
tasks.post("/:id/assign/:userId", (c) => taskController.assignTask(c));
tasks.delete("/:id/assign/:userId", (c) => taskController.unassignTask(c));
tasks.get("/:id/assignments", (c) => taskController.getTaskAssignments(c));

// Rotas de etiquetas
tasks.get("/:id/labels", (c) => taskController.getTaskLabels(c));
tasks.post("/:id/labels/:labelId", (c) => taskController.addLabelToTask(c));
tasks.delete("/:id/labels/:labelId", (c) =>
  taskController.removeLabelFromTask(c)
);

// Rotas de anexos
tasks.get("/:id/attachments", (c) => taskController.getTaskAttachments(c));
tasks.post("/:id/attachments", (c) => taskController.addAttachmentToTask(c));
tasks.delete("/:id/attachments/:attachmentId", (c) =>
  taskController.removeAttachmentFromTask(c)
);

// Rotas de dependências
tasks.get("/:id/dependencies", (c) => taskController.getTaskDependencies(c));
tasks.post("/:id/dependencies", (c) => taskController.addDependencyToTask(c));
tasks.delete("/:id/dependencies/:dependencyId", (c) =>
  taskController.removeDependencyFromTask(c)
);

// Rotas de comentários
tasks.get("/:id/comments", (c) => taskController.getTaskComments(c));
tasks.post("/:id/comments", (c) => taskController.addCommentToTask(c));

// Rotas de tempo
tasks.get("/overdue", (c) => taskController.getOverdueTasks(c));
tasks.patch("/:id/time", (c) => taskController.updateTaskTime(c));

// Rotas de sprint
tasks.get("/sprint/:sprintId", (c) => taskController.getTasksBySprint(c));

export default tasks;
