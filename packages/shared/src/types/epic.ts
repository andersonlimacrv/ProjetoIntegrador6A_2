import { z } from "zod";

// Interface do épico
export interface Epic {
  id: string;
  projectId: string;
  statusId: string;
  name: string;
  description?: string;
  priority: number;
  storyPoints?: number;
  assigneeId?: string;
  startDate?: Date;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// DTOs para operações de épico
export interface CreateEpicDTO {
  projectId: string;
  statusId: string;
  name: string;
  description?: string;
  priority?: number;
  storyPoints?: number;
  assigneeId?: string;
  startDate?: Date;
  dueDate?: Date;
}

export interface UpdateEpicDTO {
  statusId?: string;
  name?: string;
  description?: string;
  priority?: number;
  storyPoints?: number;
  assigneeId?: string;
  startDate?: Date;
  dueDate?: Date;
}

// Schemas de validação para épico
export const CreateEpicSchema = z.object({
  projectId: z.string().uuid("ID do projeto deve ser um UUID válido"),
  statusId: z.string().uuid("ID do status deve ser um UUID válido"),
  name: z.string().min(1, "Nome é obrigatório").max(255, "Nome muito longo"),
  description: z.string().optional(),
  priority: z
    .number()
    .int()
    .min(1, "Prioridade deve ser pelo menos 1")
    .max(5, "Prioridade deve ser no máximo 5")
    .default(3),
  storyPoints: z
    .number()
    .int()
    .min(0, "Pontos de história devem ser não negativos")
    .optional(),
  assigneeId: z
    .string()
    .uuid("ID do responsável deve ser um UUID válido")
    .optional(),
  startDate: z.date().optional(),
  dueDate: z.date().optional(),
});

export const UpdateEpicSchema = z.object({
  statusId: z.string().uuid("ID do status deve ser um UUID válido").optional(),
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(255, "Nome muito longo")
    .optional(),
  description: z.string().optional(),
  priority: z
    .number()
    .int()
    .min(1, "Prioridade deve ser pelo menos 1")
    .max(5, "Prioridade deve ser no máximo 5")
    .optional(),
  storyPoints: z
    .number()
    .int()
    .min(0, "Pontos de história devem ser não negativos")
    .optional(),
  assigneeId: z
    .string()
    .uuid("ID do responsável deve ser um UUID válido")
    .optional(),
  startDate: z.date().optional(),
  dueDate: z.date().optional(),
});

export const EpicIdSchema = z.object({
  id: z.string().uuid("ID deve ser um UUID válido"),
});

// Tipos derivados dos schemas
export type CreateEpicInput = z.infer<typeof CreateEpicSchema>;
export type UpdateEpicInput = z.infer<typeof UpdateEpicSchema>;
export type EpicIdInput = z.infer<typeof EpicIdSchema>;
