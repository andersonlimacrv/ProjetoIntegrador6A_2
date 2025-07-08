import { Context } from "hono";
import { EpicService } from "../services/EpicService";
import { ApiResponse } from "@shared";

export class EpicController {
  private static epicService = new EpicService();

  // CRUD básico
  static async getAllEpics(c: Context) {
    try {
      const epics = await EpicController.epicService.getAllEpics();
      return c.json(
        {
          ...epics,
          message: epics.success
            ? "Épicos listados com sucesso"
            : epics.error || "Erro ao buscar épicos",
        },
        epics.success ? 200 : 500
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar épicos" }, 500);
    }
  }

  static async getEpicById(c: Context) {
    try {
      const id = c.req.param("id");
      const epic = await EpicController.epicService.getEpicById(id);
      return c.json(
        {
          ...epic,
          message: epic.success
            ? "Épico encontrado com sucesso"
            : epic.error || "Épico não encontrado",
        },
        epic.success ? 200 : 404
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar épico" }, 500);
    }
  }

  static async createEpic(c: Context) {
    try {
      const data = await c.req.json();
      const epic = await EpicController.epicService.createEpic(data);
      return c.json(
        {
          ...epic,
          message: epic.success
            ? "Épico criado com sucesso"
            : epic.error || "Erro ao criar épico",
        },
        epic.success ? 201 : 400
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao criar épico" }, 500);
    }
  }

  static async updateEpic(c: Context) {
    try {
      const id = c.req.param("id");
      const data = await c.req.json();
      const epic = await EpicController.epicService.updateEpic(id, data);
      return c.json(
        {
          ...epic,
          message: epic.success
            ? "Épico atualizado com sucesso"
            : epic.error || "Épico não encontrado",
        },
        epic.success ? 200 : 404
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao atualizar épico" }, 500);
    }
  }

  static async deleteEpic(c: Context) {
    try {
      const id = c.req.param("id");
      const deleted = await EpicController.epicService.deleteEpic(id);
      return c.json(
        {
          ...deleted,
          message: deleted.success
            ? "Épico deletado com sucesso"
            : deleted.error || "Épico não encontrado",
        },
        deleted.success ? 200 : 404
      );
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
      return c.json(
        {
          ...epics,
          message: epics.success
            ? "Épicos do projeto listados com sucesso"
            : epics.error || "Erro ao buscar épicos",
        },
        epics.success ? 200 : 400
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar épicos" }, 500);
    }
  }

  // Histórias de usuário
  static async getEpicStories(c: Context) {
    try {
      const epicId = c.req.param("id");
      const stories = await EpicController.epicService.getEpicStories(epicId);
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

  // Status
  static async updateEpicStatus(c: Context) {
    try {
      const epicId = c.req.param("id");
      const statusId = c.req.param("statusId");
      const epic = await EpicController.epicService.updateEpicStatus(
        epicId,
        statusId
      );
      return c.json(
        {
          ...epic,
          message: epic.success
            ? "Status do épico atualizado com sucesso"
            : epic.error || "Épico não encontrado",
        },
        epic.success ? 200 : 404
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao atualizar status" }, 500);
    }
  }
}
