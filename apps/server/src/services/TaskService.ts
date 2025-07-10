import {
  Task,
  CreateTaskDTO,
  UpdateTaskDTO,
  ApiResponse,
} from "../../../packages/shared/src";
import { TaskRepository } from "../repositories/TaskRepository";
import { userRepository } from "../repositories/UserRepository";
import { projectRepository } from "../repositories/ProjectRepository";

export class TaskService {
  private taskRepository: TaskRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
  }

  /**
   * Busca todas as tasks
   */
  async getAllTasks(): Promise<ApiResponse<Task[]>> {
    try {
      const tasks = await this.taskRepository.findAll();
      return {
        success: true,
        data: tasks,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro ao buscar tarefas",
      };
    }
  }

  /**
   * Busca tasks por projeto
   */
  async getTasksByProjectId(projectId: string): Promise<ApiResponse<Task[]>> {
    try {
      // Verifica se o projeto existe
      const project = await projectRepository.findById(projectId);
      if (!project) {
        return {
          success: false,
          error: "Projeto não encontrado",
        };
      }

      const tasks = await this.taskRepository.findByProjectId(projectId);
      return {
        success: true,
        data: tasks,
      };
    } catch (error) {
      console.error("Erro ao buscar tasks do projeto:", error);
      return {
        success: false,
        error: "Erro interno ao buscar tasks do projeto",
      };
    }
  }

  /**
   * Busca tasks por história de usuário
   */
  async getTasksByStoryId(storyId: string): Promise<ApiResponse<Task[]>> {
    try {
      const tasks = await this.taskRepository.findByStoryId(storyId);
      return {
        success: true,
        data: tasks,
      };
    } catch (error) {
      console.error("Erro ao buscar tasks da história:", error);
      return {
        success: false,
        error: "Erro interno ao buscar tasks da história",
      };
    }
  }

  /**
   * Busca tasks por responsável
   */
  async getTasksByAssigneeId(assigneeId: string): Promise<ApiResponse<Task[]>> {
    try {
      // Verifica se o usuário existe
      const user = await userRepository.findById(assigneeId);
      if (!user) {
        return {
          success: false,
          error: "Usuário não encontrado",
        };
      }

      const tasks = await this.taskRepository.findByAssigneeId(assigneeId);
      return {
        success: true,
        data: tasks,
      };
    } catch (error) {
      console.error("Erro ao buscar tasks do responsável:", error);
      return {
        success: false,
        error: "Erro interno ao buscar tasks do responsável",
      };
    }
  }

  /**
   * Busca tasks por reporter
   */
  async getTasksByReporterId(reporterId: string): Promise<ApiResponse<Task[]>> {
    try {
      // Verifica se o usuário existe
      const user = await userRepository.findById(reporterId);
      if (!user) {
        return {
          success: false,
          error: "Usuário não encontrado",
        };
      }

      const tasks = await this.taskRepository.findByReporterId(reporterId);
      return {
        success: true,
        data: tasks,
      };
    } catch (error) {
      console.error("Erro ao buscar tasks do reporter:", error);
      return {
        success: false,
        error: "Erro interno ao buscar tasks do reporter",
      };
    }
  }

  /**
   * Busca uma task por ID
   */
  async getTaskById(id: string): Promise<ApiResponse<Task>> {
    try {
      const task = await this.taskRepository.findById(id);

      if (!task) {
        return {
          success: false,
          error: "Task não encontrada",
        };
      }

      return {
        success: true,
        data: task,
      };
    } catch (error) {
      console.error("Erro ao buscar task:", error);
      return {
        success: false,
        error: "Erro interno ao buscar task",
      };
    }
  }

  /**
   * Busca uma task por ID com dados relacionados
   */
  async getTaskByIdWithDetails(id: string): Promise<ApiResponse<any>> {
    try {
      const task = await this.taskRepository.findByIdWithDetails(id);

      if (!task) {
        return {
          success: false,
          error: "Task não encontrada",
        };
      }

      return {
        success: true,
        data: task,
      };
    } catch (error) {
      console.error("Erro ao buscar task com detalhes:", error);
      return {
        success: false,
        error: "Erro interno ao buscar task",
      };
    }
  }

  /**
   * Cria uma nova task
   */
  async createTask(data: CreateTaskDTO): Promise<ApiResponse<Task>> {
    try {
      // Verifica se o projeto existe
      const project = await projectRepository.findById(data.projectId);
      if (!project) {
        return {
          success: false,
          error: "Projeto não encontrado",
        };
      }

      // Verifica se o reporter existe
      const reporter = await userRepository.findById(data.reporterId);
      if (!reporter) {
        return {
          success: false,
          error: "Reporter não encontrado",
        };
      }

      // Verifica se o assignee existe (se fornecido)
      if (data.assigneeId) {
        const assignee = await userRepository.findById(data.assigneeId);
        if (!assignee) {
          return {
            success: false,
            error: "Responsável não encontrado",
          };
        }
      }

      // Verifica se a história existe (se fornecida)
      if (data.storyId) {
        const story = await projectRepository.findProjectStories(
          data.projectId
        );
        const storyExists = story.some((s: any) => s.id === data.storyId);
        if (!storyExists) {
          return {
            success: false,
            error: "História de usuário não encontrada",
          };
        }
      }

      // Validação simples de negócio
      if (!data.title.trim()) {
        return {
          success: false,
          error: "Título da task é obrigatório",
        };
      }

      const newTask = await this.taskRepository.create(data);

      return {
        success: true,
        data: newTask,
        message: "Task criada com sucesso",
      };
    } catch (error) {
      console.error("Erro ao criar task:", error);
      return {
        success: false,
        error: "Erro interno ao criar task",
      };
    }
  }

  /**
   * Atualiza uma task existente
   */
  async updateTask(
    id: string,
    data: UpdateTaskDTO
  ): Promise<ApiResponse<Task>> {
    try {
      // Verifica se a task existe
      const existingTask = await this.taskRepository.findById(id);
      if (!existingTask) {
        return {
          success: false,
          error: "Task não encontrada",
        };
      }

      // Verifica se o assignee existe (se fornecido)
      if (data.assigneeId) {
        const assignee = await userRepository.findById(data.assigneeId);
        if (!assignee) {
          return {
            success: false,
            error: "Responsável não encontrado",
          };
        }
      }

      // Verifica se a história existe (se fornecida)
      if (data.storyId) {
        const story = await projectRepository.findProjectStories(
          existingTask.projectId
        );
        const storyExists = story.some((s: any) => s.id === data.storyId);
        if (!storyExists) {
          return {
            success: false,
            error: "História de usuário não encontrada",
          };
        }
      }

      const updatedTask = await this.taskRepository.update(id, data);

      if (!updatedTask) {
        return {
          success: false,
          error: "Erro ao atualizar task",
        };
      }

      return {
        success: true,
        data: updatedTask,
        message: "Task atualizada com sucesso",
      };
    } catch (error) {
      console.error("Erro ao atualizar task:", error);
      return {
        success: false,
        error: "Erro interno ao atualizar task",
      };
    }
  }

  /**
   * Deleta uma task
   */
  async deleteTask(id: string): Promise<ApiResponse<null>> {
    try {
      // Verifica se a task existe
      const existingTask = await this.taskRepository.findById(id);
      if (!existingTask) {
        return {
          success: false,
          error: "Task não encontrada",
        };
      }

      const deleted = await this.taskRepository.delete(id);

      if (!deleted) {
        return {
          success: false,
          error: "Erro ao deletar task",
        };
      }

      return {
        success: true,
        message: "Task deletada com sucesso",
      };
    } catch (error) {
      console.error("Erro ao deletar task:", error);
      return {
        success: false,
        error: "Erro interno ao deletar task",
      };
    }
  }

  /**
   * Atribui uma task a um usuário
   */
  async assignTask(taskId: string, userId: string): Promise<ApiResponse<any>> {
    try {
      // Verifica se a task existe
      const task = await this.taskRepository.findById(taskId);
      if (!task) {
        return {
          success: false,
          error: "Task não encontrada",
        };
      }

      // Verifica se o usuário existe
      const user = await userRepository.findById(userId);
      if (!user) {
        return {
          success: false,
          error: "Usuário não encontrado",
        };
      }

      const assignment = await this.taskRepository.assignTask(taskId, userId);

      return {
        success: true,
        data: assignment,
        message: "Task atribuída com sucesso",
      };
    } catch (error) {
      console.error("Erro ao atribuir task:", error);
      return {
        success: false,
        error: "Erro interno ao atribuir task",
      };
    }
  }

  /**
   * Remove atribuição de uma task
   */
  async unassignTask(
    taskId: string,
    userId: string
  ): Promise<ApiResponse<null>> {
    try {
      const unassigned = await this.taskRepository.unassignTask(taskId, userId);

      if (!unassigned) {
        return {
          success: false,
          error: "Erro ao remover atribuição da task",
        };
      }

      return {
        success: true,
        message: "Atribuição removida com sucesso",
      };
    } catch (error) {
      console.error("Erro ao remover atribuição da task:", error);
      return {
        success: false,
        error: "Erro interno ao remover atribuição",
      };
    }
  }

  /**
   * Busca atribuições de uma task
   */
  async getTaskAssignments(taskId: string): Promise<ApiResponse<any>> {
    try {
      const task = await this.taskRepository.findById(taskId);
      if (!task) {
        return {
          success: false,
          error: "Task não encontrada",
        };
      }

      const assignments = await this.taskRepository.findTaskAssignments(taskId);

      return {
        success: true,
        data: assignments,
      };
    } catch (error) {
      console.error("Erro ao buscar atribuições da task:", error);
      return {
        success: false,
        error: "Erro interno ao buscar atribuições",
      };
    }
  }

  /**
   * Adiciona etiqueta à task
   */
  async addLabelToTask(
    taskId: string,
    labelId: string
  ): Promise<ApiResponse<any>> {
    try {
      const task = await this.taskRepository.findById(taskId);
      if (!task) {
        return {
          success: false,
          error: "Task não encontrada",
        };
      }

      const taskLabel = await this.taskRepository.addLabel(taskId, labelId);

      return {
        success: true,
        data: taskLabel,
        message: "Etiqueta adicionada com sucesso",
      };
    } catch (error) {
      console.error("Erro ao adicionar etiqueta:", error);
      return {
        success: false,
        error: "Erro interno ao adicionar etiqueta",
      };
    }
  }

  /**
   * Remove etiqueta da task
   */
  async removeLabelFromTask(
    taskId: string,
    labelId: string
  ): Promise<ApiResponse<null>> {
    try {
      const removed = await this.taskRepository.removeLabel(taskId, labelId);

      if (!removed) {
        return {
          success: false,
          error: "Erro ao remover etiqueta da task",
        };
      }

      return {
        success: true,
        message: "Etiqueta removida com sucesso",
      };
    } catch (error) {
      console.error("Erro ao remover etiqueta:", error);
      return {
        success: false,
        error: "Erro interno ao remover etiqueta",
      };
    }
  }

  /**
   * Busca etiquetas de uma task
   */
  async getTaskLabels(taskId: string): Promise<ApiResponse<any>> {
    try {
      const task = await this.taskRepository.findById(taskId);
      if (!task) {
        return {
          success: false,
          error: "Task não encontrada",
        };
      }

      const labels = await this.taskRepository.findTaskLabels(taskId);

      return {
        success: true,
        data: labels,
      };
    } catch (error) {
      console.error("Erro ao buscar etiquetas da task:", error);
      return {
        success: false,
        error: "Erro interno ao buscar etiquetas",
      };
    }
  }

  /**
   * Adiciona comentário à task
   */
  async addCommentToTask(
    taskId: string,
    commentData: any
  ): Promise<ApiResponse<any>> {
    try {
      const task = await this.taskRepository.findById(taskId);
      if (!task) {
        return {
          success: false,
          error: "Task não encontrada",
        };
      }

      const comment = await this.taskRepository.addComment({
        content: commentData.content,
        userId: commentData.userId,
        entityType: "task",
        entityId: taskId,
        parentId: commentData.parentId,
      });

      return {
        success: true,
        data: comment,
        message: "Comentário adicionado com sucesso",
      };
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
      return {
        success: false,
        error: "Erro interno ao adicionar comentário",
      };
    }
  }

  /**
   * Busca comentários de uma task
   */
  async getTaskComments(taskId: string): Promise<ApiResponse<any>> {
    try {
      const task = await this.taskRepository.findById(taskId);
      if (!task) {
        return {
          success: false,
          error: "Task não encontrada",
        };
      }

      const comments = await this.taskRepository.findTaskComments(taskId);

      return {
        success: true,
        data: comments,
      };
    } catch (error) {
      console.error("Erro ao buscar comentários da task:", error);
      return {
        success: false,
        error: "Erro interno ao buscar comentários",
      };
    }
  }

  /**
   * Busca tasks por status
   */
  async getTasksByStatus(statusId: string): Promise<ApiResponse<Task[]>> {
    try {
      const tasks = await this.taskRepository.findByStatus(statusId);
      return {
        success: true,
        data: tasks,
      };
    } catch (error) {
      console.error("Erro ao buscar tasks por status:", error);
      return {
        success: false,
        error: "Erro interno ao buscar tasks por status",
      };
    }
  }

  /**
   * Busca tasks por prioridade
   */
  async getTasksByPriority(priority: number): Promise<ApiResponse<Task[]>> {
    try {
      const tasks = await this.taskRepository.findByPriority(priority);
      return {
        success: true,
        data: tasks,
      };
    } catch (error) {
      console.error("Erro ao buscar tasks por prioridade:", error);
      return {
        success: false,
        error: "Erro interno ao buscar tasks por prioridade",
      };
    }
  }

  /**
   * Busca tasks vencidas
   */
  async getOverdueTasks(): Promise<ApiResponse<Task[]>> {
    try {
      const tasks = await this.taskRepository.findOverdue();
      return {
        success: true,
        data: tasks,
      };
    } catch (error) {
      console.error("Erro ao buscar tasks vencidas:", error);
      return {
        success: false,
        error: "Erro interno ao buscar tasks vencidas",
      };
    }
  }

  // Padronizar métodos para sempre retornar array vazio se não houver dados
  static async getTasksByProject(projectId: string): Promise<any[]> {
    try {
      const tasks = await new TaskRepository().findByProjectId(projectId);
      return Array.isArray(tasks) ? tasks : [];
    } catch {
      return [];
    }
  }
  static async getTasksBySprint(sprintId: string): Promise<any[]> {
    try {
      const tasks = await new TaskRepository().findBySprint(sprintId);
      return Array.isArray(tasks) ? tasks : [];
    } catch {
      return [];
    }
  }
  static async getTasksByStory(storyId: string): Promise<any[]> {
    try {
      const tasks = await new TaskRepository().findByStoryId(storyId);
      return Array.isArray(tasks) ? tasks : [];
    } catch {
      return [];
    }
  }
}

// Instância singleton do serviço
export const taskService = new TaskService();
