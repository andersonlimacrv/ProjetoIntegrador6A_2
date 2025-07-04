import { Context } from "hono";
import { ActivityService } from "../services/ActivityService";
import { ApiResponse } from "@shared";

export class ActivityController {
  private static activityService = new ActivityService();

  // CRUD básico
  static async getAllActivities(c: Context) {
    try {
      const activities =
        await ActivityController.activityService.getAllActivities();
      return c.json({ success: true, data: activities });
    } catch (error) {
      return c.json(
        { success: false, error: "Erro ao buscar atividades" },
        500
      );
    }
  }

  static async getActivityById(c: Context) {
    try {
      const id = c.req.param("id");
      const activity = await ActivityController.activityService.getActivityById(
        id
      );

      if (!activity) {
        return c.json(
          { success: false, error: "Atividade não encontrada" },
          404
        );
      }

      return c.json({ success: true, data: activity });
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar atividade" }, 500);
    }
  }

  static async createActivity(c: Context) {
    try {
      const data = await c.req.json();
      const activity = await ActivityController.activityService.createActivity(
        data
      );
      return c.json({ success: true, data: activity }, 201);
    } catch (error) {
      return c.json({ success: false, error: "Erro ao criar atividade" }, 500);
    }
  }

  static async updateActivity(c: Context) {
    try {
      const id = c.req.param("id");
      const data = await c.req.json();
      const activity = await ActivityController.activityService.updateActivity(
        id,
        data
      );

      if (!activity) {
        return c.json(
          { success: false, error: "Atividade não encontrada" },
          404
        );
      }

      return c.json({ success: true, data: activity });
    } catch (error) {
      return c.json(
        { success: false, error: "Erro ao atualizar atividade" },
        500
      );
    }
  }

  static async deleteActivity(c: Context) {
    try {
      const id = c.req.param("id");
      const success = await ActivityController.activityService.deleteActivity(
        id
      );

      if (!success) {
        return c.json(
          { success: false, error: "Atividade não encontrada" },
          404
        );
      }

      return c.json({
        success: true,
        message: "Atividade deletada com sucesso",
      });
    } catch (error) {
      return c.json(
        { success: false, error: "Erro ao deletar atividade" },
        500
      );
    }
  }

  // Atividades por usuário
  static async getActivitiesByUser(c: Context) {
    try {
      const userId = c.req.param("userId");
      const activities =
        await ActivityController.activityService.getActivitiesByUser(userId);
      return c.json({ success: true, data: activities });
    } catch (error) {
      return c.json(
        { success: false, error: "Erro ao buscar atividades" },
        500
      );
    }
  }

  // Atividades por projeto
  static async getActivitiesByProject(c: Context) {
    try {
      const projectId = c.req.param("projectId");
      const activities =
        await ActivityController.activityService.getActivitiesByProject(
          projectId
        );
      return c.json({ success: true, data: activities });
    } catch (error) {
      return c.json(
        { success: false, error: "Erro ao buscar atividades" },
        500
      );
    }
  }

  // Atividades por tarefa
  static async getActivitiesByTask(c: Context) {
    try {
      const taskId = c.req.param("taskId");
      const activities =
        await ActivityController.activityService.getActivitiesByTask(taskId);
      return c.json({ success: true, data: activities });
    } catch (error) {
      return c.json(
        { success: false, error: "Erro ao buscar atividades" },
        500
      );
    }
  }

  // Atividades por tipo
  static async getActivitiesByType(c: Context) {
    try {
      const type = c.req.param("type");
      const activities =
        await ActivityController.activityService.getActivitiesByType(type);
      return c.json({ success: true, data: activities });
    } catch (error) {
      return c.json(
        { success: false, error: "Erro ao buscar atividades" },
        500
      );
    }
  }

  // Feed do usuário
  static async getUserFeed(c: Context) {
    try {
      const userId = c.req.param("userId");
      const feed = await ActivityController.activityService.getUserFeed(userId);
      return c.json({ success: true, data: feed });
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar feed" }, 500);
    }
  }
}
