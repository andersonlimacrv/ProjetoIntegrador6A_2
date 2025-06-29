import { Context } from "hono";
import { userService } from "../services/UserService";
import {
  CreateUserSchema,
  UpdateUserSchema,
  UserIdSchema,
} from "../models/User";
import { validate, validateParams } from "../middlewares/validation";

/**
 * Controller para operações de usuários
 */
export class UserController {
  /**
   * Lista todos os usuários
   */
  static async getAllUsers(c: Context) {
    const result = await userService.getAllUsers();

    if (!result.success) {
      return c.json(result, 500);
    }

    return c.json(result);
  }

  /**
   * Busca um usuário por ID
   */
  static async getUserById(c: Context) {
    const validatedParams = c.get("validatedParams");
    const result = await userService.getUserById(validatedParams.id);

    if (!result.success) {
      return c.json(result, 404);
    }

    return c.json(result);
  }

  /**
   * Cria um novo usuário
   */
  static async createUser(c: Context) {
    const validatedData = c.get("validatedData");
    const result = await userService.createUser(validatedData);

    if (!result.success) {
      return c.json(result, 400);
    }

    return c.json(result, 201);
  }

  /**
   * Atualiza um usuário existente
   */
  static async updateUser(c: Context) {
    const validatedParams = c.get("validatedParams");
    const validatedData = c.get("validatedData");

    const result = await userService.updateUser(
      validatedParams.id,
      validatedData
    );

    if (!result.success) {
      return c.json(result, 404);
    }

    return c.json(result);
  }

  /**
   * Deleta um usuário
   */
  static async deleteUser(c: Context) {
    const validatedParams = c.get("validatedParams");
    const result = await userService.deleteUser(validatedParams.id);

    if (!result.success) {
      return c.json(result, 404);
    }

    return c.json(result);
  }
}

// Middlewares de validação pré-configurados
export const validateCreateUser = validate(CreateUserSchema);
export const validateUpdateUser = validate(UpdateUserSchema);
export const validateUserId = validateParams(UserIdSchema);
