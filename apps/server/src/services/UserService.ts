import { userRepository } from "../repositories/UserRepository";
import {
  User,
  CreateUserInput,
  UpdateUserInput,
  ApiResponse,
} from "../models/User";

export class UserService {
  /**
   * Busca todos os usuários
   */
  async getAllUsers(): Promise<ApiResponse<User[]>> {
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
  async getUserById(id: number): Promise<ApiResponse<User>> {
    try {
      const user = await userRepository.findById(id);

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
  async createUser(data: CreateUserInput): Promise<ApiResponse<User>> {
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
  async updateUser(
    id: number,
    data: UpdateUserInput
  ): Promise<ApiResponse<User>> {
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
  async deleteUser(id: number): Promise<ApiResponse<null>> {
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
}

// Instância singleton do serviço
export const userService = new UserService();
