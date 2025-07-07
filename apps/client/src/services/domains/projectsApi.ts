import { apiClient } from "../apiClient";
import type {
  Project,
  CreateProjectDTO,
  UpdateProjectDTO,
  ApiResponse,
  ProjectLabel,
  ProjectSettings,
  StatusFlow,
  Team,
} from "@packages/shared";

export const projectsApi = {
  // CRUD
  getAll: () => apiClient.get<ApiResponse<Project[]>>("/projects"),
  getById: (id: string | number) => apiClient.get<ApiResponse<Project>>(`/projects/${id}`),
  getBySlug: (slug: string) => apiClient.get<ApiResponse<Project>>(`/projects/slug/${slug}`),
  create: (data: CreateProjectDTO) => apiClient.post<ApiResponse<Project>>("/projects", data),
  update: (id: string | number, data: UpdateProjectDTO) => apiClient.put<ApiResponse<Project>>(`/projects/${id}`, data),
  delete: (id: string | number) => apiClient.delete<ApiResponse<void>>(`/projects/${id}`),

  // Por tenant
  getByTenant: (tenantId: string | number) => apiClient.get<ApiResponse<Project[]>>(`/projects/tenant/${tenantId}`),
  getByOwner: (ownerId: string | number) => apiClient.get<ApiResponse<Project[]>>(`/projects/owner/${ownerId}`),

  // Equipes
  getTeams: (id: string | number) => apiClient.get<ApiResponse<Team[]>>(`/projects/${id}/teams`),
  addTeam: (id: string | number, teamId: string | number) => apiClient.post<ApiResponse<void>>(`/projects/${id}/teams/${teamId}`),
  removeTeam: (id: string | number, teamId: string | number) => apiClient.delete<ApiResponse<void>>(`/projects/${id}/teams/${teamId}`),

  // Configurações
  getSettings: (id: string | number) => apiClient.get<ApiResponse<ProjectSettings>>(`/projects/${id}/settings`),
  createSettings: (id: string | number, data: any) => apiClient.post<ApiResponse<ProjectSettings>>(`/projects/${id}/settings`, data),
  updateSettings: (id: string | number, data: any) => apiClient.put<ApiResponse<ProjectSettings>>(`/projects/${id}/settings`, data),

  // Etiquetas
  getLabels: (id: string | number) => apiClient.get<ApiResponse<ProjectLabel[]>>(`/projects/${id}/labels`),
  createLabel: (id: string | number, data: any) => apiClient.post<ApiResponse<ProjectLabel>>(`/projects/${id}/labels`, data),
  updateLabel: (id: string | number, labelId: string | number, data: any) => apiClient.put<ApiResponse<ProjectLabel>>(`/projects/${id}/labels/${labelId}`, data),
  deleteLabel: (id: string | number, labelId: string | number) => apiClient.delete<ApiResponse<void>>(`/projects/${id}/labels/${labelId}`),

  // Fluxos de status
  getStatusFlows: (id: string | number) => apiClient.get<ApiResponse<StatusFlow[]>>(`/projects/${id}/status-flows`),
  createStatusFlow: (id: string | number, data: any) => apiClient.post<ApiResponse<StatusFlow>>(`/projects/${id}/status-flows`, data),
}; 