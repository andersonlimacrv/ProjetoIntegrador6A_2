import { apiClient } from "../apiClient";
import type {
  Activity,
  CreateActivityDTO,
  UpdateActivityDTO,
  ApiResponse,
} from "@packages/shared";

export const activitiesApi = {
  // CRUD
  getAll: () => apiClient.get<ApiResponse<Activity[]>>("/activities"),
  getById: (id: string | number) =>
    apiClient.get<ApiResponse<Activity>>(`/activities/${id}`),
  create: (data: CreateActivityDTO) =>
    apiClient.post<ApiResponse<Activity>>("/activities", data),
  update: (id: string | number, data: UpdateActivityDTO) =>
    apiClient.put<ApiResponse<Activity>>(`/activities/${id}`, data),
  delete: (id: string | number) =>
    apiClient.delete<ApiResponse<void>>(`/activities/${id}`),

  // Por usuário
  getByUser: (userId: string | number) =>
    apiClient.get<ApiResponse<Activity[]>>(`/activities/user/${userId}`),
  // Por projeto
  getByProject: (projectId: string | number) =>
    apiClient.get<ApiResponse<Activity[]>>(`/activities/project/${projectId}`),
  // Por tarefa
  getByTask: (taskId: string | number) =>
    apiClient.get<ApiResponse<Activity[]>>(`/activities/task/${taskId}`),
  // Por tipo
  getByType: (type: string) =>
    apiClient.get<ApiResponse<Activity[]>>(`/activities/type/${type}`),
  // Feed
  getUserFeed: (userId: string | number) =>
    apiClient.get<ApiResponse<Activity[]>>(`/activities/feed/${userId}`),
};
