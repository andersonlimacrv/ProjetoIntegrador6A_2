import { Activity } from "@shared";
import { ActivityRepository } from "../repositories/ActivityRepository";
import { ApiResponse } from "@shared";

export class ActivityService {
  private activityRepository = new ActivityRepository();

  async getAllActivities(): Promise<Activity[]> {
    return this.activityRepository.getAll();
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
