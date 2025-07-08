import { apiClient } from "../apiClient";
import type {
  Sprint,
  CreateSprintDTO,
  UpdateSprintDTO,
  ApiResponse,
  UserStory,
  Task,
} from "@packages/shared";

export const sprintsApi = {
  // CRUD
  getAll: async () => {
    const response = await apiClient.get<ApiResponse<Sprint[]>>("/sprints");
    return response;
  },
  getById: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<Sprint>>(`/sprints/${id}`);
    return response;
  },
  create: async (data: CreateSprintDTO) => {
    const response = await apiClient.post<ApiResponse<Sprint>>(
      "/sprints",
      data
    );
    return response;
  },
  update: async (id: string | number, data: UpdateSprintDTO) => {
    const response = await apiClient.put<ApiResponse<Sprint>>(
      `/sprints/${id}`,
      data
    );
    return response;
  },
  delete: async (id: string | number) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/sprints/${id}`
    );
    return response;
  },

  // Por projeto
  getByProject: async (projectId: string | number) => {
    const response = await apiClient.get<ApiResponse<Sprint[]>>(
      `/sprints/project/${projectId}`
    );
    return response;
  },

  // Sprint atual
  getCurrent: async (projectId: string | number) => {
    const response = await apiClient.get<ApiResponse<Sprint>>(
      `/sprints/project/${projectId}/current`
    );
    return response;
  },

  // User Stories
  getUserStories: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<UserStory[]>>(
      `/sprints/${id}/user-stories`
    );
    return response;
  },
  addUserStory: async (id: string | number, storyId: string | number) => {
    const response = await apiClient.post<ApiResponse<void>>(
      `/sprints/${id}/user-stories/${storyId}`
    );
    return response;
  },
  removeUserStory: async (id: string | number, storyId: string | number) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/sprints/${id}/user-stories/${storyId}`
    );
    return response;
  },

  // Tarefas
  getTasks: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<Task[]>>(
      `/sprints/${id}/tasks`
    );
    return response;
  },

  // Métricas
  getMetrics: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<any>>(
      `/sprints/${id}/metrics`
    );
    return response;
  },
};
