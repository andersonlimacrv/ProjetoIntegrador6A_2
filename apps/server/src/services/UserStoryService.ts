import { UserStory, ApiResponse } from "../../../packages/shared/src";
import { UserStoryRepository } from "../repositories/UserStoryRepository";

export class UserStoryService {
  private userStoryRepository = new UserStoryRepository();

  async getAllUserStories(): Promise<ApiResponse<UserStory[]>> {
    try {
      const stories = await this.userStoryRepository.getAll();
      return {
        success: true,
        data: stories,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro ao buscar histórias",
      };
    }
  }

  async getUserStoryById(id: string): Promise<UserStory | null> {
    return this.userStoryRepository.getById(id);
  }

  async createUserStory(data: Partial<UserStory>): Promise<UserStory> {
    // TODO: Implementar validações de negócio
    return this.userStoryRepository.create(data);
  }

  async updateUserStory(
    id: string,
    data: Partial<UserStory>
  ): Promise<UserStory | null> {
    // TODO: Implementar validações de negócio
    return this.userStoryRepository.update(id, data);
  }

  async deleteUserStory(id: string): Promise<boolean> {
    // TODO: Implementar validações de negócio
    return this.userStoryRepository.delete(id);
  }

  async getUserStoriesByProject(
    projectId: string
  ): Promise<ApiResponse<UserStory[]>> {
    try {
      const stories = await this.userStoryRepository.getUserStoriesByProject(
        projectId
      );
      return {
        success: true,
        data: stories,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro ao buscar histórias",
      };
    }
  }

  async getUserStoriesByEpic(epicId: string): Promise<UserStory[]> {
    // TODO: Implementar busca por épico
    return [];
  }

  async getUserStoryTasks(storyId: string): Promise<any[]> {
    // TODO: Implementar busca de tarefas da história
    return [];
  }

  async updateUserStoryStatus(
    storyId: string,
    statusId: string
  ): Promise<UserStory | null> {
    // TODO: Implementar atualização de status
    return this.userStoryRepository.update(storyId, { status_id: statusId });
  }

  async addToSprint(storyId: string, sprintId: string): Promise<any> {
    // TODO: Implementar adição ao sprint
    return {};
  }

  async removeFromSprint(storyId: string): Promise<boolean> {
    // TODO: Implementar remoção do sprint
    return true;
  }
}
