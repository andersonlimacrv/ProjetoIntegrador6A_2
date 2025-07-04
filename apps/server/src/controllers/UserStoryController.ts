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
      return c.json({ success: true, data: stories });
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

      if (!story) {
        return c.json(
          { success: false, error: "História não encontrada" },
          404
        );
      }

      return c.json({ success: true, data: story });
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
      return c.json({ success: true, data: story }, 201);
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

      if (!story) {
        return c.json(
          { success: false, error: "História não encontrada" },
          404
        );
      }

      return c.json({ success: true, data: story });
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
      const success =
        await UserStoryController.userStoryService.deleteUserStory(id);

      if (!success) {
        return c.json(
          { success: false, error: "História não encontrada" },
          404
        );
      }

      return c.json({
        success: true,
        message: "História deletada com sucesso",
      });
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
      return c.json({ success: true, data: stories });
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
      return c.json({ success: true, data: stories });
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
      return c.json({ success: true, data: tasks });
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

      if (!story) {
        return c.json(
          { success: false, error: "História não encontrada" },
          404
        );
      }

      return c.json({ success: true, data: story });
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
      return c.json({ success: true, data: result });
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
      const success =
        await UserStoryController.userStoryService.removeFromSprint(storyId);

      if (!success) {
        return c.json(
          { success: false, error: "História não encontrada" },
          404
        );
      }

      return c.json({
        success: true,
        message: "História removida do sprint com sucesso",
      });
    } catch (error) {
      return c.json(
        { success: false, error: "Erro ao remover do sprint" },
        500
      );
    }
  }
}
