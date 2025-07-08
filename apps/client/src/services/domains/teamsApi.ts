import { apiClient } from "../apiClient";
import type {
  Team,
  CreateTeamDTO,
  UpdateTeamDTO,
  ApiResponse,
  User,
  Project,
} from "@packages/shared";

export const teamsApi = {
  // CRUD
  getAll: async () => {
    const response = await apiClient.get<ApiResponse<Team[]>>("/teams");
    return response;
  },
  getById: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<Team>>(`/teams/${id}`);
    return response;
  },
  create: async (data: CreateTeamDTO) => {
    const response = await apiClient.post<ApiResponse<Team>>("/teams", data);
    return response;
  },
  update: async (id: string | number, data: UpdateTeamDTO) => {
    const response = await apiClient.put<ApiResponse<Team>>(`/teams/${id}`, data);
    return response;
  },
  delete: async (id: string | number) => {
    const response = await apiClient.delete<ApiResponse<void>>(`/teams/${id}`);
    return response;
  },

  // Por tenant
  getByTenant: async (tenantId: string | number) => {
    const response = await apiClient.get<ApiResponse<Team[]>>(`/teams/tenant/${tenantId}`);
    return response;
  },

  // Membros
  getMembers: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<User[]>>(`/teams/${id}/members`);
    return response;
  },
  addMember: async (id: string | number, userId: string | number) => {
    const response = await apiClient.post<ApiResponse<void>>(`/teams/${id}/members/${userId}`);
    return response;
  },
  updateMember: async (id: string | number, userId: string | number, data: any) => {
    const response = await apiClient.put<ApiResponse<void>>(`/teams/${id}/members/${userId}`, data);
    return response;
  },
  removeMember: async (id: string | number, userId: string | number) => {
    const response = await apiClient.delete<ApiResponse<void>>(`/teams/${id}/members/${userId}`);
    return response;
  },

  // Projetos
  getProjects: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<Project[]>>(`/teams/${id}/projects`);
    return response;
  },
};
