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
  getAll: async () => {
    const response = await apiClient.get<ApiResponse<Epic[]>>("/epics");
    return response;
  },
  getById: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<Epic>>(`/epics/${id}`);
    return response;
  },
  create: async (data: CreateEpicDTO) => {
    const response = await apiClient.post<ApiResponse<Epic>>("/epics", data);
    return response;
  },
  update: async (id: string | number, data: UpdateEpicDTO) => {
    const response = await apiClient.put<ApiResponse<Epic>>(
      `/epics/${id}`,
      data
    );
    return response;
  },
  delete: async (id: string | number) => {
    const response = await apiClient.delete<ApiResponse<void>>(`/epics/${id}`);
    return response;
  },

  // Por projeto
  getByProject: async (projectId: string | number) => {
    const response = await apiClient.get<ApiResponse<Epic[]>>(
      `/epics/project/${projectId}`
    );
    return response;
  },

  // User Stories
  getUserStories: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<UserStory[]>>(
      `/epics/${id}/user-stories`
    );
    return response;
  },
};
