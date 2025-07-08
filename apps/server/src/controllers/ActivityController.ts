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
      return c.json(
        {
          ...activities,
          message: activities.success
            ? "Atividades listadas com sucesso"
            : activities.error || "Erro ao buscar atividades",
        },
        activities.success ? 200 : 500
      );
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
      return c.json(
        {
          ...activity,
          message: activity.success
            ? "Atividade encontrada com sucesso"
            : activity.error || "Atividade não encontrada",
        },
        activity.success ? 200 : 404
      );
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
      return c.json(
        {
          ...activity,
          message: activity.success
            ? "Atividade criada com sucesso"
            : activity.error || "Erro ao criar atividade",
        },
        activity.success ? 201 : 400
      );
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
      return c.json(
        {
          ...activity,
          message: activity.success
            ? "Atividade atualizada com sucesso"
            : activity.error || "Atividade não encontrada",
        },
        activity.success ? 200 : 404
      );
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
      const deleted = await ActivityController.activityService.deleteActivity(
        id
      );
      return c.json(
        {
          ...deleted,
          message: deleted.success
            ? "Atividade deletada com sucesso"
            : deleted.error || "Atividade não encontrada",
        },
        deleted.success ? 200 : 404
      );
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
      return c.json(
        {
          ...activities,
          message: activities.success
            ? "Atividades do usuário listadas com sucesso"
            : activities.error || "Erro ao buscar atividades",
        },
        activities.success ? 200 : 400
      );
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
      return c.json(
        {
          ...activities,
          message: activities.success
            ? "Atividades do projeto listadas com sucesso"
            : activities.error || "Erro ao buscar atividades",
        },
        activities.success ? 200 : 400
      );
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
      return c.json(
        {
          ...activities,
          message: activities.success
            ? "Atividades da tarefa listadas com sucesso"
            : activities.error || "Erro ao buscar atividades",
        },
        activities.success ? 200 : 400
      );
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
      return c.json(
        {
          ...activities,
          message: activities.success
            ? "Atividades do tipo listadas com sucesso"
            : activities.error || "Erro ao buscar atividades",
        },
        activities.success ? 200 : 400
      );
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
      return c.json(
        {
          ...feed,
          message: feed.success
            ? "Feed do usuário listado com sucesso"
            : feed.error || "Erro ao buscar feed",
        },
        feed.success ? 200 : 400
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar feed" }, 500);
    }
  }
}
