import { Context } from "hono";
import { taskService } from "../services/TaskService";
import {
  CreateTaskSchema,
  UpdateTaskSchema,
  TaskIdSchema,
} from "@packages/shared";
import { validate, validateParams } from "../middlewares/validation";

/**
 * Controller para operações de tasks
 */
export class TaskController {
  /**
   * Lista todas as tasks
   */
  static async getAllTasks(c: Context) {
    const result = await taskService.getAllTasks();

    if (!result.success) {
      return c.json(result, 500);
    }

    return c.json(result);
  }

  /**
   * Lista tasks de um usuário específico
   */
  static async getTasksByUserId(c: Context) {
    const userId = parseInt(c.req.param("userId"));
    const result = await taskService.getTasksByUserId(userId);

    if (!result.success) {
      return c.json(result, 404);
    }

    return c.json(result);
  }

  /**
   * Busca uma task por ID
   */
  static async getTaskById(c: Context) {
    const validatedParams = c.get("validatedParams");
    const result = await taskService.getTaskById(validatedParams.id);

    if (!result.success) {
      return c.json(result, 404);
    }

    return c.json(result);
  }

  /**
   * Busca uma task por ID com dados do usuário
   */
  static async getTaskByIdWithUser(c: Context) {
    const validatedParams = c.get("validatedParams");
    const result = await taskService.getTaskByIdWithUser(validatedParams.id);

    if (!result.success) {
      return c.json(result, 404);
    }

    return c.json(result);
  }

  /**
   * Cria uma nova task
   */
  static async createTask(c: Context) {
    const validatedData = c.get("validatedData");
    const result = await taskService.createTask(validatedData);

    if (!result.success) {
      return c.json(result, 400);
    }

    return c.json(result, 201);
  }

  /**
   * Atualiza uma task existente
   */
  static async updateTask(c: Context) {
    const validatedParams = c.get("validatedParams");
    const validatedData = c.get("validatedData");

    const result = await taskService.updateTask(
      validatedParams.id,
      validatedData
    );

    if (!result.success) {
      return c.json(result, 404);
    }

    return c.json(result);
  }

  /**
   * Marca uma task como completa
   */
  static async markTaskAsCompleted(c: Context) {
    const validatedParams = c.get("validatedParams");
    const result = await taskService.markTaskAsCompleted(validatedParams.id);

    if (!result.success) {
      return c.json(result, 404);
    }

    return c.json(result);
  }

  /**
   * Marca uma task como incompleta
   */
  static async markTaskAsIncomplete(c: Context) {
    const validatedParams = c.get("validatedParams");
    const result = await taskService.markTaskAsIncomplete(validatedParams.id);

    if (!result.success) {
      return c.json(result, 404);
    }

    return c.json(result);
  }

  /**
   * Deleta uma task
   */
  static async deleteTask(c: Context) {
    const validatedParams = c.get("validatedParams");
    const result = await taskService.deleteTask(validatedParams.id);

    if (!result.success) {
      return c.json(result, 404);
    }

    return c.json(result);
  }

  /**
   * Lista tasks completadas
   */
  static async getCompletedTasks(c: Context) {
    const result = await taskService.getCompletedTasks();

    if (!result.success) {
      return c.json(result, 500);
    }

    return c.json(result);
  }

  /**
   * Lista tasks pendentes
   */
  static async getPendingTasks(c: Context) {
    const result = await taskService.getPendingTasks();

    if (!result.success) {
      return c.json(result, 500);
    }

    return c.json(result);
  }
}

// Middlewares de validação pré-configurados
export const validateCreateTask = validate(CreateTaskSchema);
export const validateUpdateTask = validate(UpdateTaskSchema);
export const validateTaskId = validateParams(TaskIdSchema);
