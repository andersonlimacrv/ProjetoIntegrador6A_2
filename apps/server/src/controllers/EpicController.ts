import { Context } from "hono";
import { EpicService } from "../services/EpicService";
import { ApiResponse } from "@shared";

export class EpicController {
  private static epicService = new EpicService();

  // CRUD básico
  static async getAllEpics(c: Context) {
    try {
      const epics = await EpicController.epicService.getAllEpics();
      return c.json({ success: true, data: epics });
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar épicos" }, 500);
    }
  }

  static async getEpicById(c: Context) {
    try {
      const id = c.req.param("id");
      const epic = await EpicController.epicService.getEpicById(id);

      if (!epic) {
        return c.json({ success: false, error: "Épico não encontrado" }, 404);
      }

      return c.json({ success: true, data: epic });
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar épico" }, 500);
    }
  }

  static async createEpic(c: Context) {
    try {
      const data = await c.req.json();
      const epic = await EpicController.epicService.createEpic(data);
      return c.json({ success: true, data: epic }, 201);
    } catch (error) {
      return c.json({ success: false, error: "Erro ao criar épico" }, 500);
    }
  }

  static async updateEpic(c: Context) {
    try {
      const id = c.req.param("id");
      const data = await c.req.json();
      const epic = await EpicController.epicService.updateEpic(id, data);

      if (!epic) {
        return c.json({ success: false, error: "Épico não encontrado" }, 404);
      }

      return c.json({ success: true, data: epic });
    } catch (error) {
      return c.json({ success: false, error: "Erro ao atualizar épico" }, 500);
    }
  }

  static async deleteEpic(c: Context) {
    try {
      const id = c.req.param("id");
      const success = await EpicController.epicService.deleteEpic(id);

      if (!success) {
        return c.json({ success: false, error: "Épico não encontrado" }, 404);
      }

      return c.json({ success: true, message: "Épico deletado com sucesso" });
    } catch (error) {
      return c.json({ success: false, error: "Erro ao deletar épico" }, 500);
    }
  }

  // Épicos por projeto
  static async getEpicsByProject(c: Context) {
    try {
      const projectId = c.req.param("projectId");
      const epics = await EpicController.epicService.getEpicsByProject(
        projectId
      );
      return c.json({ success: true, data: epics });
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar épicos" }, 500);
    }
  }

  // Histórias de usuário
  static async getEpicStories(c: Context) {
    try {
      const epicId = c.req.param("id");
      const stories = await EpicController.epicService.getEpicStories(epicId);
      return c.json({ success: true, data: stories });
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar histórias" }, 500);
    }
  }

  // Status
  static async updateEpicStatus(c: Context) {
    try {
      const epicId = c.req.param("id");
      const statusId = c.req.param("statusId");
      const epic = await EpicController.epicService.updateEpicStatus(
        epicId,
        statusId
      );

      if (!epic) {
        return c.json({ success: false, error: "Épico não encontrado" }, 404);
      }

      return c.json({ success: true, data: epic });
    } catch (error) {
      return c.json({ success: false, error: "Erro ao atualizar status" }, 500);
    }
  }
}
