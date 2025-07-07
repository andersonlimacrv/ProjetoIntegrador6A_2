import { apiClient } from "../apiClient";
import type {
  Comment,
  CreateCommentDTO,
  UpdateCommentDTO,
  ApiResponse,
  Reaction,
} from "@packages/shared";

export const commentsApi = {
  // CRUD
  getAll: () => apiClient.get<ApiResponse<Comment[]>>("/comments"),
  getById: (id: string | number) =>
    apiClient.get<ApiResponse<Comment>>(`/comments/${id}`),
  create: (data: CreateCommentDTO) =>
    apiClient.post<ApiResponse<Comment>>("/comments", data),
  update: (id: string | number, data: UpdateCommentDTO) =>
    apiClient.put<ApiResponse<Comment>>(`/comments/${id}`, data),
  delete: (id: string | number) =>
    apiClient.delete<ApiResponse<void>>(`/comments/${id}`),

  // Por tarefa
  getByTask: (taskId: string | number) =>
    apiClient.get<ApiResponse<Comment[]>>(`/comments/task/${taskId}`),
  // Por usuário
  getByUser: (userId: string | number) =>
    apiClient.get<ApiResponse<Comment[]>>(`/comments/user/${userId}`),

  // Reações
  getReactions: (id: string | number) =>
    apiClient.get<ApiResponse<Reaction[]>>(`/comments/${id}/reactions`),
  addReaction: (id: string | number, data: any) =>
    apiClient.post<ApiResponse<Reaction>>(`/comments/${id}/reactions`, data),
  removeReaction: (id: string | number, reactionId: string | number) =>
    apiClient.delete<ApiResponse<void>>(
      `/comments/${id}/reactions/${reactionId}`
    ),
};
