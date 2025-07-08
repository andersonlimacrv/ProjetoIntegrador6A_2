import { apiClient } from "../apiClient";
import type {
  Tenant,
  CreateTenantDTO,
  UpdateTenantDTO,
  ApiResponse,
  Role,
  Invitation,
  User,
} from "@packages/shared";

export const tenantsApi = {
  // CRUD
  getAll: async () => {
    const response = await apiClient.get<ApiResponse<Tenant[]>>("/tenants");
    return response;
  },
  getById: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<Tenant>>(`/tenants/${id}`);
    return response;
  },
  getBySlug: async (slug: string) => {
    const response = await apiClient.get<ApiResponse<Tenant>>(
      `/tenants/slug/${slug}`
    );
    return response;
  },
  create: async (data: CreateTenantDTO) => {
    const response = await apiClient.post<ApiResponse<Tenant>>(
      "/tenants",
      data
    );
    return response;
  },
  update: async (id: string | number, data: UpdateTenantDTO) => {
    const response = await apiClient.put<ApiResponse<Tenant>>(
      `/tenants/${id}`,
      data
    );
    return response;
  },
  delete: async (id: string | number) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/tenants/${id}`
    );
    return response;
  },

  // Roles
  getRoles: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<Role[]>>(
      `/tenants/${id}/roles`
    );
    return response;
  },
  createRole: async (id: string | number, data: any) => {
    const response = await apiClient.post<ApiResponse<Role>>(
      `/tenants/${id}/roles`,
      data
    );
    return response;
  },
  updateRole: async (
    id: string | number,
    roleId: string | number,
    data: any
  ) => {
    const response = await apiClient.put<ApiResponse<Role>>(
      `/tenants/${id}/roles/${roleId}`,
      data
    );
    return response;
  },
  deleteRole: async (id: string | number, roleId: string | number) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/tenants/${id}/roles/${roleId}`
    );
    return response;
  },

  // Convites
  getInvitations: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<Invitation[]>>(
      `/tenants/${id}/invitations`
    );
    return response;
  },
  createInvitation: async (id: string | number, data: any) => {
    const response = await apiClient.post<ApiResponse<Invitation>>(
      `/tenants/${id}/invitations`,
      data
    );
    return response;
  },
  acceptInvitation: async (token: string) => {
    const response = await apiClient.post<ApiResponse<void>>(
      `/tenants/invitations/${token}/accept`
    );
    return response;
  },
  cancelInvitation: async (
    id: string | number,
    invitationId: string | number
  ) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/tenants/${id}/invitations/${invitationId}`
    );
    return response;
  },

  // Usuários
  getUsers: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<User[]>>(
      `/tenants/${id}/users`
    );
    return response;
  },
  addUser: async (
    id: string | number,
    userId: string | number,
    roleId: string | number
  ) => {
    const response = await apiClient.post<ApiResponse<void>>(
      `/tenants/${id}/users/${userId}`,
      { roleId }
    );
    return response;
  },
  updateUserRole: async (
    id: string | number,
    userId: string | number,
    roleId: string | number
  ) => {
    const response = await apiClient.put<ApiResponse<void>>(
      `/tenants/${id}/users/${userId}`,
      { roleId }
    );
    return response;
  },
  removeUser: async (id: string | number, userId: string | number) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/tenants/${id}/users/${userId}`
    );
    return response;
  },
};
