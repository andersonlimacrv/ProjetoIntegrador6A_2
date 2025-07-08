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
      console.log("📥 UserController.createUser - Payload recebido:", input);

      const user = await this.userService.createUser(input);
      console.log("📤 UserController.createUser - Resposta do service:", {
        success: user.success,
        error: user.error,
        message: user.message,
      });

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
      console.error("💥 UserController.createUser - Erro capturado:", error);
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
      console.log("📥 UserController.getUserById - ID recebido:", id);

      const user = await this.userService.getUserById(id);
      console.log("📤 UserController.getUserById - Resposta do service:", {
        success: user.success,
        error: user.error,
      });

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
      console.error("💥 UserController.getUserById - Erro capturado:", error);
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
      console.log("📥 UserController.getAllUsers - Requisição recebida");

      const users = await this.userService.getAllUsers();
      console.log("📤 UserController.getAllUsers - Resposta do service:", {
        success: users.success,
        count: users.data?.length || 0,
      });

      return c.json(
        { ...users, message: "Usuários listados com sucesso" },
        users.success ? 200 : 500
      );
    } catch (error) {
      console.error("💥 UserController.getAllUsers - Erro capturado:", error);
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
      console.log("📥 UserController.updateUser - ID:", id, "Payload:", input);

      const user = await this.userService.updateUser(id, input);
      console.log("📤 UserController.updateUser - Resposta do service:", {
        success: user.success,
        error: user.error,
      });

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
      console.error("💥 UserController.updateUser - Erro capturado:", error);
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
      console.log("📥 UserController.deleteUser - ID recebido:", id);

      const deleted = await this.userService.deleteUser(id);
      console.log("📤 UserController.deleteUser - Resposta do service:", {
        success: deleted.success,
        error: deleted.error,
      });

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
      console.error("💥 UserController.deleteUser - Erro capturado:", error);
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
      console.log("📥 UserController.getUserByEmail - Email recebido:", email);

      const user = await this.userService.getUserByEmail(email);
      console.log("📤 UserController.getUserByEmail - Resposta do service:", {
        success: user.success,
        error: user.error,
      });

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
      console.error(
        "💥 UserController.getUserByEmail - Erro capturado:",
        error
      );
      return c.json({ success: false, error: "Erro ao buscar usuário" }, 500);
    }
  }

  async getUsersByTeam(c: Context): Promise<Response> {
    try {
      const { teamId } = c.req.param();
      console.log(
        "📥 UserController.getUsersByTeam - Team ID recebido:",
        teamId
      );

      const users = await this.userService.getUsersByTeam(parseInt(teamId));
      console.log("📤 UserController.getUsersByTeam - Resposta do service:", {
        success: users.success,
        count: users.data?.length || 0,
      });

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
      console.error(
        "💥 UserController.getUsersByTeam - Erro capturado:",
        error
      );
      return c.json(
        { success: false, error: "Erro ao listar usuários da equipe" },
        500
      );
    }
  }

  async getUsersByTenant(c: Context): Promise<Response> {
    try {
      const { tenantId } = c.req.param();
      console.log(
        "📥 UserController.getUsersByTenant - Tenant ID recebido:",
        tenantId
      );

      const users = await this.userService.getUsersByTenant(parseInt(tenantId));
      console.log("📤 UserController.getUsersByTenant - Resposta do service:", {
        success: users.success,
        count: users.data?.length || 0,
      });

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
      console.error(
        "💥 UserController.getUsersByTenant - Erro capturado:",
        error
      );
      return c.json(
        { success: false, error: "Erro ao listar usuários do tenant" },
        500
      );
    }
  }

  async login(c: Context): Promise<Response> {
    try {
      const { email, password } = await c.req.json();
      console.log("📥 UserController.login - Credenciais recebidas:", {
        email,
        password: "***",
      });

      // Validação dos campos
      if (!email || !password) {
        console.log("❌ UserController.login - Campos obrigatórios faltando");
        return c.json<ApiResponse<null>>(
          {
            success: false,
            data: null,
            message: "Email e senha são obrigatórios",
          },
          400
        );
      }

      const result = await this.userService.login({ email, password });
      console.log("📤 UserController.login - Resposta do service:", {
        success: result.success,
        error: result.error,
        hasUser: !!result.data?.user,
        hasTenant: !!result.data?.tenant,
      });

      if (!result.success) {
        return c.json<ApiResponse<null>>(
          {
            success: false,
            data: null,
            message: result.error || "Erro no login",
          },
          401
        );
      }

      return c.json<ApiResponse<any>>({
        success: true,
        data: result.data,
        message: "Login realizado com sucesso",
      });
    } catch (error) {
      console.error("💥 UserController.login - Erro capturado:", error);
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error ? error.message : "Erro interno no servidor",
        },
        500
      );
    }
  }

  async logout(c: Context): Promise<Response> {
    try {
      const { token } = await c.req.json();
      console.log(
        "📥 UserController.logout - Token recebido:",
        token ? "***" : "null"
      );

      await this.userService.logout(token);
      console.log("📤 UserController.logout - Logout realizado com sucesso");

      return c.json<ApiResponse<null>>({
        success: true,
        data: null,
        message: "Logout realizado com sucesso",
      });
    } catch (error) {
      console.error("💥 UserController.logout - Erro capturado:", error);
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
      console.log(
        "📥 UserController.refreshToken - Refresh token recebido:",
        refreshToken ? "***" : "null"
      );

      const result = await this.userService.refreshToken(refreshToken);
      console.log("📤 UserController.refreshToken - Resposta do service:", {
        success: result.success,
        hasToken: !!result.data?.token,
      });

      return c.json<ApiResponse<any>>({
        success: true,
        data: result,
        message: "Token renovado com sucesso",
      });
    } catch (error) {
      console.error("💥 UserController.refreshToken - Erro capturado:", error);
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
      console.log("📥 UserController.getUserSessions - User ID recebido:", id);

      const sessions = await this.userService.getUserSessions(parseInt(id));
      console.log("📤 UserController.getUserSessions - Resposta do service:", {
        success: sessions.success,
        count: sessions.data?.length || 0,
      });

      return c.json<ApiResponse<any[]>>({
        success: true,
        data: sessions,
        message: "Sessões do usuário listadas com sucesso",
      });
    } catch (error) {
      console.error(
        "💥 UserController.getUserSessions - Erro capturado:",
        error
      );
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
      console.log(
        "📥 UserController.deleteSession - User ID:",
        id,
        "Session ID:",
        sessionId
      );

      await this.userService.deleteSession(parseInt(id), parseInt(sessionId));
      console.log(
        "📤 UserController.deleteSession - Sessão deletada com sucesso"
      );

      return c.json<ApiResponse<null>>({
        success: true,
        data: null,
        message: "Sessão deletada com sucesso",
      });
    } catch (error) {
      console.error("💥 UserController.deleteSession - Erro capturado:", error);
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
      console.log(
        "📥 UserController.getUserActivities - User ID recebido:",
        id
      );

      const activities = await this.userService.getUserActivities(parseInt(id));
      console.log(
        "📤 UserController.getUserActivities - Resposta do service:",
        {
          success: activities.success,
          count: activities.data?.length || 0,
        }
      );

      return c.json<ApiResponse<any[]>>({
        success: true,
        data: activities,
        message: "Atividades do usuário listadas com sucesso",
      });
    } catch (error) {
      console.error(
        "💥 UserController.getUserActivities - Erro capturado:",
        error
      );
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
      console.log("📥 UserController.getUserTenants - User ID recebido:", id);

      const tenants = await this.userService.getUserTenants(parseInt(id));
      console.log("📤 UserController.getUserTenants - Resposta do service:", {
        success: tenants.success,
        count: tenants.data?.length || 0,
      });

      return c.json<ApiResponse<any[]>>({
        success: true,
        data: tenants,
        message: "Tenants do usuário listados com sucesso",
      });
    } catch (error) {
      console.error(
        "💥 UserController.getUserTenants - Erro capturado:",
        error
      );
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
      console.log("📥 UserController.getUserTeams - User ID recebido:", id);

      const teams = await this.userService.getUserTeams(parseInt(id));
      console.log("📤 UserController.getUserTeams - Resposta do service:", {
        success: teams.success,
        count: teams.data?.length || 0,
      });

      return c.json<ApiResponse<any[]>>({
        success: true,
        data: teams,
        message: "Equipes do usuário listadas com sucesso",
      });
    } catch (error) {
      console.error("💥 UserController.getUserTeams - Erro capturado:", error);
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
