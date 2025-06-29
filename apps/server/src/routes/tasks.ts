import { Hono } from "hono";
import {
  TaskController,
  validateCreateTask,
  validateUpdateTask,
  validateTaskId,
} from "../controllers/taskController";

const tasks = new Hono();

// Rotas básicas CRUD
tasks.get("/", TaskController.getAllTasks);
tasks.get("/completed", TaskController.getCompletedTasks);
tasks.get("/pending", TaskController.getPendingTasks);
tasks.get("/user/:userId", TaskController.getTasksByUserId);

// Rotas com validação de ID
tasks.get("/:id", validateTaskId, TaskController.getTaskById);
tasks.get("/:id/with-user", validateTaskId, TaskController.getTaskByIdWithUser);
tasks.put(
  "/:id",
  validateTaskId,
  validateUpdateTask,
  TaskController.updateTask
);
tasks.delete("/:id", validateTaskId, TaskController.deleteTask);

// Rotas específicas de status
tasks.patch(
  "/:id/complete",
  validateTaskId,
  TaskController.markTaskAsCompleted
);
tasks.patch(
  "/:id/incomplete",
  validateTaskId,
  TaskController.markTaskAsIncomplete
);

// Rota de criação (com validação)
tasks.post("/", validateCreateTask, TaskController.createTask);

export default tasks;
