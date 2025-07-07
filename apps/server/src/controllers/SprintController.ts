import { Context } from "hono";
import { SprintService } from "../services/SprintService";
import {
  ApiResponse,
  Sprint,
  CreateSprintInput,
  UpdateSprintInput,
  SprintIdInput,
} from "@shared";

export class SprintController {
  private sprintService: SprintService;

  constructor() {
    this.sprintService = new SprintService();
  }

  async getAllSprints(c: Context): Promise<Response> {
    try {
      const sprints = await this.sprintService.getAllSprints();
      return c.json(
        {
          ...sprints,
          message: sprints.success
            ? "Sprints listados com sucesso"
            : sprints.error || "Erro ao buscar sprints",
        },
        sprints.success ? 200 : 400
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar sprints" }, 500);
    }
  }

  async getSprintById(c: Context): Promise<Response> {
    try {
      const { id } = c.req.param() as SprintIdInput;
      const sprint = await this.sprintService.getSprintById(parseInt(id));
      return c.json(
        {
          ...sprint,
          message: sprint.success
            ? "Sprint encontrado com sucesso"
            : sprint.error || "Sprint não encontrado",
        },
        sprint.success ? 200 : 404
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar sprint" }, 500);
    }
  }

  async createSprint(c: Context): Promise<Response> {
    try {
      const input: CreateSprintInput = await c.req.json();
      const sprint = await this.sprintService.createSprint(input);
      return c.json(
        {
          ...sprint,
          message: sprint.success
            ? "Sprint criado com sucesso"
            : sprint.error || "Erro ao criar sprint",
        },
        sprint.success ? 201 : 400
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao criar sprint" }, 500);
    }
  }

  async updateSprint(c: Context): Promise<Response> {
    try {
      const { id } = c.req.param() as SprintIdInput;
      const input: UpdateSprintInput = await c.req.json();
      const sprint = await this.sprintService.updateSprint(parseInt(id), input);
      return c.json(
        {
          ...sprint,
          message: sprint.success
            ? "Sprint atualizado com sucesso"
            : sprint.error || "Sprint não encontrado",
        },
        sprint.success ? 200 : 404
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao atualizar sprint" }, 500);
    }
  }

  async deleteSprint(c: Context): Promise<Response> {
    try {
      const { id } = c.req.param() as SprintIdInput;
      const deleted = await this.sprintService.deleteSprint(parseInt(id));
      return c.json(
        {
          ...deleted,
          message: deleted.success
            ? "Sprint deletado com sucesso"
            : deleted.error || "Sprint não encontrado",
        },
        deleted.success ? 200 : 404
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao deletar sprint" }, 500);
    }
  }

  async getSprintsByProject(c: Context): Promise<Response> {
    try {
      const { projectId } = c.req.param();
      const sprints = await this.sprintService.getSprintsByProject(
        parseInt(projectId)
      );
      return c.json<ApiResponse<Sprint[]>>({
        success: true,
        data: sprints,
        message: "Sprints do projeto listados com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error ? error.message : "Erro ao buscar sprints",
        },
        400
      );
    }
  }

  async getSprintBacklog(c: Context): Promise<Response> {
    try {
      const { id } = c.req.param() as SprintIdInput;
      const backlog = await this.sprintService.getSprintBacklog(parseInt(id));
      return c.json<ApiResponse<any[]>>({
        success: true,
        data: backlog,
        message: "Backlog do sprint listado com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error ? error.message : "Erro ao buscar backlog",
        },
        400
      );
    }
  }

  async addStoryToBacklog(c: Context): Promise<Response> {
    try {
      const { id } = c.req.param() as SprintIdInput;
      const data = await c.req.json();
      const result = await this.sprintService.addStoryToBacklog(
        parseInt(id),
        data
      );
      return c.json<ApiResponse<any>>({
        success: true,
        data: result,
        message: "História adicionada ao backlog com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error
              ? error.message
              : "Erro ao adicionar história",
        },
        400
      );
    }
  }

  async removeStoryFromBacklog(c: Context): Promise<Response> {
    try {
      const { id, storyId } = c.req.param();
      const success = await this.sprintService.removeStoryFromBacklog(
        parseInt(id),
        parseInt(storyId)
      );

      if (!success) {
        return c.json<ApiResponse<null>>(
          {
            success: false,
            data: null,
            message: "História não encontrada",
          },
          404
        );
      }

      return c.json<ApiResponse<null>>({
        success: true,
        data: null,
        message: "História removida com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error ? error.message : "Erro ao remover história",
        },
        400
      );
    }
  }

  async getSprintMetrics(c: Context): Promise<Response> {
    try {
      const { id } = c.req.param() as SprintIdInput;
      const metrics = await this.sprintService.getSprintMetrics(parseInt(id));
      return c.json<ApiResponse<any>>({
        success: true,
        data: metrics,
        message: "Métricas do sprint obtidas com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error ? error.message : "Erro ao buscar métricas",
        },
        400
      );
    }
  }

  async createSprintMetrics(c: Context): Promise<Response> {
    try {
      const { id } = c.req.param() as SprintIdInput;
      const data = await c.req.json();
      const metrics = await this.sprintService.createSprintMetrics(
        parseInt(id),
        data
      );
      return c.json<ApiResponse<any>>(
        {
          success: true,
          data: metrics,
          message: "Métricas do sprint criadas com sucesso",
        },
        201
      );
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error ? error.message : "Erro ao criar métricas",
        },
        400
      );
    }
  }

  async startSprint(c: Context): Promise<Response> {
    try {
      const { id } = c.req.param() as SprintIdInput;
      const sprint = await this.sprintService.startSprint(parseInt(id));

      if (!sprint) {
        return c.json<ApiResponse<null>>(
          {
            success: false,
            data: null,
            message: "Sprint não encontrado",
          },
          404
        );
      }

      return c.json<ApiResponse<Sprint>>({
        success: true,
        data: sprint,
        message: "Sprint iniciado com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error ? error.message : "Erro ao iniciar sprint",
        },
        400
      );
    }
  }

  async completeSprint(c: Context): Promise<Response> {
    try {
      const { id } = c.req.param() as SprintIdInput;
      const sprint = await this.sprintService.completeSprint(parseInt(id));

      if (!sprint) {
        return c.json<ApiResponse<null>>(
          {
            success: false,
            data: null,
            message: "Sprint não encontrado",
          },
          404
        );
      }

      return c.json<ApiResponse<Sprint>>({
        success: true,
        data: sprint,
        message: "Sprint completado com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error ? error.message : "Erro ao completar sprint",
        },
        400
      );
    }
  }

  async cancelSprint(c: Context): Promise<Response> {
    try {
      const { id } = c.req.param() as SprintIdInput;
      const sprint = await this.sprintService.cancelSprint(parseInt(id));

      if (!sprint) {
        return c.json<ApiResponse<null>>(
          {
            success: false,
            data: null,
            message: "Sprint não encontrado",
          },
          404
        );
      }

      return c.json<ApiResponse<Sprint>>({
        success: true,
        data: sprint,
        message: "Sprint cancelado com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error ? error.message : "Erro ao cancelar sprint",
        },
        400
      );
    }
  }
}
