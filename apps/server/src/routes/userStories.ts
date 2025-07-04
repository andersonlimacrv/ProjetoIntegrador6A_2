import { Hono } from "hono";
import { cors } from "hono/cors";
import { UserStoryController } from "../controllers/UserStoryController";
import { Config } from "../config";

const userStories = new Hono();

// Middleware CORS
userStories.use(
  "*",
  cors({
    origin: Config.getCorsOrigins(),
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Rotas básicas CRUD
userStories.get("/", UserStoryController.getAllUserStories);
userStories.get("/:id", UserStoryController.getUserStoryById);
userStories.post("/", UserStoryController.createUserStory);
userStories.put("/:id", UserStoryController.updateUserStory);
userStories.delete("/:id", UserStoryController.deleteUserStory);

// Rotas por projeto
userStories.get(
  "/project/:projectId",
  UserStoryController.getUserStoriesByProject
);

// Rotas por épico
userStories.get("/epic/:epicId", UserStoryController.getUserStoriesByEpic);

// Rotas de tarefas
userStories.get("/:id/tasks", UserStoryController.getUserStoryTasks);

// Rotas de status
userStories.patch(
  "/:id/status/:statusId",
  UserStoryController.updateUserStoryStatus
);

// Rotas de sprint
userStories.post("/:id/sprint/:sprintId", UserStoryController.addToSprint);
userStories.delete("/:id/sprint", UserStoryController.removeFromSprint);

export default userStories;
