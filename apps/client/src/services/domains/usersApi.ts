import { apiClient } from "../apiClient";
import type {
  User,
  CreateUserDTO,
  UpdateUserDTO,
  ApiResponse,
  Session,
  Activity,
  Tenant,
  Team,
} from "@packages/shared";

export const usersApi = {
  // CRUD
  getAll: async () => {
    const response = await apiClient.get<ApiResponse<User[]>>("/users");
    return response;
  },
  getById: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return response;
  },
  create: async (data: CreateUserDTO) => {
    const response = await apiClient.post<ApiResponse<User>>("/users", data);
    return response;
  },
  update: async (id: string | number, data: UpdateUserDTO) => {
    const response = await apiClient.put<ApiResponse<User>>(
      `/users/${id}`,
      data
    );
    return response;
  },
  delete: async (id: string | number) => {
    const response = await apiClient.delete<ApiResponse<void>>(`/users/${id}`);
    return response;
  },

  // Autenticação
  login: async (data: any) => {
    const response = await apiClient.post<
      ApiResponse<{ user: User; token: string }>
    >("/users/login", data);
    return response;
  },
  logout: async () => {
    const response = await apiClient.post<ApiResponse<void>>("/users/logout");
    return response;
  },
  refreshToken: async (refreshToken: string) => {
    const response = await apiClient.post<ApiResponse<{ token: string }>>(
      "/users/refresh-token",
      { refreshToken }
    );
    return response;
  },

  // Sessões
  getSessions: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<Session[]>>(
      `/users/${id}/sessions`
    );
    return response;
  },
  deleteSession: async (id: string | number, sessionId: string | number) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/users/${id}/sessions/${sessionId}`
    );
    return response;
  },

  // Atividades
  getActivities: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<Activity[]>>(
      `/users/${id}/activities`
    );
    return response;
  },

  // Tenants
  getTenants: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<Tenant[]>>(
      `/users/${id}/tenants`
    );
    return response;
  },

  // Teams
  getTeams: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<Team[]>>(
      `/users/${id}/teams`
    );
    return response;
  },
};
