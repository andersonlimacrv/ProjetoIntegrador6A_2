import { z } from "zod";

// Interface da história de usuário
export interface UserStory {
  id: string;
  epicId?: string;
  projectId: string;
  statusId: string;
  title: string;
  description?: string;
  acceptanceCriteria?: string;
  storyPoints?: number;
  priority: number;
  assigneeId?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// DTOs para operações de história de usuário
export interface CreateUserStoryDTO {
  epicId?: string;
  projectId: string;
  statusId: string;
  title: string;
  description?: string;
  acceptanceCriteria?: string;
  storyPoints?: number;
  priority?: number;
  assigneeId?: string;
  dueDate?: Date;
}

export interface UpdateUserStoryDTO {
  epicId?: string;
  statusId?: string;
  title?: string;
  description?: string;
  acceptanceCriteria?: string;
  storyPoints?: number;
  priority?: number;
  assigneeId?: string;
  dueDate?: Date;
}

// Schemas de validação para história de usuário
export const CreateUserStorySchema = z.object({
  epicId: z.string().uuid("ID do épico deve ser um UUID válido").optional(),
  projectId: z.string().uuid("ID do projeto deve ser um UUID válido"),
  statusId: z.string().uuid("ID do status deve ser um UUID válido"),
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .max(255, "Título muito longo"),
  description: z.string().optional(),
  acceptanceCriteria: z.string().optional(),
  storyPoints: z
    .number()
    .int()
    .min(0, "Pontos de história devem ser não negativos")
    .optional(),
  priority: z
    .number()
    .int()
    .min(1, "Prioridade deve ser pelo menos 1")
    .max(5, "Prioridade deve ser no máximo 5")
    .default(3),
  assigneeId: z
    .string()
    .uuid("ID do responsável deve ser um UUID válido")
    .optional(),
  dueDate: z.date().optional(),
});

export const UpdateUserStorySchema = z.object({
  epicId: z.string().uuid("ID do épico deve ser um UUID válido").optional(),
  statusId: z.string().uuid("ID do status deve ser um UUID válido").optional(),
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .max(255, "Título muito longo")
    .optional(),
  description: z.string().optional(),
  acceptanceCriteria: z.string().optional(),
  storyPoints: z
    .number()
    .int()
    .min(0, "Pontos de história devem ser não negativos")
    .optional(),
  priority: z
    .number()
    .int()
    .min(1, "Prioridade deve ser pelo menos 1")
    .max(5, "Prioridade deve ser no máximo 5")
    .optional(),
  assigneeId: z
    .string()
    .uuid("ID do responsável deve ser um UUID válido")
    .optional(),
  dueDate: z.date().optional(),
});

export const UserStoryIdSchema = z.object({
  id: z.string().uuid("ID deve ser um UUID válido"),
});

// Tipos derivados dos schemas
export type CreateUserStoryInput = z.infer<typeof CreateUserStorySchema>;
export type UpdateUserStoryInput = z.infer<typeof UpdateUserStorySchema>;
export type UserStoryIdInput = z.infer<typeof UserStoryIdSchema>;
