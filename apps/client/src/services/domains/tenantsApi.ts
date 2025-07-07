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
  getAll: () => apiClient.get<ApiResponse<Tenant[]>>("/tenants"),
  getById: (id: string | number) =>
    apiClient.get<ApiResponse<Tenant>>(`/tenants/${id}`),
  getBySlug: (slug: string) =>
    apiClient.get<ApiResponse<Tenant>>(`/tenants/slug/${slug}`),
  create: (data: CreateTenantDTO) =>
    apiClient.post<ApiResponse<Tenant>>("/tenants", data),
  update: (id: string | number, data: UpdateTenantDTO) =>
    apiClient.put<ApiResponse<Tenant>>(`/tenants/${id}`, data),
  delete: (id: string | number) =>
    apiClient.delete<ApiResponse<void>>(`/tenants/${id}`),

  // Roles
  getRoles: (id: string | number) =>
    apiClient.get<ApiResponse<Role[]>>(`/tenants/${id}/roles`),
  createRole: (id: string | number, data: any) =>
    apiClient.post<ApiResponse<Role>>(`/tenants/${id}/roles`, data),
  updateRole: (id: string | number, roleId: string | number, data: any) =>
    apiClient.put<ApiResponse<Role>>(`/tenants/${id}/roles/${roleId}`, data),
  deleteRole: (id: string | number, roleId: string | number) =>
    apiClient.delete<ApiResponse<void>>(`/tenants/${id}/roles/${roleId}`),

  // Convites
  getInvitations: (id: string | number) =>
    apiClient.get<ApiResponse<Invitation[]>>(`/tenants/${id}/invitations`),
  createInvitation: (id: string | number, data: any) =>
    apiClient.post<ApiResponse<Invitation>>(`/tenants/${id}/invitations`, data),
  acceptInvitation: (token: string) =>
    apiClient.post<ApiResponse<void>>(`/tenants/invitations/${token}/accept`),
  cancelInvitation: (id: string | number, invitationId: string | number) =>
    apiClient.delete<ApiResponse<void>>(
      `/tenants/${id}/invitations/${invitationId}`
    ),

  // Usuários do tenant
  getUsers: (id: string | number) =>
    apiClient.get<ApiResponse<User[]>>(`/tenants/${id}/users`),
  assignUserRole: (id: string | number, userId: string | number, data: any) =>
    apiClient.post<ApiResponse<void>>(
      `/tenants/${id}/users/${userId}/roles`,
      data
    ),
  removeUserRole: (
    id: string | number,
    userId: string | number,
    roleId: string | number
  ) =>
    apiClient.delete<ApiResponse<void>>(
      `/tenants/${id}/users/${userId}/roles/${roleId}`
    ),
};
