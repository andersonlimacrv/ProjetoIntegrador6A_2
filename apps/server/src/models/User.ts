// Re-exportando tipos do pacote shared relacionados a usuário
export type {
  User,
  Tenant,
  UserTenant,
  Role,
  Permission,
  UserRole,
  Invitation,
  CreateUserDTO,
  UpdateUserDTO,
  LoginUserDTO,
  CreateTenantDTO,
  UpdateTenantDTO,
  CreateRoleDTO,
  UpdateRoleDTO,
  CreateInvitationDTO,
  AcceptInvitationDTO,
  ApiResponse,
  CreateUserInput,
  UpdateUserInput,
  LoginUserInput,
  UserIdInput,
  CreateTenantInput,
  UpdateTenantInput,
  TenantIdInput,
  TenantSlugInput,
  CreateRoleInput,
  UpdateRoleInput,
  RoleIdInput,
  CreateInvitationInput,
  AcceptInvitationInput,
  InvitationTokenInput,
} from "@packages/shared";

import { User } from "@shared";

export type { User };
