import { apiClient } from "../apiClient";
import type {
  Project,
  CreateProjectDTO,
  UpdateProjectDTO,
  ApiResponse,
  ProjectLabel,
  ProjectSetting,
  Team,
} from "@packages/shared";

export const projectsApi = {
  // CRUD
  getAll: async () => {
    const response = await apiClient.get<ApiResponse<Project[]>>("/projects");
    return response;
  },
  getById: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<Project>>(
      `/projects/${id}`
    );
    return response;
  },
  getBySlug: async (slug: string) => {
    const response = await apiClient.get<ApiResponse<Project>>(
      `/projects/slug/${slug}`
    );
    return response;
  },
  create: async (data: CreateProjectDTO) => {
    console.log("📤 projectsApi.create - Enviando dados:", data);
    const response = await apiClient.post<ApiResponse<Project>>(
      "/projects",
      data
    );
    console.log("📥 projectsApi.create - Resposta recebida:", {
      status: response.status,
      ok: response.ok,
      data: response.data,
    });
    return response;
  },
  update: async (id: string | number, data: UpdateProjectDTO) => {
    const response = await apiClient.put<ApiResponse<Project>>(
      `/projects/${id}`,
      data
    );
    return response;
  },
  delete: async (id: string | number) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/projects/${id}`
    );
    return response;
  },

  // Por tenant
  getByTenant: async (tenantId: string | number) => {
    const response = await apiClient.get<ApiResponse<Project[]>>(
      `/projects/tenant/${tenantId}`
    );
    return response;
  },
  getByOwner: async (ownerId: string | number) => {
    const response = await apiClient.get<ApiResponse<Project[]>>(
      `/projects/owner/${ownerId}`
    );
    return response;
  },

  // Equipes
  getTeams: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<Team[]>>(
      `/projects/${id}/teams`
    );
    return response;
  },
  addTeam: async (id: string | number, teamId: string | number) => {
    const response = await apiClient.post<ApiResponse<void>>(
      `/projects/${id}/teams/${teamId}`
    );
    return response;
  },
  removeTeam: async (id: string | number, teamId: string | number) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/projects/${id}/teams/${teamId}`
    );
    return response;
  },

  // Configurações
  getSettings: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<ProjectSetting>>(
      `/projects/${id}/settings`
    );
    return response;
  },
  createSettings: async (id: string | number, data: any) => {
    const response = await apiClient.post<ApiResponse<ProjectSetting>>(
      `/projects/${id}/settings`,
      data
    );
    return response;
  },
  updateSettings: async (id: string | number, data: any) => {
    const response = await apiClient.put<ApiResponse<ProjectSetting>>(
      `/projects/${id}/settings`,
      data
    );
    return response;
  },

  // Etiquetas
  getLabels: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<ProjectLabel[]>>(
      `/projects/${id}/labels`
    );
    return response;
  },
  createLabel: async (id: string | number, data: any) => {
    const response = await apiClient.post<ApiResponse<ProjectLabel>>(
      `/projects/${id}/labels`,
      data
    );
    return response;
  },
  updateLabel: async (
    id: string | number,
    labelId: string | number,
    data: any
  ) => {
    const response = await apiClient.put<ApiResponse<ProjectLabel>>(
      `/projects/${id}/labels/${labelId}`,
      data
    );
    return response;
  },
  deleteLabel: async (id: string | number, labelId: string | number) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/projects/${id}/labels/${labelId}`
    );
    return response;
  },

  // Fluxos de status
  getStatusFlows: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<any[]>>(
      `/projects/${id}/status-flows`
    );
    return response;
  },
  createStatusFlow: async (id: string | number, data: any) => {
    const response = await apiClient.post<ApiResponse<any>>(
      `/projects/${id}/status-flows`,
      data
    );
    return response;
  },
};
