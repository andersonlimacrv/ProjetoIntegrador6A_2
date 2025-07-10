import { z } from "zod";

export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  REVIEW = "REVIEW",
  DONE = "DONE",
  CANCELLED = "CANCELLED",
}

export interface Status {
  id: string;
  flowId: string;
  name: string;
  color: string;
  order: number;
  isFinal: boolean;
  isInitial: boolean;
}

// DTOs para operações de fluxo de status
export interface CreateStatusFlowDTO {
  projectId: string;
  name: string;
  entityType: "task" | "story" | "epic";
  isDefault?: boolean;
}

export interface UpdateStatusFlowDTO {
  name?: string;
  entityType?: "task" | "story" | "epic";
  isDefault?: boolean;
}

// DTOs para operações de status
export interface CreateStatusDTO {
  flowId: string;
  name: string;
  color: string;
  order: number;
  isFinal?: boolean;
  isInitial?: boolean;
}

export interface UpdateStatusDTO {
  name?: string;
  color?: string;
  order?: number;
  isFinal?: boolean;
  isInitial?: boolean;
}

// Schemas de validação para fluxo de status
export const CreateStatusFlowSchema = z.object({
  projectId: z.string().uuid("ID do projeto deve ser um UUID válido"),
  name: z.string().min(1, "Nome é obrigatório").max(255, "Nome muito longo"),
  entityType: z.enum(["task", "story", "epic"], {
    errorMap: () => ({
      message: "Tipo de entidade deve ser task, story ou epic",
    }),
  }),
  isDefault: z.boolean().default(false),
});

export const UpdateStatusFlowSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(255, "Nome muito longo")
    .optional(),
  entityType: z
    .enum(["task", "story", "epic"], {
      errorMap: () => ({
        message: "Tipo de entidade deve ser task, story ou epic",
      }),
    })
    .optional(),
  isDefault: z.boolean().optional(),
});

export const StatusFlowIdSchema = z.object({
  id: z.string().uuid("ID deve ser um UUID válido"),
});

// Schemas de validação para status
export const CreateStatusSchema = z.object({
  flowId: z.string().uuid("ID do fluxo deve ser um UUID válido"),
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Cor deve ser um código hexadecimal válido"),
  order: z.number().int().min(0, "Ordem deve ser não negativa"),
  isFinal: z.boolean().default(false),
  isInitial: z.boolean().default(false),
});

export const UpdateStatusSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome muito longo")
    .optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Cor deve ser um código hexadecimal válido")
    .optional(),
  order: z.number().int().min(0, "Ordem deve ser não negativa").optional(),
  isFinal: z.boolean().optional(),
  isInitial: z.boolean().optional(),
});

export const StatusIdSchema = z.object({
  id: z.string().uuid("ID deve ser um UUID válido"),
});

// Tipos derivados dos schemas
export type CreateStatusFlowInput = z.infer<typeof CreateStatusFlowSchema>;
export type UpdateStatusFlowInput = z.infer<typeof UpdateStatusFlowSchema>;
export type StatusFlowIdInput = z.infer<typeof StatusFlowIdSchema>;

export type CreateStatusInput = z.infer<typeof CreateStatusSchema>;
export type UpdateStatusInput = z.infer<typeof UpdateStatusSchema>;
export type StatusIdInput = z.infer<typeof StatusIdSchema>;
