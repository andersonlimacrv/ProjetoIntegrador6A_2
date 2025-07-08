import { Context } from "hono";
import { SprintService } from "../services/SprintService";
import { SprintIdInput } from "@shared";

export class SprintController {
  static sprintService = new SprintService();

  // Listar sprints de um projeto
  static async getSprintsByProject(c: Context) {
    try {
      const projectId = c.req.param("projectId");
      if (!projectId) {
        return c.json(
          { success: false, error: "projectId é obrigatório" },
          400
        );
      }
      const sprints = await SprintController.sprintService.getSprintsByProject(
        projectId
      );
      return c.json(
        {
          success: true,
          data: sprints,
          message: "Sprints do projeto listadas com sucesso",
        },
        200
      );
    } catch (error) {
      return c.json(
        {
          success: false,
          error: "Erro ao buscar sprints do projeto",
        },
        500
      );
    }
  }

  // Criar sprint para um projeto
  static async createSprint(c: Context) {
    try {
      const data = await c.req.json();
      // Espera-se que o frontend envie projectId no payload
      const sprint = await SprintController.sprintService.createSprint(data);
      return c.json(
        {
          ...sprint,
          message: sprint.success
            ? "Sprint criada com sucesso"
            : sprint.error || "Erro ao criar sprint",
        },
        sprint.success ? 201 : 400
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao criar sprint" }, 500);
    }
  }

  // Detalhe de um sprint
  static async getSprintById(c: Context) {
    try {
      const id = c.req.param("id");
      const sprint = await SprintController.sprintService.getSprintById(id);
      return c.json(
        {
          ...sprint,
          message: sprint.success
            ? "Sprint encontrada com sucesso"
            : sprint.error || "Sprint não encontrada",
        },
        sprint.success ? 200 : 404
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar sprint" }, 500);
    }
  }

  // Atualizar sprint
  static async updateSprint(c: Context) {
    try {
      const id = c.req.param("id");
      const data = await c.req.json();
      const sprint = await SprintController.sprintService.updateSprint(
        id,
        data
      );
      return c.json(
        {
          ...sprint,
          message: sprint.success
            ? "Sprint atualizada com sucesso"
            : sprint.error || "Sprint não encontrada",
        },
        sprint.success ? 200 : 404
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao atualizar sprint" }, 500);
    }
  }

  // Deletar sprint
  static async deleteSprint(c: Context) {
    try {
      const id = c.req.param("id");
      const deleted = await SprintController.sprintService.deleteSprint(id);
      return c.json(
        {
          ...deleted,
          message: deleted.success
            ? "Sprint deletada com sucesso"
            : deleted.error || "Sprint não encontrada",
        },
        deleted.success ? 200 : 404
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao deletar sprint" }, 500);
    }
  }

  // Backlog do sprint
  static async getSprintBacklog(c: Context) {
    try {
      const { id } = c.req.param() as SprintIdInput;
      const backlog = await SprintController.sprintService.getSprintBacklog(id);
      return c.json({ success: true, data: backlog }, 200);
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar backlog" }, 500);
    }
  }

  // Adicionar história ao backlog
  static async addStoryToBacklog(c: Context) {
    try {
      const { id } = c.req.param() as SprintIdInput;
      const data = await c.req.json();
      const result = await SprintController.sprintService.addStoryToBacklog(
        id,
        data
      );
      return c.json({ success: true, data: result }, 201);
    } catch (error) {
      return c.json(
        { success: false, error: "Erro ao adicionar história ao backlog" },
        500
      );
    }
  }

  // Remover história do backlog
  static async removeStoryFromBacklog(c: Context) {
    try {
      const { id, storyId } = c.req.param();
      const success =
        await SprintController.sprintService.removeStoryFromBacklog(
          id as string,
          storyId as string
        );
      return c.json(
        {
          success,
          message: success ? "Removido com sucesso" : "Não encontrado",
        },
        success ? 200 : 404
      );
    } catch (error) {
      return c.json(
        { success: false, error: "Erro ao remover história do backlog" },
        500
      );
    }
  }

  // Métricas do sprint
  static async getSprintMetrics(c: Context) {
    try {
      const { id } = c.req.param() as SprintIdInput;
      const metrics = await SprintController.sprintService.getSprintMetrics(id);
      return c.json({ success: true, data: metrics }, 200);
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar métricas" }, 500);
    }
  }

  // Criar métricas do sprint
  static async createSprintMetrics(c: Context) {
    try {
      const { id } = c.req.param() as SprintIdInput;
      const data = await c.req.json();
      const metrics = await SprintController.sprintService.createSprintMetrics(
        id,
        data
      );
      return c.json({ success: true, data: metrics }, 201);
    } catch (error) {
      return c.json({ success: false, error: "Erro ao criar métricas" }, 500);
    }
  }

  // Status do sprint
  static async startSprint(c: Context) {
    try {
      const { id } = c.req.param() as SprintIdInput;
      const sprint = await SprintController.sprintService.startSprint(id);
      if (!sprint) {
        return c.json({ success: false, error: "Sprint não encontrada" }, 404);
      }
      return c.json({ success: true, data: sprint }, 200);
    } catch (error) {
      return c.json({ success: false, error: "Erro ao iniciar sprint" }, 500);
    }
  }

  static async completeSprint(c: Context) {
    try {
      const { id } = c.req.param() as SprintIdInput;
      const sprint = await SprintController.sprintService.completeSprint(id);
      if (!sprint) {
        return c.json({ success: false, error: "Sprint não encontrada" }, 404);
      }
      return c.json({ success: true, data: sprint }, 200);
    } catch (error) {
      return c.json({ success: false, error: "Erro ao concluir sprint" }, 500);
    }
  }

  static async cancelSprint(c: Context) {
    try {
      const { id } = c.req.param() as SprintIdInput;
      const sprint = await SprintController.sprintService.cancelSprint(id);
      if (!sprint) {
        return c.json({ success: false, error: "Sprint não encontrada" }, 404);
      }
      return c.json({ success: true, data: sprint }, 200);
    } catch (error) {
      return c.json({ success: false, error: "Erro ao cancelar sprint" }, 500);
    }
  }
}
