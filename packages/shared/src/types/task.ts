import { z } from "zod";

// Interface da tarefa
export interface Task {
  id: string;
  storyId?: string;
  projectId: string;
  statusId: string;
  title: string;
  description?: string;
  priority: number;
  estimatedHours?: number;
  actualHours?: number;
  assigneeId?: string;
  reporterId: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Interface de atribuição de tarefa
export interface TaskAssignment {
  taskId: string;
  userId: string;
  assignedAt: Date;
  unassignedAt?: Date;
}

// Interface da etiqueta da tarefa
export interface TaskLabel {
  taskId: string;
  labelId: string;
}

// Interface do anexo da tarefa
export interface TaskAttachment {
  id: string;
  taskId: string;
  uploadedBy: string;
  filename: string;
  filePath: string;
  mimeType: string;
  fileSize: number;
  createdAt: Date;
}

// Interface da dependência da tarefa
export interface TaskDependency {
  id: string;
  taskId: string;
  dependsOnTaskId: string;
  dependencyType: "blocks" | "depends_on";
  createdAt: Date;
}

// DTOs para operações de tarefa
export interface CreateTaskDTO {
  storyId?: string;
  projectId: string;
  statusId: string;
  title: string;
  description?: string;
  priority?: number;
  estimatedHours?: number;
  assigneeId?: string;
  reporterId: string;
  dueDate?: Date;
}

export interface UpdateTaskDTO {
  storyId?: string;
  statusId?: string;
  title?: string;
  description?: string;
  priority?: number;
  estimatedHours?: number;
  actualHours?: number;
  assigneeId?: string;
  dueDate?: Date;
}

// Schemas de validação para tarefa
export const CreateTaskSchema = z.object({
  storyId: z.string().uuid("ID da história deve ser um UUID válido").optional(),
  projectId: z.string().uuid("ID do projeto deve ser um UUID válido"),
  statusId: z.string().uuid("ID do status deve ser um UUID válido"),
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .max(255, "Título muito longo"),
  description: z.string().optional(),
  priority: z.number().int().min(1).max(5).optional(),
  estimatedHours: z.number().optional(),
  assigneeId: z
    .string()
    .uuid("ID do responsável deve ser um UUID válido")
    .optional(),
  reporterId: z.string().uuid("ID do criador deve ser um UUID válido"),
  dueDate: z.date().optional(),
});

export const UpdateTaskSchema = z.object({
  storyId: z.string().uuid("ID da história deve ser um UUID válido").optional(),
  statusId: z.string().uuid("ID do status deve ser um UUID válido").optional(),
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .max(255, "Título muito longo")
    .optional(),
  description: z.string().optional(),
  priority: z.number().int().min(1).max(5).optional(),
  estimatedHours: z.number().optional(),
  actualHours: z.number().optional(),
  assigneeId: z
    .string()
    .uuid("ID do responsável deve ser um UUID válido")
    .optional(),
  dueDate: z.date().optional(),
});

export const TaskIdSchema = z.object({
  id: z.string().uuid("ID da tarefa deve ser um UUID válido"),
});

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type TaskIdInput = z.infer<typeof TaskIdSchema>;
