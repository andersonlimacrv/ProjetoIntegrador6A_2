import { z } from "zod";

// Interface do tenant
export interface Tenant {
  id: string;
  name: string;
  slug: string;
  description?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interface de associação usuário-tenant
export interface UserTenant {
  userId: string;
  tenantId: string;
  status: "active" | "inactive" | "pending";
  joinedAt: Date;
}

// Interface de role
export interface Role {
  id: string;
  tenantId: string;
  name: string;
  displayName: string;
  description?: string;
  isSystemRole: boolean;
  createdAt: Date;
}

// Interface de permissão
export interface Permission {
  id: string;
  roleId: string;
  resource: string;
  action: string;
  conditions?: Record<string, any>;
}

// Interface de atribuição de role
export interface UserRole {
  userTenantId: string;
  roleId: string;
  projectId?: string;
  assignedAt: Date;
}

// Interface de convite
export interface Invitation {
  id: string;
  tenantId: string;
  invitedBy: string;
  email: string;
  roleId: string;
  token: string;
  status: "pending" | "accepted" | "expired" | "cancelled";
  expiresAt: Date;
  createdAt: Date;
  acceptedAt?: Date;
}

// DTOs para operações de tenant
export interface CreateTenantDTO {
  name: string;
  slug: string;
  description?: string;
  avatarUrl?: string;
}

export interface UpdateTenantDTO {
  name?: string;
  slug?: string;
  description?: string;
  avatarUrl?: string;
}

// DTOs para operações de role
export interface CreateRoleDTO {
  tenantId: string;
  name: string;
  displayName: string;
  description?: string;
  isSystemRole?: boolean;
}

export interface UpdateRoleDTO {
  name?: string;
  displayName?: string;
  description?: string;
  isSystemRole?: boolean;
}

// DTOs para operações de convite
export interface CreateInvitationDTO {
  tenantId: string;
  invitedBy: string;
  email: string;
  roleId: string;
}

export interface AcceptInvitationDTO {
  token: string;
  password: string;
  name: string;
}

// Schemas de validação para tenant
export const CreateTenantSchema = z.object({
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
  avatarUrl: z.string().url("URL do avatar inválida").optional(),
});

export const UpdateTenantSchema = z.object({
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
  avatarUrl: z.string().url("URL do avatar inválida").optional(),
});

export const TenantIdSchema = z.object({
  id: z.string().uuid("ID deve ser um UUID válido"),
});

export const TenantSlugSchema = z.object({
  slug: z.string().min(1, "Slug é obrigatório"),
});

// Schemas de validação para role
export const CreateRoleSchema = z.object({
  tenantId: z.string().uuid("ID do tenant deve ser um UUID válido"),
  name: z.string().min(1, "Nome é obrigatório").max(50, "Nome muito longo"),
  displayName: z
    .string()
    .min(1, "Nome de exibição é obrigatório")
    .max(100, "Nome de exibição muito longo"),
  description: z.string().optional(),
  isSystemRole: z.boolean().default(false),
});

export const UpdateRoleSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(50, "Nome muito longo")
    .optional(),
  displayName: z
    .string()
    .min(1, "Nome de exibição é obrigatório")
    .max(100, "Nome de exibição muito longo")
    .optional(),
  description: z.string().optional(),
  isSystemRole: z.boolean().optional(),
});

export const RoleIdSchema = z.object({
  id: z.string().uuid("ID deve ser um UUID válido"),
});

// Schemas de validação para convite
export const CreateInvitationSchema = z.object({
  tenantId: z.string().uuid("ID do tenant deve ser um UUID válido"),
  invitedBy: z.string().uuid("ID do usuário deve ser um UUID válido"),
  email: z.string().email("Email inválido").max(255, "Email muito longo"),
  roleId: z.string().uuid("ID do role deve ser um UUID válido"),
});

export const AcceptInvitationSchema = z.object({
  token: z.string().min(1, "Token é obrigatório"),
  password: z
    .string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .max(255, "Senha muito longa"),
  name: z.string().min(1, "Nome é obrigatório").max(255, "Nome muito longo"),
});

export const InvitationTokenSchema = z.object({
  token: z.string().min(1, "Token é obrigatório"),
});

// Tipos derivados dos schemas
export type CreateTenantInput = z.infer<typeof CreateTenantSchema>;
export type UpdateTenantInput = z.infer<typeof UpdateTenantSchema>;
export type TenantIdInput = z.infer<typeof TenantIdSchema>;
export type TenantSlugInput = z.infer<typeof TenantSlugSchema>;
export type CreateRoleInput = z.infer<typeof CreateRoleSchema>;
export type UpdateRoleInput = z.infer<typeof UpdateRoleSchema>;
export type RoleIdInput = z.infer<typeof RoleIdSchema>;
export type CreateInvitationInput = z.infer<typeof CreateInvitationSchema>;
export type AcceptInvitationInput = z.infer<typeof AcceptInvitationSchema>;
export type InvitationTokenInput = z.infer<typeof InvitationTokenSchema>;
