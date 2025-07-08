import { apiClient } from "../apiClient";
import type {
  Activity,
  CreateActivityDTO,
  ApiResponse,
} from "@packages/shared";

export const activitiesApi = {
  // CRUD
  getAll: async () => {
    const response = await apiClient.get<ApiResponse<Activity[]>>(
      "/activities"
    );
    return response;
  },
  getById: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<Activity>>(
      `/activities/${id}`
    );
    return response;
  },
  create: async (data: CreateActivityDTO) => {
    const response = await apiClient.post<ApiResponse<Activity>>(
      "/activities",
      data
    );
    return response;
  },
  delete: async (id: string | number) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/activities/${id}`
    );
    return response;
  },

  // Por entidade
  getByUser: async (userId: string | number) => {
    const response = await apiClient.get<ApiResponse<Activity[]>>(
      `/activities/user/${userId}`
    );
    return response;
  },
  getByTenant: async (tenantId: string | number) => {
    const response = await apiClient.get<ApiResponse<Activity[]>>(
      `/activities/tenant/${tenantId}`
    );
    return response;
  },
  getByProject: async (projectId: string | number) => {
    const response = await apiClient.get<ApiResponse<Activity[]>>(
      `/activities/project/${projectId}`
    );
    return response;
  },
  getByEntity: async (entityType: string, entityId: string | number) => {
    const response = await apiClient.get<ApiResponse<Activity[]>>(
      `/activities/${entityType}/${entityId}`
    );
    return response;
  },
};
