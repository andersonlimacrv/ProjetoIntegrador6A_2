import { apiClient } from "../apiClient";
import type {
  Task,
  CreateTaskDTO,
  UpdateTaskDTO,
  ApiResponse,
  TaskAssignment,
  TaskLabel,
  TaskAttachment,
  TaskDependency,
  Comment,
} from "@packages/shared";

export const tasksApi = {
  // CRUD
  getAll: () => apiClient.get<ApiResponse<Task[]>>("/tasks"),
  getById: (id: string | number) =>
    apiClient.get<ApiResponse<Task>>(`/tasks/${id}`),
  getByIdWithDetails: (id: string | number) =>
    apiClient.get<ApiResponse<Task>>(`/tasks/${id}/details`),
  create: (data: CreateTaskDTO) =>
    apiClient.post<ApiResponse<Task>>("/tasks", data),
  update: (id: string | number, data: UpdateTaskDTO) =>
    apiClient.put<ApiResponse<Task>>(`/tasks/${id}`, data),
  delete: (id: string | number) =>
    apiClient.delete<ApiResponse<void>>(`/tasks/${id}`),

  // Por projeto
  getByProject: (projectId: string | number) =>
    apiClient.get<ApiResponse<Task[]>>(`/tasks/project/${projectId}`),
  // Por história de usuário
  getByStory: (storyId: string | number) =>
    apiClient.get<ApiResponse<Task[]>>(`/tasks/story/${storyId}`),
  // Por responsável
  getByAssignee: (assigneeId: string | number) =>
    apiClient.get<ApiResponse<Task[]>>(`/tasks/assignee/${assigneeId}`),
  // Por reporter
  getByReporter: (reporterId: string | number) =>
    apiClient.get<ApiResponse<Task[]>>(`/tasks/reporter/${reporterId}`),
  // Por status
  getByStatus: (statusId: string | number) =>
    apiClient.get<ApiResponse<Task[]>>(`/tasks/status/${statusId}`),
  // Por prioridade
  getByPriority: (priority: string) =>
    apiClient.get<ApiResponse<Task[]>>(`/tasks/priority/${priority}`),

  // Atribuições
  assign: (id: string | number, userId: string | number) =>
    apiClient.post<ApiResponse<TaskAssignment>>(
      `/tasks/${id}/assign/${userId}`
    ),
  unassign: (id: string | number, userId: string | number) =>
    apiClient.delete<ApiResponse<void>>(`/tasks/${id}/assign/${userId}`),
  getAssignments: (id: string | number) =>
    apiClient.get<ApiResponse<TaskAssignment[]>>(`/tasks/${id}/assignments`),

  // Etiquetas
  getLabels: (id: string | number) =>
    apiClient.get<ApiResponse<TaskLabel[]>>(`/tasks/${id}/labels`),
  addLabel: (id: string | number, labelId: string | number) =>
    apiClient.post<ApiResponse<void>>(`/tasks/${id}/labels/${labelId}`),
  removeLabel: (id: string | number, labelId: string | number) =>
    apiClient.delete<ApiResponse<void>>(`/tasks/${id}/labels/${labelId}`),

  // Anexos
  getAttachments: (id: string | number) =>
    apiClient.get<ApiResponse<TaskAttachment[]>>(`/tasks/${id}/attachments`),
  addAttachment: (id: string | number, data: any) =>
    apiClient.post<ApiResponse<TaskAttachment>>(
      `/tasks/${id}/attachments`,
      data
    ),
  removeAttachment: (id: string | number, attachmentId: string | number) =>
    apiClient.delete<ApiResponse<void>>(
      `/tasks/${id}/attachments/${attachmentId}`
    ),

  // Dependências
  getDependencies: (id: string | number) =>
    apiClient.get<ApiResponse<TaskDependency[]>>(`/tasks/${id}/dependencies`),
  addDependency: (id: string | number, data: any) =>
    apiClient.post<ApiResponse<TaskDependency>>(
      `/tasks/${id}/dependencies`,
      data
    ),
  removeDependency: (id: string | number, dependencyId: string | number) =>
    apiClient.delete<ApiResponse<void>>(
      `/tasks/${id}/dependencies/${dependencyId}`
    ),

  // Comentários
  getComments: (id: string | number) =>
    apiClient.get<ApiResponse<Comment[]>>(`/tasks/${id}/comments`),
  addComment: (id: string | number, data: any) =>
    apiClient.post<ApiResponse<Comment>>(`/tasks/${id}/comments`, data),

  // Tempo
  getOverdue: () => apiClient.get<ApiResponse<Task[]>>("/tasks/overdue"),
  updateTime: (id: string | number, data: any) =>
    apiClient.patch<ApiResponse<Task>>(`/tasks/${id}/time`, data),

  // Sprint
  getBySprint: (sprintId: string | number) =>
    apiClient.get<ApiResponse<Task[]>>(`/tasks/sprint/${sprintId}`),
};
