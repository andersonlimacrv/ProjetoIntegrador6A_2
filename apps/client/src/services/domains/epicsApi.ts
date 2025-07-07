import { apiClient } from "../apiClient";
import type {
  Epic,
  CreateEpicDTO,
  UpdateEpicDTO,
  ApiResponse,
  UserStory,
} from "@packages/shared";

export const epicsApi = {
  // CRUD
  getAll: () => apiClient.get<ApiResponse<Epic[]>>("/epics"),
  getById: (id: string | number) =>
    apiClient.get<ApiResponse<Epic>>(`/epics/${id}`),
  create: (data: CreateEpicDTO) =>
    apiClient.post<ApiResponse<Epic>>("/epics", data),
  update: (id: string | number, data: UpdateEpicDTO) =>
    apiClient.put<ApiResponse<Epic>>(`/epics/${id}`, data),
  delete: (id: string | number) =>
    apiClient.delete<ApiResponse<void>>(`/epics/${id}`),

  // Por projeto
  getByProject: (projectId: string | number) =>
    apiClient.get<ApiResponse<Epic[]>>(`/epics/project/${projectId}`),

  // Histórias de usuário
  getStories: (id: string | number) =>
    apiClient.get<ApiResponse<UserStory[]>>(`/epics/${id}/stories`),

  // Status
  updateStatus: (id: string | number, statusId: string | number) =>
    apiClient.patch<ApiResponse<Epic>>(`/epics/${id}/status/${statusId}`),
};
