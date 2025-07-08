import { Sprint, ApiResponse } from "../../../packages/shared/src";
import { SprintRepository } from "../repositories/SprintRepository";

export class SprintService {
  private sprintRepository = new SprintRepository();

  async getAllSprints(): Promise<ApiResponse<Sprint[]>> {
    try {
      const sprints = await this.sprintRepository.getAll();
      return {
        success: true,
        data: sprints,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro ao buscar sprints",
      };
    }
  }

  async getSprintById(id: string): Promise<ApiResponse<Sprint>> {
    try {
      const sprint = await this.sprintRepository.getById(id);
      if (!sprint) {
        return {
          success: false,
          error: "Sprint não encontrado",
        };
      }
      return {
        success: true,
        data: sprint,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao buscar sprint",
      };
    }
  }

  async createSprint(data: Partial<Sprint>): Promise<ApiResponse<Sprint>> {
    try {
      const sprint = await this.sprintRepository.create(data);
      return {
        success: true,
        data: sprint,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao criar sprint",
      };
    }
  }

  async updateSprint(
    id: string,
    data: Partial<Sprint>
  ): Promise<ApiResponse<Sprint>> {
    try {
      const sprint = await this.sprintRepository.update(id, data);
      if (!sprint) {
        return {
          success: false,
          error: "Sprint não encontrado",
        };
      }
      return {
        success: true,
        data: sprint,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro ao atualizar sprint",
      };
    }
  }

  async deleteSprint(id: string): Promise<ApiResponse<boolean>> {
    try {
      const deleted = await this.sprintRepository.delete(id);
      return {
        success: deleted,
        data: deleted,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro ao deletar sprint",
      };
    }
  }

  async getSprintsByProject(projectId: string): Promise<ApiResponse<Sprint[]>> {
    try {
      const sprints = await this.sprintRepository.getSprintsByProject(
        projectId
      );
      return {
        success: true,
        data: sprints,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro ao buscar sprints",
      };
    }
  }

  async getSprintBacklog(sprintId: string): Promise<ApiResponse<any[]>> {
    try {
      const backlog = await this.sprintRepository.getSprintBacklog(sprintId);
      return {
        success: true,
        data: backlog,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro ao buscar backlog",
      };
    }
  }

  async addStoryToBacklog(
    sprintId: string,
    data: any
  ): Promise<ApiResponse<any>> {
    try {
      const result = await this.sprintRepository.addStoryToBacklog(
        sprintId,
        data
      );
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro ao adicionar ao backlog",
      };
    }
  }

  async removeStoryFromBacklog(
    sprintId: string,
    storyId: string
  ): Promise<ApiResponse<boolean>> {
    try {
      const result = await this.sprintRepository.removeStoryFromBacklog(
        sprintId,
        storyId
      );
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro ao remover do backlog",
      };
    }
  }

  async getSprintMetrics(sprintId: string): Promise<ApiResponse<any>> {
    try {
      const metrics = await this.sprintRepository.getSprintMetrics(sprintId);
      return {
        success: true,
        data: metrics,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro ao buscar métricas",
      };
    }
  }

  async createSprintMetrics(
    sprintId: string,
    data: any
  ): Promise<ApiResponse<any>> {
    try {
      const metrics = await this.sprintRepository.createSprintMetrics(
        sprintId,
        data
      );
      return {
        success: true,
        data: metrics,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro ao criar métricas",
      };
    }
  }

  async startSprint(sprintId: string): Promise<ApiResponse<Sprint>> {
    try {
      const sprint = await this.sprintRepository.update(sprintId, {
        status: "active",
      });
      if (!sprint) {
        return {
          success: false,
          error: "Sprint não encontrado",
        };
      }
      return {
        success: true,
        data: sprint,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro ao iniciar sprint",
      };
    }
  }

  async completeSprint(sprintId: string): Promise<ApiResponse<Sprint>> {
    try {
      const sprint = await this.sprintRepository.update(sprintId, {
        status: "completed",
      });
      if (!sprint) {
        return {
          success: false,
          error: "Sprint não encontrado",
        };
      }
      return {
        success: true,
        data: sprint,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro ao concluir sprint",
      };
    }
  }

  async cancelSprint(sprintId: string): Promise<ApiResponse<Sprint>> {
    try {
      const sprint = await this.sprintRepository.update(sprintId, {
        status: "cancelled",
      });
      if (!sprint) {
        return {
          success: false,
          error: "Sprint não encontrado",
        };
      }
      return {
        success: true,
        data: sprint,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro ao cancelar sprint",
      };
    }
  }
}
