import { UserRepository } from "../repositories/UserRepository";
import {
  User,
  CreateUserDTO,
  UpdateUserDTO,
  LoginUserDTO,
  ApiResponse,
} from "@shared";
/* import { randomUUID } from "crypto"; */
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env["JWT_SECRET"] || "your-secret-key";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }
  /**
   * Busca todos os usuários
   */
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    try {
      const users = await this.userRepository.findAll();
      return {
        success: true,
        data: users,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro ao buscar usuários",
      };
    }
  }

  /**
   * Busca um usuário por ID
   */
  async getUserById(id: string): Promise<ApiResponse<any>> {
    try {
      const user = await this.userRepository.findById(id);

      if (!user) {
        return {
          success: false,
          error: "Usuário não encontrado SERVER",
        };
      }

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      return {
        success: false,
        error: "Erro interno ao buscar usuário",
      };
    }
  }

  /**
   * Busca um usuário por email
   */
  async getUserByEmail(email: string): Promise<ApiResponse<any>> {
    try {
      const user = await this.userRepository.findByEmail(email);

      if (!user) {
        return {
          success: false,
          error: "Usuário não encontrado",
        };
      }

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      return {
        success: false,
        error: "Erro interno ao buscar usuário",
      };
    }
  }

  /**
   * Cria um novo usuário
   */
  async createUser(data: CreateUserDTO): Promise<ApiResponse<any>> {
    try {
      // Verifica se o email já existe
      const emailExists = await this.userRepository.emailExists(data.email);
      if (emailExists) {
        return {
          success: false,
          error: "Email já está em uso",
        };
      }

      const newUser = await this.userRepository.create(data);

      return {
        success: true,
        data: newUser,
        message: "Usuário criado com sucesso",
      };
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      return {
        success: false,
        error: "Erro interno ao criar usuário",
      };
    }
  }

  /**
   * Atualiza um usuário existente
   */
  async updateUser(id: string, data: UpdateUserDTO): Promise<ApiResponse<any>> {
    try {
      // Verifica se o usuário existe
      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) {
        return {
          success: false,
          error: "Usuário não encontrado",
        };
      }

      // Se o email está sendo atualizado, verifica se já existe
      if (data.email && data.email !== existingUser.email) {
        const emailExists = await this.userRepository.emailExists(
          data.email,
          id
        );
        if (emailExists) {
          return {
            success: false,
            error: "Email já está em uso",
          };
        }
      }

      const updatedUser = await this.userRepository.update(id, data);

      if (!updatedUser) {
        return {
          success: false,
          error: "Erro ao atualizar usuário",
        };
      }

      return {
        success: true,
        data: updatedUser,
        message: "Usuário atualizado com sucesso",
      };
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      return {
        success: false,
        error: "Erro interno ao atualizar usuário",
      };
    }
  }

  /**
   * Deleta um usuário
   */
  async deleteUser(id: string): Promise<ApiResponse<null>> {
    try {
      // Verifica se o usuário existe
      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) {
        return {
          success: false,
          error: "Usuário não encontrado",
        };
      }

      const deleted = await this.userRepository.delete(id);

      if (!deleted) {
        return {
          success: false,
          error: "Erro ao deletar usuário",
        };
      }

      return {
        success: true,
        message: "Usuário deletado com sucesso",
      };
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      return {
        success: false,
        error: "Erro interno ao deletar usuário",
      };
    }
  }

  /**
   * Autentica um usuário
   */
  async login(data: LoginUserDTO): Promise<ApiResponse<any>> {
    try {
      const user = await this.userRepository.authenticate(data);

      if (!user) {
        return {
          success: false,
          error: "Email ou senha inválidos",
        };
      }

      // Busca o tenant do usuário
      const userTenants = await this.userRepository.findUserTenants(user.id);
      const tenant = userTenants.length > 0 ? userTenants[0].tenant : null;

      // Gera token JWT
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          name: user.name,
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Cria sessão
      const session = await this.userRepository.createSession({
        userId: user.id,
        tokenHash: token, // Em produção, deve ser um hash do token
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
      });

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            avatarUrl: user.avatarUrl,
          },
          tenant,
          token,
          sessionId: session.id,
        },
        message: "Login realizado com sucesso",
      };
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return {
        success: false,
        error: "Erro interno ao fazer login",
      };
    }
  }

  /**
   * Faz logout do usuário
   */
  async logout(sessionId: string): Promise<ApiResponse<null>> {
    try {
      const deleted = await this.userRepository.deleteSession(sessionId);

      if (!deleted) {
        return {
          success: false,
          error: "Sessão não encontrada",
        };
      }

      return {
        success: true,
        message: "Logout realizado com sucesso",
      };
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      return {
        success: false,
        error: "Erro interno ao fazer logout",
      };
    }
  }

  /**
   * Valida token JWT
   */
  async validateToken(token: string): Promise<ApiResponse<any>> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;

      const user = await this.userRepository.findById(decoded.userId);
      if (!user || !user.isActive) {
        return {
          success: false,
          error: "Token inválido",
        };
      }

      return {
        success: true,
        data: {
          userId: user.id,
          email: user.email,
          name: user.name,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: "Token inválido",
      };
    }
  }

  /**
   * Busca tenants do usuário
   */
  async getUserTenants(userId: string): Promise<ApiResponse<any>> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return {
          success: false,
          error: "Usuário não encontrado",
        };
      }

      const tenants = await this.userRepository.findUserTenants(userId);

      return {
        success: true,
        data: tenants,
      };
    } catch (error) {
      console.error("Erro ao buscar tenants do usuário:", error);
      return {
        success: false,
        error: "Erro interno ao buscar tenants",
      };
    }
  }

  /**
   * Registra atividade do usuário
   */
  async logActivity(
    userId: string,
    tenantId: string,
    action: string,
    entityType: string,
    entityId: string,
    oldValues?: any,
    newValues?: any
  ): Promise<ApiResponse<any>> {
    try {
      const activity = await this.userRepository.logActivity({
        userId,
        tenantId,
        action,
        entityType,
        entityId,
        oldValues,
        newValues,
      });

      return {
        success: true,
        data: activity,
      };
    } catch (error) {
      console.error("Erro ao registrar atividade:", error);
      return {
        success: false,
        error: "Erro interno ao registrar atividade",
      };
    }
  }

  /**
   * Busca atividades do usuário
   */
  async getUserActivities(
    userId: string,
    limit: number = 50
  ): Promise<ApiResponse<any>> {
    try {
      const activities = await this.userRepository.findUserActivities(
        userId,
        limit
      );

      return {
        success: true,
        data: activities,
      };
    } catch (error) {
      console.error("Erro ao buscar atividades do usuário:", error);
      return {
        success: false,
        error: "Erro interno ao buscar atividades",
      };
    }
  }

  /**
   * Busca atividades do tenant
   */
  async getTenantActivities(
    tenantId: string,
    limit: number = 50
  ): Promise<ApiResponse<any>> {
    try {
      const activities = await this.userRepository.findTenantActivities(
        tenantId,
        limit
      );

      return {
        success: true,
        data: activities,
      };
    } catch (error) {
      console.error("Erro ao buscar atividades do tenant:", error);
      return {
        success: false,
        error: "Erro interno ao buscar atividades",
      };
    }
  }

  /**
   * Limpa sessões expiradas
   */
  async cleanupExpiredSessions(): Promise<ApiResponse<any>> {
    try {
      const deletedCount = await this.userRepository.deleteExpiredSessions();

      return {
        success: true,
        data: { deletedCount },
        message: `${deletedCount} sessões expiradas foram removidas`,
      };
    } catch (error) {
      console.error("Erro ao limpar sessões expiradas:", error);
      return {
        success: false,
        error: "Erro interno ao limpar sessões",
      };
    }
  }

  /**
   * Cria tenant e usuário juntos (registro inicial)
   */
  async registerWithTenant({
    name,
    email,
    password,
    companyName,
  }: {
    name: string;
    email: string;
    password: string;
    companyName: string;
  }): Promise<ApiResponse<any>> {
    try {
      // Verifica se já existe tenant com esse nome
      const tenantRepo =
        new (require("../repositories/TenantRepository").TenantRepository)();
      const existingTenant = await tenantRepo.findBySlug(
        companyName.toLowerCase().replace(/[^a-z0-9-]/g, "-")
      );
      if (existingTenant) {
        return { success: false, error: "Empresa já cadastrada" };
      }
      // Cria tenant
      const tenant = await tenantRepo.create({
        id: require("crypto").randomUUID(),
        name: companyName,
        slug: companyName.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
        description: null,
        avatarUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      // Cria usuário
      const user = await this.createUser({ name, email, password });
      if (!user.success || !user.data) {
        return { success: false, error: user.error || "Erro ao criar usuário" };
      }
      // Associa usuário ao tenant como admin
      await tenantRepo.addUser(tenant.id, user.data.id, "active");
      // TODO: criar role admin e associar
      // Retorna usuário e tenant
      return {
        success: true,
        data: { user: user.data, tenant },
        message: "Cadastro realizado com sucesso",
      };
    } catch (error) {
      return { success: false, error: "Erro ao registrar usuário e tenant" };
    }
  }
}

// Instância singleton do serviço
export const userService = new UserService();
