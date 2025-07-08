import { Activity, ApiResponse } from "../../../packages/shared/src";
import { ActivityRepository } from "../repositories/ActivityRepository";

export class ActivityService {
  private activityRepository = new ActivityRepository();

  async getAllActivities(): Promise<ApiResponse<Activity[]>> {
    try {
      const activities = await this.activityRepository.getAll();
      return {
        success: true,
        data: activities,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro ao buscar atividades",
      };
    }
  }

  async getActivityById(id: string): Promise<Activity | null> {
    return this.activityRepository.getById(id);
  }

  async createActivity(data: Partial<Activity>): Promise<Activity> {
    // TODO: Implementar validações de negócio
    return this.activityRepository.create(data);
  }

  async updateActivity(
    id: string,
    data: Partial<Activity>
  ): Promise<Activity | null> {
    // TODO: Implementar validações de negócio
    return this.activityRepository.update(id, data);
  }

  async deleteActivity(id: string): Promise<boolean> {
    // TODO: Implementar validações de negócio
    return this.activityRepository.delete(id);
  }

  async getActivitiesByUser(userId: string): Promise<Activity[]> {
    // TODO: Implementar busca por usuário
    return [];
  }

  async getActivitiesByProject(projectId: string): Promise<Activity[]> {
    // TODO: Implementar busca por projeto
    return [];
  }

  async getActivitiesByTask(taskId: string): Promise<Activity[]> {
    // TODO: Implementar busca por tarefa
    return [];
  }

  async getActivitiesByType(type: string): Promise<Activity[]> {
    // TODO: Implementar busca por tipo
    return [];
  }

  async getUserFeed(userId: string): Promise<Activity[]> {
    // TODO: Implementar feed do usuário
    return [];
  }
}
