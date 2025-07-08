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
  getAll: async () => {
    const response = await apiClient.get<ApiResponse<Task[]>>("/tasks");
    return response;
  },
  getById: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<Task>>(`/tasks/${id}`);
    return response;
  },
  getDetails: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<Task>>(
      `/tasks/${id}/details`
    );
    return response;
  },
  create: async (data: CreateTaskDTO) => {
    const response = await apiClient.post<ApiResponse<Task>>("/tasks", data);
    return response;
  },
  update: async (id: string | number, data: UpdateTaskDTO) => {
    const response = await apiClient.put<ApiResponse<Task>>(
      `/tasks/${id}`,
      data
    );
    return response;
  },
  delete: async (id: string | number) => {
    const response = await apiClient.delete<ApiResponse<void>>(`/tasks/${id}`);
    return response;
  },

  // Por projeto
  getByProject: async (projectId: string | number) => {
    const response = await apiClient.get<ApiResponse<Task[]>>(
      `/tasks/project/${projectId}`
    );
    return response;
  },
  getByStory: async (storyId: string | number) => {
    const response = await apiClient.get<ApiResponse<Task[]>>(
      `/tasks/story/${storyId}`
    );
    return response;
  },
  getByAssignee: async (assigneeId: string | number) => {
    const response = await apiClient.get<ApiResponse<Task[]>>(
      `/tasks/assignee/${assigneeId}`
    );
    return response;
  },
  getByReporter: async (reporterId: string | number) => {
    const response = await apiClient.get<ApiResponse<Task[]>>(
      `/tasks/reporter/${reporterId}`
    );
    return response;
  },
  getByStatus: async (statusId: string | number) => {
    const response = await apiClient.get<ApiResponse<Task[]>>(
      `/tasks/status/${statusId}`
    );
    return response;
  },
  getByPriority: async (priority: number) => {
    const response = await apiClient.get<ApiResponse<Task[]>>(
      `/tasks/priority/${priority}`
    );
    return response;
  },

  // Atribuições
  assignUser: async (id: string | number, userId: string | number) => {
    const response = await apiClient.post<ApiResponse<TaskAssignment>>(
      `/tasks/${id}/assign/${userId}`
    );
    return response;
  },
  unassignUser: async (id: string | number, userId: string | number) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/tasks/${id}/assign/${userId}`
    );
    return response;
  },
  getAssignments: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<TaskAssignment[]>>(
      `/tasks/${id}/assignments`
    );
    return response;
  },

  // Etiquetas
  getLabels: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<TaskLabel[]>>(
      `/tasks/${id}/labels`
    );
    return response;
  },
  addLabel: async (id: string | number, labelId: string | number) => {
    const response = await apiClient.post<ApiResponse<void>>(
      `/tasks/${id}/labels/${labelId}`
    );
    return response;
  },
  removeLabel: async (id: string | number, labelId: string | number) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/tasks/${id}/labels/${labelId}`
    );
    return response;
  },

  // Anexos
  getAttachments: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<TaskAttachment[]>>(
      `/tasks/${id}/attachments`
    );
    return response;
  },
  uploadAttachment: async (id: string | number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<ApiResponse<TaskAttachment>>(
      `/tasks/${id}/attachments`,
      formData
    );
    return response;
  },
  deleteAttachment: async (
    id: string | number,
    attachmentId: string | number
  ) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/tasks/${id}/attachments/${attachmentId}`
    );
    return response;
  },

  // Dependências
  getDependencies: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<TaskDependency[]>>(
      `/tasks/${id}/dependencies`
    );
    return response;
  },
  addDependency: async (
    id: string | number,
    dependsOnTaskId: string | number,
    type: string
  ) => {
    const response = await apiClient.post<ApiResponse<TaskDependency>>(
      `/tasks/${id}/dependencies`,
      { dependsOnTaskId, type }
    );
    return response;
  },
  removeDependency: async (
    id: string | number,
    dependencyId: string | number
  ) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/tasks/${id}/dependencies/${dependencyId}`
    );
    return response;
  },

  // Comentários
  getComments: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<Comment[]>>(
      `/tasks/${id}/comments`
    );
    return response;
  },
  addComment: async (id: string | number, data: any) => {
    const response = await apiClient.post<ApiResponse<Comment>>(
      `/tasks/${id}/comments`,
      data
    );
    return response;
  },

  // Relatórios
  getOverdue: async () => {
    const response = await apiClient.get<ApiResponse<Task[]>>("/tasks/overdue");
    return response;
  },
  updateTimeTracking: async (id: string | number, data: any) => {
    const response = await apiClient.patch<ApiResponse<Task>>(
      `/tasks/${id}/time`,
      data
    );
    return response;
  },
  getBySprint: async (sprintId: string | number) => {
    const response = await apiClient.get<ApiResponse<Task[]>>(
      `/tasks/sprint/${sprintId}`
    );
    return response;
  },
};
