import { z } from "zod";

// Interface do sprint
export interface Sprint {
  id: string;
  projectId: string;
  name: string;
  goal?: string;
  startDate: Date;
  endDate: Date;
  status: "planned" | "active" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

// Interface do item do backlog do sprint
export interface SprintBacklogItem {
  sprintId: string;
  storyId: string;
  order: number;
  addedAt: Date;
}

// Interface das métricas do sprint
export interface SprintMetric {
  sprintId: string;
  plannedPoints: number;
  completedPoints: number;
  totalTasks: number;
  completedTasks: number;
  velocity?: number;
  calculatedAt: Date;
}

// DTOs para operações de sprint
export interface CreateSprintDTO {
  projectId: string;
  name: string;
  goal?: string;
  startDate: Date;
  endDate: Date;
}

export interface UpdateSprintDTO {
  name?: string;
  goal?: string;
  startDate?: Date;
  endDate?: Date;
  status?: "planned" | "active" | "completed" | "cancelled";
}

// DTOs para operações de backlog
export interface AddStoryToSprintDTO {
  sprintId: string;
  storyId: string;
  order?: number;
}

export interface RemoveStoryFromSprintDTO {
  sprintId: string;
  storyId: string;
}

// DTOs para operações de métricas
export interface CreateSprintMetricDTO {
  sprintId: string;
  plannedPoints: number;
  completedPoints: number;
  totalTasks: number;
  completedTasks: number;
  velocity?: number;
}

// Schemas de validação para sprint
export const CreateSprintSchema = z
  .object({
    projectId: z.string().uuid("ID do projeto deve ser um UUID válido"),
    name: z.string().min(1, "Nome é obrigatório").max(255, "Nome muito longo"),
    goal: z.string().optional(),
    startDate: z.date(),
    endDate: z.date(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "Data de término deve ser posterior à data de início",
    path: ["endDate"],
  });

export const UpdateSprintSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(255, "Nome muito longo")
    .optional(),
  goal: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  status: z.enum(["planned", "active", "completed", "cancelled"]).optional(),
});

export const SprintIdSchema = z.object({
  id: z.string().uuid("ID deve ser um UUID válido"),
});

// Schemas de validação para backlog
export const AddStoryToSprintSchema = z.object({
  sprintId: z.string().uuid("ID do sprint deve ser um UUID válido"),
  storyId: z.string().uuid("ID da história deve ser um UUID válido"),
  order: z.number().int().min(0, "Ordem deve ser não negativa").optional(),
});

export const RemoveStoryFromSprintSchema = z.object({
  sprintId: z.string().uuid("ID do sprint deve ser um UUID válido"),
  storyId: z.string().uuid("ID da história deve ser um UUID válido"),
});

// Schemas de validação para métricas
export const CreateSprintMetricSchema = z.object({
  sprintId: z.string().uuid("ID do sprint deve ser um UUID válido"),
  plannedPoints: z
    .number()
    .int()
    .min(0, "Pontos planejados devem ser não negativos"),
  completedPoints: z
    .number()
    .int()
    .min(0, "Pontos completados devem ser não negativos"),
  totalTasks: z.number().int().min(0, "Total de tarefas deve ser não negativo"),
  completedTasks: z
    .number()
    .int()
    .min(0, "Tarefas completadas devem ser não negativas"),
  velocity: z.number().min(0, "Velocidade deve ser não negativa").optional(),
});

// Tipos derivados dos schemas
export type CreateSprintInput = z.infer<typeof CreateSprintSchema>;
export type UpdateSprintInput = z.infer<typeof UpdateSprintSchema>;
export type SprintIdInput = z.infer<typeof SprintIdSchema>;

export type AddStoryToSprintInput = z.infer<typeof AddStoryToSprintSchema>;
export type RemoveStoryFromSprintInput = z.infer<
  typeof RemoveStoryFromSprintSchema
>;

export type CreateSprintMetricInput = z.infer<typeof CreateSprintMetricSchema>;
