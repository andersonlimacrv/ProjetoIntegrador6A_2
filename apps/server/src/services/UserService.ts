import { userRepository } from "../repositories/UserRepository";
import {
  /* User, */
  CreateUserDTO,
  UpdateUserDTO,
  LoginUserDTO,
  ApiResponse,
} from "../../../packages/shared/src";
/* import { randomUUID } from "crypto"; */
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env["JWT_SECRET"] || "your-secret-key";

export class UserService {
  /**
   * Busca todos os usuários
   */
  async getAllUsers(): Promise<ApiResponse<any[]>> {
    try {
      const users = await userRepository.findAll();
      return {
        success: true,
        data: users,
      };
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      return {
        success: false,
        error: "Erro interno ao buscar usuários",
      };
    }
  }

  /**
   * Busca um usuário por ID
   */
  async getUserById(id: string): Promise<ApiResponse<any>> {
    try {
      const user = await userRepository.findById(id);

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
      const user = await userRepository.findByEmail(email);

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
      const emailExists = await userRepository.emailExists(data.email);
      if (emailExists) {
        return {
          success: false,
          error: "Email já está em uso",
        };
      }

      const newUser = await userRepository.create(data);

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
      const existingUser = await userRepository.findById(id);
      if (!existingUser) {
        return {
          success: false,
          error: "Usuário não encontrado",
        };
      }

      // Se o email está sendo atualizado, verifica se já existe
      if (data.email && data.email !== existingUser.email) {
        const emailExists = await userRepository.emailExists(data.email, id);
        if (emailExists) {
          return {
            success: false,
            error: "Email já está em uso",
          };
        }
      }

      const updatedUser = await userRepository.update(id, data);

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
      const existingUser = await userRepository.findById(id);
      if (!existingUser) {
        return {
          success: false,
          error: "Usuário não encontrado",
        };
      }

      const deleted = await userRepository.delete(id);

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
      const user = await userRepository.authenticate(data);

      if (!user) {
        return {
          success: false,
          error: "Email ou senha inválidos",
        };
      }

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
      const session = await userRepository.createSession({
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
      const deleted = await userRepository.deleteSession(sessionId);

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

      const user = await userRepository.findById(decoded.userId);
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
      const user = await userRepository.findById(userId);
      if (!user) {
        return {
          success: false,
          error: "Usuário não encontrado",
        };
      }

      const tenants = await userRepository.findUserTenants(userId);

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
      const activity = await userRepository.logActivity({
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
      const activities = await userRepository.findUserActivities(userId, limit);

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
      const activities = await userRepository.findTenantActivities(
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
      const deletedCount = await userRepository.deleteExpiredSessions();

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
}

// Instância singleton do serviço
export const userService = new UserService();
