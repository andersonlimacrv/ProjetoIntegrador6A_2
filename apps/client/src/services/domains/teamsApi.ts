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
  getAll: () => apiClient.get<ApiResponse<Team[]>>("/teams"),
  getById: (id: string | number) =>
    apiClient.get<ApiResponse<Team>>(`/teams/${id}`),
  create: (data: CreateTeamDTO) =>
    apiClient.post<ApiResponse<Team>>("/teams", data),
  update: (id: string | number, data: UpdateTeamDTO) =>
    apiClient.put<ApiResponse<Team>>(`/teams/${id}`, data),
  delete: (id: string | number) =>
    apiClient.delete<ApiResponse<void>>(`/teams/${id}`),

  // Por tenant
  getByTenant: (tenantId: string | number) =>
    apiClient.get<ApiResponse<Team[]>>(`/teams/tenant/${tenantId}`),

  // Membros
  getMembers: (id: string | number) =>
    apiClient.get<ApiResponse<User[]>>(`/teams/${id}/members`),
  addMember: (id: string | number, userId: string | number) =>
    apiClient.post<ApiResponse<void>>(`/teams/${id}/members/${userId}`),
  updateMemberRole: (id: string | number, userId: string | number, data: any) =>
    apiClient.put<ApiResponse<void>>(`/teams/${id}/members/${userId}`, data),
  removeMember: (id: string | number, userId: string | number) =>
    apiClient.delete<ApiResponse<void>>(`/teams/${id}/members/${userId}`),

  // Projetos
  getProjects: (id: string | number) =>
    apiClient.get<ApiResponse<Project[]>>(`/teams/${id}/projects`),
};
