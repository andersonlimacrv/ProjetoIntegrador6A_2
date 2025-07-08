import { Context } from "hono";
import { UserStoryService } from "../services/UserStoryService";
import { ApiResponse } from "@shared";

export class UserStoryController {
  private static userStoryService = new UserStoryService();

  // CRUD básico
  static async getAllUserStories(c: Context) {
    try {
      console.log(
        "📥 UserStoryController.getAllUserStories - Requisição recebida"
      );

      const userStories =
        await UserStoryController.userStoryService.getAllUserStories();
      console.log(
        "📤 UserStoryController.getAllUserStories - Resposta do service:",
        {
          success: userStories.success,
          count: userStories.data?.length || 0,
        }
      );

      return c.json(
        { ...userStories, message: "User Stories listadas com sucesso" },
        userStories.success ? 200 : 500
      );
    } catch (error) {
      console.error(
        "💥 UserStoryController.getAllUserStories - Erro capturado:",
        error
      );
      return c.json(
        { success: false, error: "Erro ao listar user stories" },
        500
      );
    }
  }

  static async getUserStoryById(c: Context) {
    try {
      const id = c.req.param("id");
      console.log("📥 UserStoryController.getUserStoryById - ID recebido:", id);

      const userStory =
        await UserStoryController.userStoryService.getUserStoryById(id);
      console.log(
        "📤 UserStoryController.getUserStoryById - Resposta do service:",
        {
          success: userStory.success,
          error: userStory.error,
          hasData: !!userStory.data,
        }
      );

      return c.json(
        {
          ...userStory,
          message: userStory.success
            ? "User Story encontrada com sucesso"
            : userStory.error || "User Story não encontrada",
        },
        userStory.success ? 200 : 404
      );
    } catch (error) {
      console.error(
        "💥 UserStoryController.getUserStoryById - Erro capturado:",
        error
      );
      return c.json(
        { success: false, error: "Erro ao buscar user story" },
        500
      );
    }
  }

  static async createUserStory(c: Context) {
    try {
      const data = await c.req.json();
      console.log(
        "📥 UserStoryController.createUserStory - Payload recebido:",
        data
      );

      const userStory =
        await UserStoryController.userStoryService.createUserStory(data);
      console.log(
        "📤 UserStoryController.createUserStory - Resposta do service:",
        {
          success: userStory.success,
          error: userStory.error,
          hasData: !!userStory.data,
        }
      );

      return c.json(
        {
          ...userStory,
          message: userStory.success
            ? "User Story criada com sucesso"
            : userStory.error || "Erro ao criar user story",
        },
        userStory.success ? 201 : 400
      );
    } catch (error) {
      console.error(
        "💥 UserStoryController.createUserStory - Erro capturado:",
        error
      );
      return c.json({ success: false, error: "Erro ao criar user story" }, 500);
    }
  }

  static async updateUserStory(c: Context) {
    try {
      const id = c.req.param("id");
      const data = await c.req.json();
      console.log(
        "📥 UserStoryController.updateUserStory - ID:",
        id,
        "Payload:",
        data
      );

      const userStory =
        await UserStoryController.userStoryService.updateUserStory(id, data);
      console.log(
        "📤 UserStoryController.updateUserStory - Resposta do service:",
        {
          success: userStory.success,
          error: userStory.error,
          hasData: !!userStory.data,
        }
      );

      return c.json(
        {
          ...userStory,
          message: userStory.success
            ? "User Story atualizada com sucesso"
            : userStory.error || "User Story não encontrada",
        },
        userStory.success ? 200 : 404
      );
    } catch (error) {
      console.error(
        "💥 UserStoryController.updateUserStory - Erro capturado:",
        error
      );
      return c.json(
        { success: false, error: "Erro ao atualizar user story" },
        500
      );
    }
  }

  static async deleteUserStory(c: Context) {
    try {
      const id = c.req.param("id");
      console.log("📥 UserStoryController.deleteUserStory - ID recebido:", id);

      const deleted =
        await UserStoryController.userStoryService.deleteUserStory(id);
      console.log(
        "📤 UserStoryController.deleteUserStory - Resposta do service:",
        {
          success: deleted.success,
          error: deleted.error,
        }
      );

      return c.json(
        {
          ...deleted,
          message: deleted.success
            ? "User Story deletada com sucesso"
            : deleted.error || "User Story não encontrada",
        },
        deleted.success ? 200 : 404
      );
    } catch (error) {
      console.error(
        "💥 UserStoryController.deleteUserStory - Erro capturado:",
        error
      );
      return c.json(
        { success: false, error: "Erro ao deletar user story" },
        500
      );
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
