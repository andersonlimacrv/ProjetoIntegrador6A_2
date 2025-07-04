import { z } from "zod";

// Interface do comentário
export interface Comment {
  id: string;
  content: string;
  userId: string;
  entityType: "task" | "story" | "epic";
  entityId: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// DTOs para operações de comentário
export interface CreateCommentDTO {
  content: string;
  userId: string;
  entityType: "task" | "story" | "epic";
  entityId: string;
  parentId?: string;
}

export interface UpdateCommentDTO {
  content: string;
}

// Schemas de validação para comentário
export const CreateCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Conteúdo é obrigatório")
    .max(10000, "Conteúdo muito longo"),
  userId: z.string().uuid("ID do usuário deve ser um UUID válido"),
  entityType: z.enum(["task", "story", "epic"], {
    errorMap: () => ({
      message: "Tipo de entidade deve ser task, story ou epic",
    }),
  }),
  entityId: z.string().uuid("ID da entidade deve ser um UUID válido"),
  parentId: z
    .string()
    .uuid("ID do comentário pai deve ser um UUID válido")
    .optional(),
});

export const UpdateCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Conteúdo é obrigatório")
    .max(10000, "Conteúdo muito longo"),
});

export const CommentIdSchema = z.object({
  id: z.string().uuid("ID deve ser um UUID válido"),
});

// Tipos derivados dos schemas
export type CreateCommentInput = z.infer<typeof CreateCommentSchema>;
export type UpdateCommentInput = z.infer<typeof UpdateCommentSchema>;
export type CommentIdInput = z.infer<typeof CommentIdSchema>;
