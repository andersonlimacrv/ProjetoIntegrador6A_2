import { TenantRepository } from "../repositories/TenantRepository";
import { UserRepository } from "../repositories/UserRepository";
import {
  CreateTenantInput,
  UpdateTenantInput,
  CreateRoleInput,
  UpdateRoleInput,
  CreateInvitationInput,
  AcceptInvitationInput,
  ApiResponse,
} from "@shared";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

export class TenantService {
  private tenantRepository: TenantRepository;
  private userRepository: UserRepository;

  constructor() {
    this.tenantRepository = new TenantRepository();
    this.userRepository = new UserRepository();
  }

  /**
   * Cria um novo tenant
   */
  async createTenant(data: CreateTenantInput): Promise<ApiResponse<any>> {
    try {
      // Verifica se o slug já existe
      const existingTenant = await this.tenantRepository.findBySlug(data.slug);
      if (existingTenant) {
        return {
          success: false,
          error: "Slug já existe",
        };
      }

      const tenant = await this.tenantRepository.create({
        id: randomUUID(),
        name: data.name,
        slug: data.slug,
        description: data.description,
        avatarUrl: data.avatarUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return {
        success: true,
        data: tenant,
        message: "Tenant criado com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        error: "Erro ao criar tenant",
      };
    }
  }

  /**
   * Busca um tenant por ID
   */
  async getTenantById(id: string): Promise<ApiResponse<any>> {
    try {
      const tenant = await this.tenantRepository.findById(id);
      if (!tenant) {
        return {
          success: false,
          error: "Tenant não encontrado",
        };
      }

      return {
        success: true,
        data: tenant,
      };
    } catch (error) {
      return {
        success: false,
        error: "Erro ao buscar tenant",
      };
    }
  }

  /**
   * Busca um tenant por slug
   */
  async getTenantBySlug(slug: string): Promise<ApiResponse<any>> {
    try {
      const tenant = await this.tenantRepository.findBySlug(slug);
      if (!tenant) {
        return {
          success: false,
          error: "Tenant não encontrado",
        };
      }

      return {
        success: true,
        data: tenant,
      };
    } catch (error) {
      return {
        success: false,
        error: "Erro ao buscar tenant",
      };
    }
  }

  /**
   * Lista todos os tenants
   */
  async getAllTenants(): Promise<ApiResponse<any>> {
    try {
      const tenants = await this.tenantRepository.findAll();
      return {
        success: true,
        data: tenants,
      };
    } catch (error) {
      return {
        success: false,
        error: "Erro ao listar tenants",
      };
    }
  }

  /**
   * Atualiza um tenant
   */
  async updateTenant(
    id: string,
    data: UpdateTenantInput
  ): Promise<ApiResponse<any>> {
    try {
      const tenant = await this.tenantRepository.findById(id);
      if (!tenant) {
        return {
          success: false,
          error: "Tenant não encontrado",
        };
      }

      // Verifica se o slug já existe (se foi alterado)
      if (data.slug && data.slug !== tenant.slug) {
        const existingTenant = await this.tenantRepository.findBySlug(
          data.slug
        );
        if (existingTenant) {
          return {
            success: false,
            error: "Slug já existe",
          };
        }
      }

      const updatedTenant = await this.tenantRepository.update(id, data);
      if (!updatedTenant) {
        return {
          success: false,
          error: "Erro ao atualizar tenant",
        };
      }

      return {
        success: true,
        data: updatedTenant,
        message: "Tenant atualizado com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        error: "Erro ao atualizar tenant",
      };
    }
  }

  /**
   * Deleta um tenant
   */
  async deleteTenant(id: string): Promise<ApiResponse<any>> {
    try {
      const tenant = await this.tenantRepository.findById(id);
      if (!tenant) {
        return {
          success: false,
          error: "Tenant não encontrado",
        };
      }

      const deleted = await this.tenantRepository.delete(id);
      if (!deleted) {
        return {
          success: false,
          error: "Erro ao deletar tenant",
        };
      }

      return {
        success: true,
        message: "Tenant deletado com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        error: "Erro ao deletar tenant",
      };
    }
  }

  /**
   * Adiciona um usuário ao tenant
   */
  async addUserToTenant(
    tenantId: string,
    userId: string,
    status: string = "active"
  ): Promise<ApiResponse<any>> {
    try {
      const tenant = await this.tenantRepository.findById(tenantId);
      if (!tenant) {
        return {
          success: false,
          error: "Tenant não encontrado",
        };
      }

      const user = await this.userRepository.findById(userId);
      if (!user) {
        return {
          success: false,
          error: "Usuário não encontrado",
        };
      }

      const userTenant = await this.tenantRepository.addUser(
        tenantId,
        userId,
        status
      );

      return {
        success: true,
        data: userTenant,
        message: "Usuário adicionado ao tenant com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        error: "Erro ao adicionar usuário ao tenant",
      };
    }
  }

  /**
   * Remove um usuário do tenant
   */
  async removeUserFromTenant(
    tenantId: string,
    userId: string
  ): Promise<ApiResponse<any>> {
    try {
      const removed = await this.tenantRepository.removeUser(tenantId, userId);
      if (!removed) {
        return {
          success: false,
          error: "Erro ao remover usuário do tenant",
        };
      }

      return {
        success: true,
        message: "Usuário removido do tenant com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        error: "Erro ao remover usuário do tenant",
      };
    }
  }

  /**
   * Lista usuários do tenant
   */
  async getTenantUsers(tenantId: string): Promise<ApiResponse<any>> {
    try {
      const tenant = await this.tenantRepository.findById(tenantId);
      if (!tenant) {
        return {
          success: false,
          error: "Tenant não encontrado",
        };
      }

      const users = await this.tenantRepository.findUsers(tenantId);

      return {
        success: true,
        data: users,
      };
    } catch (error) {
      return {
        success: false,
        error: "Erro ao listar usuários do tenant",
      };
    }
  }

  /**
   * Cria um role para o tenant
   */
  async createRole(
    tenantId: string,
    data: CreateRoleInput
  ): Promise<ApiResponse<any>> {
    try {
      const tenant = await this.tenantRepository.findById(tenantId);
      if (!tenant) {
        return {
          success: false,
          error: "Tenant não encontrado",
        };
      }

      const role = await this.tenantRepository.createRole(tenantId, {
        name: data.name,
        displayName: data.displayName,
        description: data.description,
        isSystemRole: data.isSystemRole || false,
      });

      return {
        success: true,
        data: role,
        message: "Role criado com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        error: "Erro ao criar role",
      };
    }
  }

  /**
   * Lista roles do tenant
   */
  async getTenantRoles(tenantId: string): Promise<ApiResponse<any>> {
    try {
      const tenant = await this.tenantRepository.findById(tenantId);
      if (!tenant) {
        return {
          success: false,
          error: "Tenant não encontrado",
        };
      }

      const roles = await this.tenantRepository.findRoles(tenantId);

      return {
        success: true,
        data: roles,
      };
    } catch (error) {
      return {
        success: false,
        error: "Erro ao listar roles do tenant",
      };
    }
  }

  /**
   * Cria um convite
   */
  async createInvitation(
    data: CreateInvitationInput
  ): Promise<ApiResponse<any>> {
    try {
      const tenant = await this.tenantRepository.findById(data.tenantId);
      if (!tenant) {
        return {
          success: false,
          error: "Tenant não encontrado",
        };
      }

      const invitedBy = await this.userRepository.findById(data.invitedBy);
      if (!invitedBy) {
        return {
          success: false,
          error: "Usuário que fez o convite não encontrado",
        };
      }

      const token = randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Expira em 7 dias

      const invitation = await this.tenantRepository.createInvitation({
        tenantId: data.tenantId,
        invitedBy: data.invitedBy,
        email: data.email,
        roleId: data.roleId,
        token,
        status: "pending",
        expiresAt,
      });

      return {
        success: true,
        data: invitation,
        message: "Convite criado com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        error: "Erro ao criar convite",
      };
    }
  }

  /**
   * Aceita um convite
   */
  async acceptInvitation(
    data: AcceptInvitationInput
  ): Promise<ApiResponse<any>> {
    try {
      const invitation = await this.tenantRepository.findInvitationByToken(
        data.token
      );
      if (!invitation) {
        return {
          success: false,
          error: "Convite não encontrado",
        };
      }

      if (invitation.status !== "pending") {
        return {
          success: false,
          error: "Convite já foi usado ou expirou",
        };
      }

      if (invitation.expiresAt < new Date()) {
        return {
          success: false,
          error: "Convite expirou",
        };
      }

      // Cria o usuário
      const hashedPassword = await bcrypt.hash(data.password, 12);
      const user = await this.userRepository.create({
        email: invitation.email,
        password: data.password,
        name: data.name,
      });

      // Adiciona o usuário ao tenant
      await this.tenantRepository.addUser(
        invitation.tenantId,
        user.id,
        "active"
      );

      // Atualiza o status do convite
      await this.tenantRepository.updateInvitationStatus(
        data.token,
        "accepted",
        new Date()
      );

      return {
        success: true,
        data: user,
        message: "Convite aceito com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        error: "Erro ao aceitar convite",
      };
    }
  }

  /**
   * Lista convites do tenant
   */
  async getTenantInvitations(tenantId: string): Promise<ApiResponse<any>> {
    try {
      const tenant = await this.tenantRepository.findById(tenantId);
      if (!tenant) {
        return {
          success: false,
          error: "Tenant não encontrado",
        };
      }

      const invitations = await this.tenantRepository.findInvitations(tenantId);

      return {
        success: true,
        data: invitations,
      };
    } catch (error) {
      return {
        success: false,
        error: "Erro ao listar convites do tenant",
      };
    }
  }
}

// Instância singleton do service
export const tenantService = new TenantService();
