import { Comment, ApiResponse } from "../../../packages/shared/src";
import { CommentRepository } from "../repositories/CommentRepository";

export class CommentService {
  private commentRepository = new CommentRepository();

  async getAllComments(): Promise<ApiResponse<Comment[]>> {
    try {
      const comments = await this.commentRepository.getAll();
      return {
        success: true,
        data: comments,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro ao buscar comentários",
      };
    }
  }

  async getCommentById(id: string): Promise<Comment | null> {
    return this.commentRepository.getById(id);
  }

  async createComment(data: Partial<Comment>): Promise<Comment> {
    // TODO: Implementar validações de negócio
    return this.commentRepository.create(data);
  }

  async updateComment(
    id: string,
    data: Partial<Comment>
  ): Promise<Comment | null> {
    // TODO: Implementar validações de negócio
    return this.commentRepository.update(id, data);
  }

  async deleteComment(id: string): Promise<boolean> {
    // TODO: Implementar validações de negócio
    return this.commentRepository.delete(id);
  }

  async getCommentsByTask(taskId: string): Promise<Comment[]> {
    // TODO: Implementar busca por tarefa
    return [];
  }

  async getCommentsByUser(userId: string): Promise<Comment[]> {
    // TODO: Implementar busca por usuário
    return [];
  }

  async getCommentReactions(commentId: string): Promise<any[]> {
    // TODO: Implementar busca de reações
    return [];
  }

  async addReactionToComment(commentId: string, data: any): Promise<any> {
    // TODO: Implementar adição de reação
    return {};
  }

  async removeReactionFromComment(
    commentId: string,
    reactionId: string
  ): Promise<boolean> {
    // TODO: Implementar remoção de reação
    return true;
  }
}
