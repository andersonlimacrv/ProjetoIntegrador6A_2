import { z } from "zod";

// Interface base do usuário
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  avatarUrl?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// DTOs para operações de usuário
export interface CreateUserDTO {
  email: string;
  password: string;
  name: string;
  avatarUrl?: string;
}

export interface UpdateUserDTO {
  email?: string;
  name?: string;
  avatarUrl?: string;
  isActive?: boolean;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

// Response padrão da API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Schemas de validação para usuário
export const CreateUserSchema = z.object({
  email: z.string().email("Email inválido").max(255, "Email muito longo"),
  password: z
    .string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .max(255, "Senha muito longa"),
  name: z.string().min(1, "Nome é obrigatório").max(255, "Nome muito longo"),
  avatarUrl: z.string().url("URL do avatar inválida").optional(),
});

export const UpdateUserSchema = z.object({
  email: z
    .string()
    .email("Email inválido")
    .max(255, "Email muito longo")
    .optional(),
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(255, "Nome muito longo")
    .optional(),
  avatarUrl: z.string().url("URL do avatar inválida").optional(),
  isActive: z.boolean().optional(),
});

export const LoginUserSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export const UserIdSchema = z.object({
  id: z.string().uuid("ID deve ser um UUID válido"),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type LoginUserInput = z.infer<typeof LoginUserSchema>;
export type UserIdInput = z.infer<typeof UserIdSchema>;
