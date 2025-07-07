import { apiClient } from "../apiClient";
import type {
  UserStory,
  CreateUserStoryDTO,
  UpdateUserStoryDTO,
  ApiResponse,
  Task,
} from "@packages/shared";

export const userStoriesApi = {
  // CRUD
  getAll: () => apiClient.get<ApiResponse<UserStory[]>>("/userStories"),
  getById: (id: string | number) =>
    apiClient.get<ApiResponse<UserStory>>(`/userStories/${id}`),
  create: (data: CreateUserStoryDTO) =>
    apiClient.post<ApiResponse<UserStory>>("/userStories", data),
  update: (id: string | number, data: UpdateUserStoryDTO) =>
    apiClient.put<ApiResponse<UserStory>>(`/userStories/${id}`, data),
  delete: (id: string | number) =>
    apiClient.delete<ApiResponse<void>>(`/userStories/${id}`),

  // Por projeto
  getByProject: (projectId: string | number) =>
    apiClient.get<ApiResponse<UserStory[]>>(
      `/userStories/project/${projectId}`
    ),
  // Por épico
  getByEpic: (epicId: string | number) =>
    apiClient.get<ApiResponse<UserStory[]>>(`/userStories/epic/${epicId}`),

  // Tarefas
  getTasks: (id: string | number) =>
    apiClient.get<ApiResponse<Task[]>>(`/userStories/${id}/tasks`),

  // Status
  updateStatus: (id: string | number, statusId: string | number) =>
    apiClient.patch<ApiResponse<UserStory>>(
      `/userStories/${id}/status/${statusId}`
    ),

  // Sprint
  addToSprint: (id: string | number, sprintId: string | number) =>
    apiClient.post<ApiResponse<UserStory>>(
      `/userStories/${id}/sprint/${sprintId}`
    ),
  removeFromSprint: (id: string | number) =>
    apiClient.delete<ApiResponse<void>>(`/userStories/${id}/sprint`),
};
