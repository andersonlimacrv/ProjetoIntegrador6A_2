import { Sprint } from "@shared";
import { SprintRepository } from "../repositories/SprintRepository";
import { ApiResponse } from "@shared";

export class SprintService {
  private sprintRepository = new SprintRepository();

  async getAllSprints(): Promise<Sprint[]> {
    return this.sprintRepository.getAll();
  }

  async getSprintById(id: string): Promise<Sprint | null> {
    return this.sprintRepository.getById(id);
  }

  async createSprint(data: Partial<Sprint>): Promise<Sprint> {
    // TODO: Implementar validações de negócio
    return this.sprintRepository.create(data);
  }

  async updateSprint(
    id: string,
    data: Partial<Sprint>
  ): Promise<Sprint | null> {
    // TODO: Implementar validações de negócio
    return this.sprintRepository.update(id, data);
  }

  async deleteSprint(id: string): Promise<boolean> {
    // TODO: Implementar validações de negócio
    return this.sprintRepository.delete(id);
  }

  async getSprintsByProject(projectId: string): Promise<Sprint[]> {
    // TODO: Implementar busca por projeto
    return [];
  }

  async getSprintBacklog(sprintId: string): Promise<any[]> {
    // TODO: Implementar busca do backlog
    return [];
  }

  async addStoryToBacklog(sprintId: string, data: any): Promise<any> {
    // TODO: Implementar adição ao backlog
    return {};
  }

  async removeStoryFromBacklog(
    sprintId: string,
    storyId: string
  ): Promise<boolean> {
    // TODO: Implementar remoção do backlog
    return true;
  }

  async getSprintMetrics(sprintId: string): Promise<any> {
    // TODO: Implementar busca de métricas
    return {};
  }

  async createSprintMetrics(sprintId: string, data: any): Promise<any> {
    // TODO: Implementar criação de métricas
    return {};
  }

  async startSprint(sprintId: string): Promise<Sprint | null> {
    // TODO: Implementar início do sprint
    return this.sprintRepository.update(sprintId, { status: "active" });
  }

  async completeSprint(sprintId: string): Promise<Sprint | null> {
    // TODO: Implementar conclusão do sprint
    return this.sprintRepository.update(sprintId, { status: "completed" });
  }

  async cancelSprint(sprintId: string): Promise<Sprint | null> {
    // TODO: Implementar cancelamento do sprint
    return this.sprintRepository.update(sprintId, { status: "cancelled" });
  }
}
