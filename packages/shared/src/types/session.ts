import { z } from "zod";

// Interface da sessão
export interface Session {
  id: string;
  userId: string;
  tokenHash: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: Date;
  createdAt: Date;
}

// DTOs para operações de sessão
export interface CreateSessionDTO {
  userId: string;
  tokenHash: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: Date;
}

// Schemas de validação para sessão
export const CreateSessionSchema = z.object({
  userId: z.string().uuid("ID do usuário deve ser um UUID válido"),
  tokenHash: z.string().min(1, "Hash do token é obrigatório"),
  ipAddress: z.string().ip("Endereço IP inválido").optional(),
  userAgent: z.string().optional(),
  expiresAt: z.date(),
});

export const SessionIdSchema = z.object({
  id: z.string().uuid("ID deve ser um UUID válido"),
});

// Tipos derivados dos schemas
export type CreateSessionInput = z.infer<typeof CreateSessionSchema>;
export type SessionIdInput = z.infer<typeof SessionIdSchema>;
