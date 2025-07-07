import { Context } from "hono";
import { UserStoryService } from "../services/UserStoryService";
import { ApiResponse } from "@shared";

export class UserStoryController {
  private static userStoryService = new UserStoryService();

  // CRUD básico
  static async getAllUserStories(c: Context) {
    try {
      const stories =
        await UserStoryController.userStoryService.getAllUserStories();
      return c.json(
        {
          ...stories,
          message: stories.success
            ? "Histórias listadas com sucesso"
            : stories.error || "Erro ao buscar histórias",
        },
        stories.success ? 200 : 400
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar histórias" }, 500);
    }
  }

  static async getUserStoryById(c: Context) {
    try {
      const id = c.req.param("id");
      const story = await UserStoryController.userStoryService.getUserStoryById(
        id
      );
      return c.json(
        {
          ...story,
          message: story.success
            ? "História encontrada com sucesso"
            : story.error || "História não encontrada",
        },
        story.success ? 200 : 404
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar história" }, 500);
    }
  }

  static async createUserStory(c: Context) {
    try {
      const data = await c.req.json();
      const story = await UserStoryController.userStoryService.createUserStory(
        data
      );
      return c.json(
        {
          ...story,
          message: story.success
            ? "História criada com sucesso"
            : story.error || "Erro ao criar história",
        },
        story.success ? 201 : 400
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao criar história" }, 500);
    }
  }

  static async updateUserStory(c: Context) {
    try {
      const id = c.req.param("id");
      const data = await c.req.json();
      const story = await UserStoryController.userStoryService.updateUserStory(
        id,
        data
      );
      return c.json(
        {
          ...story,
          message: story.success
            ? "História atualizada com sucesso"
            : story.error || "História não encontrada",
        },
        story.success ? 200 : 404
      );
    } catch (error) {
      return c.json(
        { success: false, error: "Erro ao atualizar história" },
        500
      );
    }
  }

  static async deleteUserStory(c: Context) {
    try {
      const id = c.req.param("id");
      const deleted =
        await UserStoryController.userStoryService.deleteUserStory(id);
      return c.json(
        {
          ...deleted,
          message: deleted.success
            ? "História deletada com sucesso"
            : deleted.error || "História não encontrada",
        },
        deleted.success ? 200 : 404
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao deletar história" }, 500);
    }
  }

  // Histórias por projeto
  static async getUserStoriesByProject(c: Context) {
    try {
      const projectId = c.req.param("projectId");
      const stories =
        await UserStoryController.userStoryService.getUserStoriesByProject(
          projectId
        );
      return c.json(
        {
          ...stories,
          message: stories.success
            ? "Histórias do projeto listadas com sucesso"
            : stories.error || "Erro ao buscar histórias",
        },
        stories.success ? 200 : 400
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar histórias" }, 500);
    }
  }

  // Histórias por épico
  static async getUserStoriesByEpic(c: Context) {
    try {
      const epicId = c.req.param("epicId");
      const stories =
        await UserStoryController.userStoryService.getUserStoriesByEpic(epicId);
      return c.json(
        {
          ...stories,
          message: stories.success
            ? "Histórias do épico listadas com sucesso"
            : stories.error || "Erro ao buscar histórias",
        },
        stories.success ? 200 : 400
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar histórias" }, 500);
    }
  }

  // Tarefas
  static async getUserStoryTasks(c: Context) {
    try {
      const storyId = c.req.param("id");
      const tasks =
        await UserStoryController.userStoryService.getUserStoryTasks(storyId);
      return c.json(
        {
          ...tasks,
          message: tasks.success
            ? "Tarefas da história listadas com sucesso"
            : tasks.error || "Erro ao buscar tarefas",
        },
        tasks.success ? 200 : 400
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar tarefas" }, 500);
    }
  }

  // Status
  static async updateUserStoryStatus(c: Context) {
    try {
      const storyId = c.req.param("id");
      const statusId = c.req.param("statusId");
      const story =
        await UserStoryController.userStoryService.updateUserStoryStatus(
          storyId,
          statusId
        );
      return c.json(
        {
          ...story,
          message: story.success
            ? "Status da história atualizado com sucesso"
            : story.error || "História não encontrada",
        },
        story.success ? 200 : 404
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao atualizar status" }, 500);
    }
  }

  // Sprint
  static async addToSprint(c: Context) {
    try {
      const storyId = c.req.param("id");
      const sprintId = c.req.param("sprintId");
      const result = await UserStoryController.userStoryService.addToSprint(
        storyId,
        sprintId
      );
      return c.json(
        {
          ...result,
          message: result.success
            ? "História adicionada ao sprint com sucesso"
            : result.error || "Erro ao adicionar ao sprint",
        },
        result.success ? 200 : 400
      );
    } catch (error) {
      return c.json(
        { success: false, error: "Erro ao adicionar ao sprint" },
        500
      );
    }
  }

  static async removeFromSprint(c: Context) {
    try {
      const storyId = c.req.param("id");
      const removed =
        await UserStoryController.userStoryService.removeFromSprint(storyId);
      return c.json(
        {
          ...removed,
          message: removed.success
            ? "História removida do sprint com sucesso"
            : removed.error || "História não encontrada",
        },
        removed.success ? 200 : 404
      );
    } catch (error) {
      return c.json(
        { success: false, error: "Erro ao remover do sprint" },
        500
      );
    }
  }
}
