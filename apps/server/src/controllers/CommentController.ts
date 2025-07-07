import { Context } from "hono";
import { CommentService } from "../services/CommentService";
import { ApiResponse } from "@shared";

export class CommentController {
  private static commentService = new CommentService();

  // CRUD básico
  static async getAllComments(c: Context) {
    try {
      const comments = await CommentController.commentService.getAllComments();
      return c.json(
        {
          ...comments,
          message: comments.success
            ? "Comentários listados com sucesso"
            : comments.error || "Erro ao buscar comentários",
        },
        comments.success ? 200 : 400
      );
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
      return c.json(
        {
          ...comment,
          message: comment.success
            ? "Comentário encontrado com sucesso"
            : comment.error || "Comentário não encontrado",
        },
        comment.success ? 200 : 404
      );
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
      return c.json(
        {
          ...comment,
          message: comment.success
            ? "Comentário criado com sucesso"
            : comment.error || "Erro ao criar comentário",
        },
        comment.success ? 201 : 400
      );
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
      return c.json(
        {
          ...comment,
          message: comment.success
            ? "Comentário atualizado com sucesso"
            : comment.error || "Comentário não encontrado",
        },
        comment.success ? 200 : 404
      );
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
      const deleted = await CommentController.commentService.deleteComment(id);
      return c.json(
        {
          ...deleted,
          message: deleted.success
            ? "Comentário deletado com sucesso"
            : deleted.error || "Comentário não encontrado",
        },
        deleted.success ? 200 : 404
      );
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
      return c.json(
        {
          ...comments,
          message: comments.success
            ? "Comentários da tarefa listados com sucesso"
            : comments.error || "Erro ao buscar comentários",
        },
        comments.success ? 200 : 400
      );
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
      return c.json(
        {
          ...comments,
          message: comments.success
            ? "Comentários do usuário listados com sucesso"
            : comments.error || "Erro ao buscar comentários",
        },
        comments.success ? 200 : 400
      );
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
      return c.json(
        {
          ...reactions,
          message: reactions.success
            ? "Reações listadas com sucesso"
            : reactions.error || "Erro ao buscar reações",
        },
        reactions.success ? 200 : 400
      );
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
      return c.json(
        {
          ...reaction,
          message: reaction.success
            ? "Reação adicionada com sucesso"
            : reaction.error || "Erro ao adicionar reação",
        },
        reaction.success ? 201 : 400
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao adicionar reação" }, 500);
    }
  }

  static async removeReactionFromComment(c: Context) {
    try {
      const commentId = c.req.param("id");
      const reactionId = c.req.param("reactionId");
      const removed =
        await CommentController.commentService.removeReactionFromComment(
          commentId,
          reactionId
        );
      return c.json(
        {
          ...removed,
          message: removed.success
            ? "Reação removida com sucesso"
            : removed.error || "Reação não encontrada",
        },
        removed.success ? 200 : 404
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao remover reação" }, 500);
    }
  }
}
