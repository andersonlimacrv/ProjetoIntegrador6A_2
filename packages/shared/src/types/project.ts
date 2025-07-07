import { z } from "zod";

// Interface base do projeto
export interface Project {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  description?: string;
  projectKey: string;
  status: "active" | "archived" | "completed";
  ownerId: string;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Interface da equipe
export interface Team {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interface de associação usuário-equipe
export interface UserTeam {
  userId: string;
  teamId: string;
  role: "leader" | "member";
  joinedAt: Date;
}

// Interface de associação equipe-projeto
export interface TeamProject {
  teamId: string;
  projectId: string;
  assignedAt: Date;
}

// Interface das configurações do projeto
export interface ProjectSetting {
  projectId: string;
  sprintLengthDays: number;
  enableTimeTracking: boolean;
  defaultStoryPoints: string;
  notificationSettings?: Record<string, any>;
  updatedAt: Date;
}

// Interface das etiquetas do projeto
export interface ProjectLabel {
  id: string;
  projectId: string;
  name: string;
  color: string;
  description?: string;
  createdAt: Date;
}

// DTOs para operações de projeto
export interface CreateProjectDTO {
  tenantId: string;
  name: string;
  slug: string;
  description?: string;
  projectKey: string;
  ownerId: string;
  startDate?: Date;
  endDate?: Date;
}

export interface UpdateProjectDTO {
  name?: string;
  slug?: string;
  description?: string;
  projectKey?: string;
  status?: "active" | "archived" | "completed";
  startDate?: Date;
  endDate?: Date;
}

// DTOs para operações de equipe
export interface CreateTeamDTO {
  tenantId: string;
  name: string;
  description?: string;
}

export interface UpdateTeamDTO {
  name?: string;
  description?: string;
}

// DTOs para operações de configurações
export interface CreateProjectSettingDTO {
  projectId: string;
  sprintLengthDays: number;
  enableTimeTracking: boolean;
  defaultStoryPoints: string;
  notificationSettings?: Record<string, any>;
}

export interface UpdateProjectSettingDTO {
  sprintLengthDays?: number;
  enableTimeTracking?: boolean;
  defaultStoryPoints?: string;
  notificationSettings?: Record<string, any>;
}

// DTOs para operações de etiquetas
export interface CreateProjectLabelDTO {
  projectId: string;
  name: string;
  color: string;
  description?: string;
}

export interface UpdateProjectLabelDTO {
  name?: string;
  color?: string;
  description?: string;
}

// Schemas de validação para projeto
export const CreateProjectSchema = z.object({
  tenantId: z.string().uuid("ID do tenant deve ser um UUID válido"),
  name: z.string().min(1, "Nome é obrigatório").max(255, "Nome muito longo"),
  slug: z
    .string()
    .min(1, "Slug é obrigatório")
    .max(100, "Slug muito longo")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug deve conter apenas letras minúsculas, números e hífens"
    ),
  description: z.string().optional(),
  projectKey: z
    .string()
    .min(1, "Chave do projeto é obrigatória")
    .max(10, "Chave do projeto muito longa")
    .regex(
      /^[A-Z0-9]+$/,
      "Chave deve conter apenas letras maiúsculas e números"
    ),
  ownerId: z.string().uuid("ID do proprietário deve ser um UUID válido"),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export const UpdateProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(255, "Nome muito longo")
    .optional(),
  slug: z
    .string()
    .min(1, "Slug é obrigatório")
    .max(100, "Slug muito longo")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug deve conter apenas letras minúsculas, números e hífens"
    )
    .optional(),
  description: z.string().optional(),
  projectKey: z
    .string()
    .min(1, "Chave do projeto é obrigatória")
    .max(10, "Chave do projeto muito longa")
    .regex(
      /^[A-Z0-9]+$/,
      "Chave do projeto deve conter apenas letras maiúsculas e números"
    )
    .optional(),
  status: z.enum(["active", "archived", "completed"]).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export const ProjectIdSchema = z.object({
  id: z.string().uuid("ID deve ser um UUID válido"),
});

export const ProjectSlugSchema = z.object({
  slug: z.string().min(1, "Slug é obrigatório"),
});

// Schemas de validação para equipe
export const CreateTeamSchema = z.object({
  tenantId: z.string().uuid("ID do tenant deve ser um UUID válido"),
  name: z.string().min(1, "Nome é obrigatório").max(255, "Nome muito longo"),
  description: z.string().optional(),
});

export const UpdateTeamSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(255, "Nome muito longo")
    .optional(),
  description: z.string().optional(),
});

export const TeamIdSchema = z.object({
  id: z.string().uuid("ID deve ser um UUID válido"),
});

// Schemas de validação para configurações
export const CreateProjectSettingSchema = z.object({
  projectId: z.string().uuid("ID do projeto deve ser um UUID válido"),
  sprintLengthDays: z.number().int().min(1),
  enableTimeTracking: z.boolean(),
  defaultStoryPoints: z.string(),
  notificationSettings: z.record(z.any()).optional(),
});

export const UpdateProjectSettingSchema = z.object({
  sprintLengthDays: z.number().int().min(1).optional(),
  enableTimeTracking: z.boolean().optional(),
  defaultStoryPoints: z.string().optional(),
  notificationSettings: z.record(z.any()).optional(),
});

// Schemas de validação para etiquetas
export const CreateProjectLabelSchema = z.object({
  projectId: z.string().uuid("ID do projeto deve ser um UUID válido"),
  name: z.string().min(1, "Nome é obrigatório").max(255, "Nome muito longo"),
  color: z.string().min(1, "Cor é obrigatória").max(20, "Cor muito longa"),
  description: z.string().optional(),
});

export const UpdateProjectLabelSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(255, "Nome muito longo")
    .optional(),
  color: z
    .string()
    .min(1, "Cor é obrigatória")
    .max(20, "Cor muito longa")
    .optional(),
  description: z.string().optional(),
});

export const ProjectLabelIdSchema = z.object({
  id: z.string().uuid("ID da etiqueta deve ser um UUID válido"),
});

// Tipos derivados dos schemas
export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;
export type ProjectIdInput = z.infer<typeof ProjectIdSchema>;
export type ProjectSlugInput = z.infer<typeof ProjectSlugSchema>;
export type CreateTeamInput = z.infer<typeof CreateTeamSchema>;
export type UpdateTeamInput = z.infer<typeof UpdateTeamSchema>;
export type TeamIdInput = z.infer<typeof TeamIdSchema>;
export type CreateProjectSettingInput = z.infer<
  typeof CreateProjectSettingSchema
>;
export type UpdateProjectSettingInput = z.infer<
  typeof UpdateProjectSettingSchema
>;
export type CreateProjectLabelInput = z.infer<typeof CreateProjectLabelSchema>;
export type UpdateProjectLabelInput = z.infer<typeof UpdateProjectLabelSchema>;
export type ProjectLabelIdInput = z.infer<typeof ProjectLabelIdSchema>;
