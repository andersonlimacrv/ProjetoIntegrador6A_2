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
      return c.json(
        {
          ...user,
          message: user.success
            ? "Usuário criado com sucesso"
            : user.error || "Erro ao criar usuário",
        },
        user.success ? 201 : 400
      );
    } catch (error) {
      return c.json(
        {
          success: false,
          data: null,
          message:
            error instanceof Error ? error.message : "Erro ao criar usuário",
        },
        500
      );
    }
  }

  async getUserById(c: Context): Promise<Response> {
    try {
      const { id } = c.req.param() as UserIdInput;
      const user = await this.userService.getUserById(id);
      return c.json(
        {
          ...user,
          message: user.success
            ? "Usuário encontrado com sucesso"
            : "Usuário não encontrado",
        },
        user.success ? 200 : 404
      );
    } catch (error) {
      return c.json(
        {
          success: false,
          data: null,
          message:
            error instanceof Error ? error.message : "Erro ao buscar usuário",
        },
        500
      );
    }
  }

  async getAllUsers(c: Context): Promise<Response> {
    try {
      const users = await this.userService.getAllUsers();
      return c.json(
        { ...users, message: "Usuários listados com sucesso" },
        users.success ? 200 : 400
      );
    } catch (error) {
      return c.json(
        {
          success: false,
          data: null,
          message:
            error instanceof Error ? error.message : "Erro ao listar usuários",
        },
        500
      );
    }
  }

  async updateUser(c: Context): Promise<Response> {
    try {
      const { id } = c.req.param() as UserIdInput;
      const input: UpdateUserInput = await c.req.json();
      const user = await this.userService.updateUser(id, input);
      return c.json(
        {
          ...user,
          message: user.success
            ? "Usuário atualizado com sucesso"
            : user.error || "Usuário não encontrado",
        },
        user.success ? 200 : 404
      );
    } catch (error) {
      return c.json(
        {
          success: false,
          data: null,
          message:
            error instanceof Error
              ? error.message
              : "Erro ao atualizar usuário",
        },
        500
      );
    }
  }

  async deleteUser(c: Context): Promise<Response> {
    try {
      const { id } = c.req.param() as UserIdInput;
      const deleted = await this.userService.deleteUser(id);
      return c.json(
        {
          ...deleted,
          message: deleted.success
            ? "Usuário deletado com sucesso"
            : deleted.error || "Usuário não encontrado",
        },
        deleted.success ? 200 : 404
      );
    } catch (error) {
      return c.json(
        {
          success: false,
          data: null,
          message:
            error instanceof Error ? error.message : "Erro ao deletar usuário",
        },
        500
      );
    }
  }

  async getUserByEmail(c: Context): Promise<Response> {
    try {
      const { email } = c.req.param();
      const user = await this.userService.getUserByEmail(email);
      return c.json(
        {
          ...user,
          message: user.success
            ? "Usuário encontrado com sucesso"
            : user.error || "Usuário não encontrado",
        },
        user.success ? 200 : 404
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar usuário" }, 500);
    }
  }

  async getUsersByTeam(c: Context): Promise<Response> {
    try {
      const { teamId } = c.req.param();
      const users = await this.userService.getUsersByTeam(parseInt(teamId));
      return c.json(
        {
          ...users,
          message: users.success
            ? "Usuários da equipe listados com sucesso"
            : users.error || "Erro ao listar usuários da equipe",
        },
        users.success ? 200 : 400
      );
    } catch (error) {
      return c.json(
        { success: false, error: "Erro ao listar usuários da equipe" },
        500
      );
    }
  }

  async getUsersByTenant(c: Context): Promise<Response> {
    try {
      const { tenantId } = c.req.param();
      const users = await this.userService.getUsersByTenant(parseInt(tenantId));
      return c.json(
        {
          ...users,
          message: users.success
            ? "Usuários do tenant listados com sucesso"
            : users.error || "Erro ao listar usuários do tenant",
        },
        users.success ? 200 : 400
      );
    } catch (error) {
      return c.json(
        { success: false, error: "Erro ao listar usuários do tenant" },
        500
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
