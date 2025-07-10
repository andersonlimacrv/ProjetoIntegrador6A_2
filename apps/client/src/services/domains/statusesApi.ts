import { apiClient } from "../apiClient";
import type { Status, ApiResponse } from "@packages/shared";

export const statusesApi = {
  // Buscar todos os status
  getAll: async () => {
    const response = await apiClient.get<ApiResponse<Status[]>>("/statuses");
    return response;
  },

  // Buscar status por projeto
  getByProject: async (projectId: string | number) => {
    const response = await apiClient.get<ApiResponse<Status[]>>(
      `/statuses/project/${projectId}`
    );
    return response;
  },

  // Buscar status por ID
  getById: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<Status>>(
      `/statuses/${id}`
    );
    return response;
  },
};
