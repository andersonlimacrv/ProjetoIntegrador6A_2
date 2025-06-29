import { z } from "zod";

// Interface base da task
export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

// DTOs para operações
export interface CreateTaskDTO {
  title: string;
  description?: string;
  userId: number;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  completed?: boolean;
}

// Schemas de validação
export const CreateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .max(200, "Título muito longo"),
  description: z.string().max(1000, "Descrição muito longa").optional(),
  userId: z.number().int().positive("ID do usuário deve ser positivo"),
});

export const UpdateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .max(200, "Título muito longo")
    .optional(),
  description: z.string().max(1000, "Descrição muito longa").optional(),
  completed: z.boolean().optional(),
});

export const TaskIdSchema = z.object({
  id: z.coerce.number().int().positive("ID deve ser um número positivo"),
});

// Tipos derivados dos schemas
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type TaskIdInput = z.infer<typeof TaskIdSchema>;
