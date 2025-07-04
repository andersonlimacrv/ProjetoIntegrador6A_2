import { z } from "zod";

// Interface da atividade
export interface Activity {
  id: string;
  userId: string;
  tenantId: string;
  action: string;
  entityType: "task" | "story" | "epic" | "project";
  entityId: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  createdAt: Date;
}

// DTOs para operações de atividade
export interface CreateActivityDTO {
  userId: string;
  tenantId: string;
  action: string;
  entityType: "task" | "story" | "epic" | "project";
  entityId: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
}

// Schemas de validação para atividade
export const CreateActivitySchema = z.object({
  userId: z.string().uuid("ID do usuário deve ser um UUID válido"),
  tenantId: z.string().uuid("ID do tenant deve ser um UUID válido"),
  action: z.string().min(1, "Ação é obrigatória").max(100, "Ação muito longa"),
  entityType: z.enum(["task", "story", "epic", "project"], {
    errorMap: () => ({
      message: "Tipo de entidade deve ser task, story, epic ou project",
    }),
  }),
  entityId: z.string().uuid("ID da entidade deve ser um UUID válido"),
  oldValues: z.record(z.any()).optional(),
  newValues: z.record(z.any()).optional(),
});

export const ActivityIdSchema = z.object({
  id: z.string().uuid("ID deve ser um UUID válido"),
});

// Tipos derivados dos schemas
export type CreateActivityInput = z.infer<typeof CreateActivitySchema>;
export type ActivityIdInput = z.infer<typeof ActivityIdSchema>;
