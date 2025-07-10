import { apiClient } from "../apiClient";
import type {
  Comment,
  CreateCommentDTO,
  UpdateCommentDTO,
  ApiResponse,
} from "@packages/shared";

export const commentsApi = {
  // CRUD
  getAll: async () => {
    const response = await apiClient.get<ApiResponse<Comment[]>>("/comments");
    return response;
  },
  getById: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<Comment>>(
      `/comments/${id}`
    );
    return response;
  },
  create: async (data: CreateCommentDTO) => {
    const response = await apiClient.post<ApiResponse<Comment>>(
      "/comments",
      data
    );
    return response;
  },
  update: async (id: string | number, data: UpdateCommentDTO) => {
    const response = await apiClient.put<ApiResponse<Comment>>(
      `/comments/${id}`,
      data
    );
    return response;
  },
  delete: async (id: string | number) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/comments/${id}`
    );
    return response;
  },

  // Por entidade
  getByTask: async (taskId: string | number) => {
    const response = await apiClient.get<ApiResponse<Comment[]>>(
      `/comments/task/${taskId}`
    );
    return response;
  },
  getByStory: async (storyId: string | number) => {
    const response = await apiClient.get<ApiResponse<Comment[]>>(
      `/comments/story/${storyId}`
    );
    return response;
  },
  getByEpic: async (epicId: string | number) => {
    const response = await apiClient.get<ApiResponse<Comment[]>>(
      `/comments/epic/${epicId}`
    );
    return response;
  },
  getByUser: async (userId: string | number) => {
    const response = await apiClient.post<ApiResponse<Comment[]>>(
      `/comments/my-comments`,
      { userId }
    );
    return response;
  },
};
