import { Hono } from "hono";
import { cors } from "hono/cors";
import { CommentController } from "../controllers/CommentController";
import { Config } from "../config";

const comments = new Hono();

// Middleware CORS
comments.use(
  "*",
  cors({
    origin: Config.getCorsOrigins(),
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Rotas básicas CRUD
comments.get("/", CommentController.getAllComments);
comments.get("/:id", CommentController.getCommentById);
comments.post("/", CommentController.createComment);
comments.put("/:id", CommentController.updateComment);
comments.delete("/:id", CommentController.deleteComment);

// Rotas por tarefa
comments.get("/task/:taskId", CommentController.getCommentsByTask);

// Rotas por usuário
comments.get("/user/:userId", CommentController.getCommentsByUser);

// Rotas de reações
comments.get("/:id/reactions", CommentController.getCommentReactions);
comments.post("/:id/reactions", CommentController.addReactionToComment);
comments.delete(
  "/:id/reactions/:reactionId",
  CommentController.removeReactionFromComment
);

export default comments;
