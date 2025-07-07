import { apiClient } from "../apiClient";
import type {
  Sprint,
  CreateSprintDTO,
  UpdateSprintDTO,
  ApiResponse,
  SprintMetrics,
  UserStory,
} from "@packages/shared";

export const sprintsApi = {
  // CRUD
  getAll: () => apiClient.get<ApiResponse<Sprint[]>>("/sprints"),
  getById: (id: string | number) =>
    apiClient.get<ApiResponse<Sprint>>(`/sprints/${id}`),
  create: (data: CreateSprintDTO) =>
    apiClient.post<ApiResponse<Sprint>>("/sprints", data),
  update: (id: string | number, data: UpdateSprintDTO) =>
    apiClient.put<ApiResponse<Sprint>>(`/sprints/${id}`, data),
  delete: (id: string | number) =>
    apiClient.delete<ApiResponse<void>>(`/sprints/${id}`),

  // Por projeto
  getByProject: (projectId: string | number) =>
    apiClient.get<ApiResponse<Sprint[]>>(`/sprints/project/${projectId}`),

  // Backlog
  getBacklog: (id: string | number) =>
    apiClient.get<ApiResponse<UserStory[]>>(`/sprints/${id}/backlog`),
  addStoryToBacklog: (id: string | number, data: any) =>
    apiClient.post<ApiResponse<UserStory>>(`/sprints/${id}/backlog`, data),
  removeStoryFromBacklog: (id: string | number, storyId: string | number) =>
    apiClient.delete<ApiResponse<void>>(`/sprints/${id}/backlog/${storyId}`),

  // Métricas
  getMetrics: (id: string | number) =>
    apiClient.get<ApiResponse<SprintMetrics>>(`/sprints/${id}/metrics`),
  createMetrics: (id: string | number, data: any) =>
    apiClient.post<ApiResponse<SprintMetrics>>(`/sprints/${id}/metrics`, data),

  // Status
  start: (id: string | number) =>
    apiClient.patch<ApiResponse<Sprint>>(`/sprints/${id}/start`),
  complete: (id: string | number) =>
    apiClient.patch<ApiResponse<Sprint>>(`/sprints/${id}/complete`),
  cancel: (id: string | number) =>
    apiClient.patch<ApiResponse<Sprint>>(`/sprints/${id}/cancel`),
};
