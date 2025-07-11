import { EpicRepository } from "../repositories/EpicRepository";
import { Epic } from "../../../packages/shared/src";
import { ApiResponse } from "../../../packages/shared/src";

export class EpicService {
  private epicRepository = new EpicRepository();

  async getAllEpics(): Promise<ApiResponse<Epic[]>> {
    try {
      const epics = await this.epicRepository.getAll();
      return {
        success: true,
        data: epics,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao buscar épicos",
      };
    }
  }

  async getEpicById(id: string): Promise<Epic | null> {
    return this.epicRepository.getById(id);
  }

  async createEpic(data: Partial<Epic>): Promise<Epic> {
    // TODO: Implementar validações de negócio
    return this.epicRepository.create(data);
  }

  async updateEpic(id: string, data: Partial<Epic>): Promise<Epic | null> {
    // TODO: Implementar validações de negócio
    return this.epicRepository.update(id, data);
  }

  async deleteEpic(id: string): Promise<boolean> {
    // TODO: Implementar validações de negócio
    return this.epicRepository.delete(id);
  }

  async getEpicsByProject(projectId: string): Promise<Epic[]> {
    // TODO: Implementar busca por projeto
    return [];
  }

  async getEpicStories(epicId: string): Promise<any[]> {
    // TODO: Implementar busca de histórias do épico
    return [];
  }

  async updateEpicStatus(
    epicId: string,
    statusId: string
  ): Promise<Epic | null> {
    // TODO: Implementar atualização de status
    return this.epicRepository.update(epicId, { status_id: statusId });
  }
}
