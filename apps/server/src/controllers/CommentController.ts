import { Context } from "hono";
import { CommentService } from "../services/CommentService";
import { ApiResponse } from "@shared";

export class CommentController {
  private static commentService = new CommentService();

  // CRUD básico
  static async getAllComments(c: Context) {
    try {
      const comments = await CommentController.commentService.getAllComments();
      return c.json({ success: true, data: comments });
    } catch (error) {
      return c.json(
        { success: false, error: "Erro ao buscar comentários" },
        500
      );
    }
  }

  static async getCommentById(c: Context) {
    try {
      const id = c.req.param("id");
      const comment = await CommentController.commentService.getCommentById(id);

      if (!comment) {
        return c.json(
          { success: false, error: "Comentário não encontrado" },
          404
        );
      }

      return c.json({ success: true, data: comment });
    } catch (error) {
      return c.json(
        { success: false, error: "Erro ao buscar comentário" },
        500
      );
    }
  }

  static async createComment(c: Context) {
    try {
      const data = await c.req.json();
      const comment = await CommentController.commentService.createComment(
        data
      );
      return c.json({ success: true, data: comment }, 201);
    } catch (error) {
      return c.json({ success: false, error: "Erro ao criar comentário" }, 500);
    }
  }

  static async updateComment(c: Context) {
    try {
      const id = c.req.param("id");
      const data = await c.req.json();
      const comment = await CommentController.commentService.updateComment(
        id,
        data
      );

      if (!comment) {
        return c.json(
          { success: false, error: "Comentário não encontrado" },
          404
        );
      }

      return c.json({ success: true, data: comment });
    } catch (error) {
      return c.json(
        { success: false, error: "Erro ao atualizar comentário" },
        500
      );
    }
  }

  static async deleteComment(c: Context) {
    try {
      const id = c.req.param("id");
      const success = await CommentController.commentService.deleteComment(id);

      if (!success) {
        return c.json(
          { success: false, error: "Comentário não encontrado" },
          404
        );
      }

      return c.json({
        success: true,
        message: "Comentário deletado com sucesso",
      });
    } catch (error) {
      return c.json(
        { success: false, error: "Erro ao deletar comentário" },
        500
      );
    }
  }

  // Comentários por tarefa
  static async getCommentsByTask(c: Context) {
    try {
      const taskId = c.req.param("taskId");
      const comments = await CommentController.commentService.getCommentsByTask(
        taskId
      );
      return c.json({ success: true, data: comments });
    } catch (error) {
      return c.json(
        { success: false, error: "Erro ao buscar comentários" },
        500
      );
    }
  }

  // Comentários por usuário
  static async getCommentsByUser(c: Context) {
    try {
      const userId = c.req.param("userId");
      const comments = await CommentController.commentService.getCommentsByUser(
        userId
      );
      return c.json({ success: true, data: comments });
    } catch (error) {
      return c.json(
        { success: false, error: "Erro ao buscar comentários" },
        500
      );
    }
  }

  // Reações
  static async getCommentReactions(c: Context) {
    try {
      const commentId = c.req.param("id");
      const reactions =
        await CommentController.commentService.getCommentReactions(commentId);
      return c.json({ success: true, data: reactions });
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar reações" }, 500);
    }
  }

  static async addReactionToComment(c: Context) {
    try {
      const commentId = c.req.param("id");
      const data = await c.req.json();
      const reaction =
        await CommentController.commentService.addReactionToComment(
          commentId,
          data
        );
      return c.json({ success: true, data: reaction }, 201);
    } catch (error) {
      return c.json({ success: false, error: "Erro ao adicionar reação" }, 500);
    }
  }

  static async removeReactionFromComment(c: Context) {
    try {
      const commentId = c.req.param("id");
      const reactionId = c.req.param("reactionId");
      const success =
        await CommentController.commentService.removeReactionFromComment(
          commentId,
          reactionId
        );

      if (!success) {
        return c.json({ success: false, error: "Reação não encontrada" }, 404);
      }

      return c.json({ success: true, message: "Reação removida com sucesso" });
    } catch (error) {
      return c.json({ success: false, error: "Erro ao remover reação" }, 500);
    }
  }
}
