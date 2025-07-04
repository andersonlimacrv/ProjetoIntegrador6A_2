import { Context } from "hono";
import { UserService } from "../services/UserService";
import {
  ApiResponse,
  User,
  CreateUserInput,
  UpdateUserInput,
  UserIdInput,
} from "@shared";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async createUser(c: Context): Promise<Response> {
    try {
      const input: CreateUserInput = await c.req.json();
      const user = await this.userService.createUser(input);

      return c.json<ApiResponse<User>>({
        success: true,
        data: user,
        message: "Usuário criado com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error ? error.message : "Erro ao criar usuário",
        },
        400
      );
    }
  }

  async getUserById(c: Context): Promise<Response> {
    try {
      const { id } = c.req.param() as UserIdInput;
      const user = await this.userService.getUserById(parseInt(id));

      if (!user) {
        return c.json<ApiResponse<null>>(
          {
            success: false,
            data: null,
            message: "Usuário não encontrado",
          },
          404
        );
      }

      return c.json<ApiResponse<User>>({
        success: true,
        data: user,
        message: "Usuário encontrado com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error ? error.message : "Erro ao buscar usuário",
        },
        400
      );
    }
  }

  async getAllUsers(c: Context): Promise<Response> {
    try {
      const users = await this.userService.getAllUsers();

      return c.json<ApiResponse<User[]>>({
        success: true,
        data: users,
        message: "Usuários listados com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error ? error.message : "Erro ao listar usuários",
        },
        400
      );
    }
  }

  async updateUser(c: Context): Promise<Response> {
    try {
      const { id } = c.req.param() as UserIdInput;
      const input: UpdateUserInput = await c.req.json();
      const user = await this.userService.updateUser(parseInt(id), input);

      if (!user) {
        return c.json<ApiResponse<null>>(
          {
            success: false,
            data: null,
            message: "Usuário não encontrado",
          },
          404
        );
      }

      return c.json<ApiResponse<User>>({
        success: true,
        data: user,
        message: "Usuário atualizado com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error
              ? error.message
              : "Erro ao atualizar usuário",
        },
        400
      );
    }
  }

  async deleteUser(c: Context): Promise<Response> {
    try {
      const { id } = c.req.param() as UserIdInput;
      const success = await this.userService.deleteUser(parseInt(id));

      if (!success) {
        return c.json<ApiResponse<null>>(
          {
            success: false,
            data: null,
            message: "Usuário não encontrado",
          },
          404
        );
      }

      return c.json<ApiResponse<null>>({
        success: true,
        data: null,
        message: "Usuário deletado com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error ? error.message : "Erro ao deletar usuário",
        },
        400
      );
    }
  }

  async getUserByEmail(c: Context): Promise<Response> {
    try {
      const { email } = c.req.param();
      const user = await this.userService.getUserByEmail(email);

      if (!user) {
        return c.json<ApiResponse<null>>(
          {
            success: false,
            data: null,
            message: "Usuário não encontrado",
          },
          404
        );
      }

      return c.json<ApiResponse<User>>({
        success: true,
        data: user,
        message: "Usuário encontrado com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error ? error.message : "Erro ao buscar usuário",
        },
        400
      );
    }
  }

  async getUsersByTeam(c: Context): Promise<Response> {
    try {
      const { teamId } = c.req.param();
      const users = await this.userService.getUsersByTeam(parseInt(teamId));

      return c.json<ApiResponse<User[]>>({
        success: true,
        data: users,
        message: "Usuários da equipe listados com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error
              ? error.message
              : "Erro ao listar usuários da equipe",
        },
        400
      );
    }
  }

  async getUsersByTenant(c: Context): Promise<Response> {
    try {
      const { tenantId } = c.req.param();
      const users = await this.userService.getUsersByTenant(parseInt(tenantId));

      return c.json<ApiResponse<User[]>>({
        success: true,
        data: users,
        message: "Usuários do tenant listados com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error
              ? error.message
              : "Erro ao listar usuários do tenant",
        },
        400
      );
    }
  }

  async login(c: Context): Promise<Response> {
    try {
      const { email, password } = await c.req.json();
      const result = await this.userService.login(email, password);

      return c.json<ApiResponse<any>>({
        success: true,
        data: result,
        message: "Login realizado com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message: error instanceof Error ? error.message : "Erro no login",
        },
        401
      );
    }
  }

  async logout(c: Context): Promise<Response> {
    try {
      const { token } = await c.req.json();
      await this.userService.logout(token);

      return c.json<ApiResponse<null>>({
        success: true,
        data: null,
        message: "Logout realizado com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message: error instanceof Error ? error.message : "Erro no logout",
        },
        400
      );
    }
  }

  async refreshToken(c: Context): Promise<Response> {
    try {
      const { refreshToken } = await c.req.json();
      const result = await this.userService.refreshToken(refreshToken);

      return c.json<ApiResponse<any>>({
        success: true,
        data: result,
        message: "Token renovado com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error ? error.message : "Erro ao renovar token",
        },
        401
      );
    }
  }

  async getUserSessions(c: Context): Promise<Response> {
    try {
      const { id } = c.req.param();
      const sessions = await this.userService.getUserSessions(parseInt(id));

      return c.json<ApiResponse<any[]>>({
        success: true,
        data: sessions,
        message: "Sessões do usuário listadas com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error ? error.message : "Erro ao listar sessões",
        },
        400
      );
    }
  }

  async deleteSession(c: Context): Promise<Response> {
    try {
      const { id, sessionId } = c.req.param();
      await this.userService.deleteSession(parseInt(id), parseInt(sessionId));

      return c.json<ApiResponse<null>>({
        success: true,
        data: null,
        message: "Sessão deletada com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error ? error.message : "Erro ao deletar sessão",
        },
        400
      );
    }
  }

  async getUserActivities(c: Context): Promise<Response> {
    try {
      const { id } = c.req.param();
      const activities = await this.userService.getUserActivities(parseInt(id));

      return c.json<ApiResponse<any[]>>({
        success: true,
        data: activities,
        message: "Atividades do usuário listadas com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error
              ? error.message
              : "Erro ao listar atividades",
        },
        400
      );
    }
  }

  async getUserTenants(c: Context): Promise<Response> {
    try {
      const { id } = c.req.param();
      const tenants = await this.userService.getUserTenants(parseInt(id));

      return c.json<ApiResponse<any[]>>({
        success: true,
        data: tenants,
        message: "Tenants do usuário listados com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error ? error.message : "Erro ao listar tenants",
        },
        400
      );
    }
  }

  async getUserTeams(c: Context): Promise<Response> {
    try {
      const { id } = c.req.param();
      const teams = await this.userService.getUserTeams(parseInt(id));

      return c.json<ApiResponse<any[]>>({
        success: true,
        data: teams,
        message: "Equipes do usuário listadas com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error ? error.message : "Erro ao listar equipes",
        },
        400
      );
    }
  }
}
