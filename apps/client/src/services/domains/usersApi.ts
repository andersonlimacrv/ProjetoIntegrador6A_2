import { apiClient } from "../apiClient";
import type {
  User,
  CreateUserDTO,
  UpdateUserDTO,
  LoginUserDTO,
  ApiResponse,
  Session,
  Activity,
  Tenant,
  Team,
} from "@packages/shared";

export const usersApi = {
  getAll: () => apiClient.get<ApiResponse<User[]>>("/users"),
  getById: (id: string | number) =>
    apiClient.get<ApiResponse<User>>(`/users/${id}`),
  create: (data: CreateUserDTO) =>
    apiClient.post<ApiResponse<User>>("/users", data),
  update: (id: string | number, data: UpdateUserDTO) =>
    apiClient.put<ApiResponse<User>>(`/users/${id}`, data),
  delete: (id: string | number) =>
    apiClient.delete<ApiResponse<void>>(`/users/${id}`),

  // Auth
  login: (data: LoginUserDTO) =>
    apiClient.post<ApiResponse<{ user: User; token: string }>>(
      "/users/login",
      data
    ),
  logout: () => apiClient.post<ApiResponse<void>>("/users/logout"),
  refreshToken: () =>
    apiClient.post<ApiResponse<{ token: string }>>("/users/refresh-token"),

  // Sessões
  getSessions: (id: string | number) =>
    apiClient.get<ApiResponse<Session[]>>(`/users/${id}/sessions`),
  deleteSession: (id: string | number, sessionId: string) =>
    apiClient.delete<ApiResponse<void>>(`/users/${id}/sessions/${sessionId}`),

  // Atividades
  getActivities: (id: string | number) =>
    apiClient.get<ApiResponse<Activity[]>>(`/users/${id}/activities`),

  // Tenants
  getTenants: (id: string | number) =>
    apiClient.get<ApiResponse<Tenant[]>>(`/users/${id}/tenants`),

  // Equipes
  getTeams: (id: string | number) =>
    apiClient.get<ApiResponse<Team[]>>(`/users/${id}/teams`),
};
