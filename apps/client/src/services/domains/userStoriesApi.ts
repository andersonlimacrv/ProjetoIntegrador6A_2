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
  getAll: async () => {
    const response = await apiClient.get<ApiResponse<UserStory[]>>(
      "/user-stories"
    );
    return response;
  },
  getById: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<UserStory>>(
      `/user-stories/${id}`
    );
    return response;
  },
  create: async (data: CreateUserStoryDTO) => {
    const response = await apiClient.post<ApiResponse<UserStory>>(
      "/user-stories",
      data
    );
    return response;
  },
  update: async (id: string | number, data: UpdateUserStoryDTO) => {
    const response = await apiClient.put<ApiResponse<UserStory>>(
      `/user-stories/${id}`,
      data
    );
    return response;
  },
  delete: async (id: string | number) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/user-stories/${id}`
    );
    return response;
  },

  // Por projeto
  getByProject: async (projectId: string | number) => {
    const response = await apiClient.get<ApiResponse<UserStory[]>>(
      `/user-stories/project/${projectId}`
    );
    return response;
  },
  getByEpic: async (epicId: string | number) => {
    const response = await apiClient.get<ApiResponse<UserStory[]>>(
      `/user-stories/epic/${epicId}`
    );
    return response;
  },

  // Tarefas
  getTasks: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<Task[]>>(
      `/user-stories/${id}/tasks`
    );
    return response;
  },

  // Sprint
  assignToSprint: async (id: string | number, sprintId: string | number) => {
    const response = await apiClient.patch<ApiResponse<UserStory>>(
      `/user-stories/${id}/sprint`,
      { sprintId }
    );
    return response;
  },
  addToSprint: async (id: string | number, sprintId: string | number) => {
    const response = await apiClient.post<ApiResponse<UserStory>>(
      `/user-stories/${id}/sprint/${sprintId}`
    );
    return response;
  },
  removeFromSprint: async (id: string | number) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/user-stories/${id}/sprint`
    );
    return response;
  },
};
