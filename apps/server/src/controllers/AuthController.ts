import { Context } from "hono";
import { UserService } from "../services/UserService";
import { ApiResponse } from "@shared";

export class AuthController {
  private static userService = new UserService();

  static async register(c: Context) {
    try {
      const { name, email, password, companyName } = await c.req.json();
      console.log("📥 AuthController.register - Dados recebidos:", {
        name,
        email,
        password: "***",
        companyName,
      });

      const result = await AuthController.userService.registerWithTenant({
        name,
        email,
        password,
        companyName,
      });

      console.log("📤 AuthController.register - Resposta do service:", {
        success: result.success,
        error: result.error,
        hasUser: !!result.data?.user,
        hasTenant: !!result.data?.tenant,
      });

      return c.json(
        {
          ...result,
          message: result.success
            ? "Cadastro realizado com sucesso"
            : result.error || "Erro ao realizar cadastro",
        },
        result.success ? 201 : 400
      );
    } catch (error) {
      console.error("💥 AuthController.register - Erro capturado:", error);
      return c.json(
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
}
