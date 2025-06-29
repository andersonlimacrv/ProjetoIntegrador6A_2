// Types
export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDTO {
  name: string;
  email: string;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

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

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Schemas
import { z } from "zod";

export const UserSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateUserSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
});

export const UpdateUserSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").optional(),
  email: z.string().email("Email inválido").optional(),
});

export const TaskSchema = z.object({
  id: z.number(),
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  completed: z.boolean(),
  userId: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

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

// Utils
export const greet = (name: string) => `Hello, ${name}!`;

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const generateId = (): number => {
  return Math.floor(Math.random() * 1000000);
};

// Tipos compartilhados
export * from "./types/user";
export * from "./types/task";

// Utilitários compartilhados
export * from "./utils";
