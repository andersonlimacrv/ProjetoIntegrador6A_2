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

// Interface do fluxo de status
export interface StatusFlow {
  id: string;
  projectId: string;
  name: string;
  entityType: "task" | "story" | "epic";
  isDefault: boolean;
  createdAt: Date;
}

// Interface do status
export interface Status {
  id: string;
  flowId: string;
  name: string;
  color: string;
  order: number;
  isFinal: boolean;
  isInitial: boolean;
}

// Interface do épico
export interface Epic {
  id: string;
  projectId: string;
  statusId: string;
  name: string;
  description?: string;
  priority: number;
  storyPoints?: number;
  assigneeId?: string;
  startDate?: Date;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Interface da história de usuário
export interface UserStory {
  id: string;
  epicId?: string;
  projectId: string;
  statusId: string;
  title: string;
  description?: string;
  acceptanceCriteria?: string;
  storyPoints?: number;
  priority: number;
  assigneeId?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

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

// Interface do comentário
export interface Comment {
  id: string;
  content: string;
  userId: string;
  entityType: "task" | "story" | "epic";
  entityId: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

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

// Interface das configurações do projeto
export interface ProjectSetting {
  projectId: string;
  sprintLengthDays: number;
  enableTimeTracking: boolean;
  defaultStoryPoints: string;
  notificationSettings?: Record<string, any>;
  updatedAt: Date;
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

// Interface da etiqueta do projeto
export interface ProjectLabel {
  id: string;
  projectId: string;
  name: string;
  color: string;
  description?: string;
  createdAt: Date;
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

// DTOs para operações de épico
export interface CreateEpicDTO {
  projectId: string;
  statusId: string;
  name: string;
  description?: string;
  priority?: number;
  storyPoints?: number;
  assigneeId?: string;
  startDate?: Date;
  dueDate?: Date;
}

export interface UpdateEpicDTO {
  statusId?: string;
  name?: string;
  description?: string;
  priority?: number;
  storyPoints?: number;
  assigneeId?: string;
  startDate?: Date;
  dueDate?: Date;
}

// DTOs para operações de história de usuário
export interface CreateUserStoryDTO {
  epicId?: string;
  projectId: string;
  statusId: string;
  title: string;
  description?: string;
  acceptanceCriteria?: string;
  storyPoints?: number;
  priority?: number;
  assigneeId?: string;
  dueDate?: Date;
}

export interface UpdateUserStoryDTO {
  epicId?: string;
  statusId?: string;
  title?: string;
  description?: string;
  acceptanceCriteria?: string;
  storyPoints?: number;
  priority?: number;
  assigneeId?: string;
  dueDate?: Date;
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

// DTOs para operações de comentário
export interface CreateCommentDTO {
  content: string;
  userId: string;
  entityType: "task" | "story" | "epic";
  entityId: string;
  parentId?: string;
}

export interface UpdateCommentDTO {
  content: string;
}

// Response padrão da API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
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
      "Chave do projeto deve conter apenas letras maiúsculas e números"
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

// Schemas de validação para épico
export const CreateEpicSchema = z.object({
  projectId: z.string().uuid("ID do projeto deve ser um UUID válido"),
  statusId: z.string().uuid("ID do status deve ser um UUID válido"),
  name: z.string().min(1, "Nome é obrigatório").max(255, "Nome muito longo"),
  description: z.string().optional(),
  priority: z.number().min(1).max(5).default(3),
  storyPoints: z.number().positive().optional(),
  assigneeId: z
    .string()
    .uuid("ID do responsável deve ser um UUID válido")
    .optional(),
  startDate: z.date().optional(),
  dueDate: z.date().optional(),
});

export const UpdateEpicSchema = z.object({
  statusId: z.string().uuid("ID do status deve ser um UUID válido").optional(),
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(255, "Nome muito longo")
    .optional(),
  description: z.string().optional(),
  priority: z.number().min(1).max(5).optional(),
  storyPoints: z.number().positive().optional(),
  assigneeId: z
    .string()
    .uuid("ID do responsável deve ser um UUID válido")
    .optional(),
  startDate: z.date().optional(),
  dueDate: z.date().optional(),
});

export const EpicIdSchema = z.object({
  id: z.string().uuid("ID deve ser um UUID válido"),
});

// Schemas de validação para história de usuário
export const CreateUserStorySchema = z.object({
  epicId: z.string().uuid("ID do épico deve ser um UUID válido").optional(),
  projectId: z.string().uuid("ID do projeto deve ser um UUID válido"),
  statusId: z.string().uuid("ID do status deve ser um UUID válido"),
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .max(255, "Título muito longo"),
  description: z.string().optional(),
  acceptanceCriteria: z.string().optional(),
  storyPoints: z.number().positive().optional(),
  priority: z.number().min(1).max(5).default(3),
  assigneeId: z
    .string()
    .uuid("ID do responsável deve ser um UUID válido")
    .optional(),
  dueDate: z.date().optional(),
});

export const UpdateUserStorySchema = z.object({
  epicId: z.string().uuid("ID do épico deve ser um UUID válido").optional(),
  statusId: z.string().uuid("ID do status deve ser um UUID válido").optional(),
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .max(255, "Título muito longo")
    .optional(),
  description: z.string().optional(),
  acceptanceCriteria: z.string().optional(),
  storyPoints: z.number().positive().optional(),
  priority: z.number().min(1).max(5).optional(),
  assigneeId: z
    .string()
    .uuid("ID do responsável deve ser um UUID válido")
    .optional(),
  dueDate: z.date().optional(),
});

export const UserStoryIdSchema = z.object({
  id: z.string().uuid("ID deve ser um UUID válido"),
});

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
  priority: z.number().min(1).max(5).default(3),
  estimatedHours: z.number().positive().optional(),
  assigneeId: z
    .string()
    .uuid("ID do responsável deve ser um UUID válido")
    .optional(),
  reporterId: z.string().uuid("ID do reporter deve ser um UUID válido"),
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
  priority: z.number().min(1).max(5).optional(),
  estimatedHours: z.number().positive().optional(),
  actualHours: z.number().positive().optional(),
  assigneeId: z
    .string()
    .uuid("ID do responsável deve ser um UUID válido")
    .optional(),
  dueDate: z.date().optional(),
});

export const TaskIdSchema = z.object({
  id: z.string().uuid("ID deve ser um UUID válido"),
});

// Schemas de validação para sprint
export const CreateSprintSchema = z.object({
  projectId: z.string().uuid("ID do projeto deve ser um UUID válido"),
  name: z.string().min(1, "Nome é obrigatório").max(255, "Nome muito longo"),
  goal: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
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

// Schemas de validação para comentário
export const CreateCommentSchema = z.object({
  content: z.string().min(1, "Conteúdo é obrigatório"),
  userId: z.string().uuid("ID do usuário deve ser um UUID válido"),
  entityType: z.enum(["task", "story", "epic"]),
  entityId: z.string().uuid("ID da entidade deve ser um UUID válido"),
  parentId: z
    .string()
    .uuid("ID do comentário pai deve ser um UUID válido")
    .optional(),
});

export const UpdateCommentSchema = z.object({
  content: z.string().min(1, "Conteúdo é obrigatório"),
});

export const CommentIdSchema = z.object({
  id: z.string().uuid("ID deve ser um UUID válido"),
});

// Tipos derivados dos schemas
export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;
export type ProjectIdInput = z.infer<typeof ProjectIdSchema>;
export type ProjectSlugInput = z.infer<typeof ProjectSlugSchema>;

export type CreateTeamInput = z.infer<typeof CreateTeamSchema>;
export type UpdateTeamInput = z.infer<typeof UpdateTeamSchema>;
export type TeamIdInput = z.infer<typeof TeamIdSchema>;

export type CreateEpicInput = z.infer<typeof CreateEpicSchema>;
export type UpdateEpicInput = z.infer<typeof UpdateEpicSchema>;
export type EpicIdInput = z.infer<typeof EpicIdSchema>;

export type CreateUserStoryInput = z.infer<typeof CreateUserStorySchema>;
export type UpdateUserStoryInput = z.infer<typeof UpdateUserStorySchema>;
export type UserStoryIdInput = z.infer<typeof UserStoryIdSchema>;

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type TaskIdInput = z.infer<typeof TaskIdSchema>;

export type CreateSprintInput = z.infer<typeof CreateSprintSchema>;
export type UpdateSprintInput = z.infer<typeof UpdateSprintSchema>;
export type SprintIdInput = z.infer<typeof SprintIdSchema>;

export type CreateCommentInput = z.infer<typeof CreateCommentSchema>;
export type UpdateCommentInput = z.infer<typeof UpdateCommentSchema>;
export type CommentIdInput = z.infer<typeof CommentIdSchema>;
