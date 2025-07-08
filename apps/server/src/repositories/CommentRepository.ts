import { Comment as CommentModel } from "@shared";
import { db } from "../db/connection";
import { comments, tasks, users } from "../db/schema";
import { eq, and, desc, asc } from "drizzle-orm";

export class CommentRepository {
  async getAll(): Promise<CommentModel[]> {
    const results = await db
      .select()
      .from(comments)
      .orderBy(desc(comments.createdAt));
    return results as CommentModel[];
  }

  async getById(id: string): Promise<CommentModel | null> {
    const [comment] = await db
      .select()
      .from(comments)
      .where(eq(comments.id, id));
    return (comment as CommentModel) || null;
  }

  async create(data: Partial<CommentModel>): Promise<CommentModel> {
    const [comment] = await db
      .insert(comments)
      .values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    if (!comment) {
      throw new Error("Falha ao criar comentário");
    }

    return comment as CommentModel;
  }

  async update(
    id: string,
    data: Partial<CommentModel>
  ): Promise<CommentModel | null> {
    const [comment] = await db
      .update(comments)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(comments.id, id))
      .returning();
    return (comment as CommentModel) || null;
  }

  async delete(id: string): Promise<boolean> {
    try {
      const [deleted] = await db
        .delete(comments)
        .where(eq(comments.id, id))
        .returning();
      return !!deleted;
    } catch (error) {
      throw error;
    }
  }

  async getCommentsByTask(taskId: string): Promise<CommentModel[]> {
    const results = await db
      .select()
      .from(comments)
      .where(eq(comments.taskId, taskId))
      .orderBy(asc(comments.createdAt));
    return results as CommentModel[];
  }

  async getCommentsByUser(userId: string): Promise<CommentModel[]> {
    const results = await db
      .select()
      .from(comments)
      .where(eq(comments.userId, userId))
      .orderBy(desc(comments.createdAt));
    return results as CommentModel[];
  }

  async getCommentReactions(commentId: string): Promise<any[]> {
    // TODO: Implementar quando tivermos tabela de reações
    return [];
  }

  async addReactionToComment(commentId: string, data: any): Promise<any> {
    // TODO: Implementar quando tivermos tabela de reações
    return {};
  }

  async removeReactionFromComment(
    commentId: string,
    reactionId: string
  ): Promise<boolean> {
    // TODO: Implementar quando tivermos tabela de reações
    return true;
  }
}
