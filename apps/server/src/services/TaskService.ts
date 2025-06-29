import { taskRepository } from "../repositories/TaskRepository";
import { userRepository } from "../repositories/UserRepository";
import {
  Task,
  CreateTaskDTO,
  UpdateTaskDTO,
  ApiResponse,
} from "@packages/shared";

export class TaskService {
  /**
   * Busca todas as tasks
   */
  async getAllTasks(): Promise<ApiResponse<Task[]>> {
    try {
      const tasks = await taskRepository.findAll();
      return {
        success: true,
        data: tasks,
      };
    } catch (error) {
      console.error("Erro ao buscar tasks:", error);
      return {
        success: false,
        error: "Erro interno ao buscar tasks",
      };
    }
  }

  /**
   * Busca todas as tasks de um usuário
   */
  async getTasksByUserId(userId: number): Promise<ApiResponse<Task[]>> {
    try {
      // Verifica se o usuário existe
      const user = await userRepository.findById(userId);
      if (!user) {
        return {
          success: false,
          error: "Usuário não encontrado",
        };
      }

      const tasks = await taskRepository.findByUserId(userId);
      return {
        success: true,
        data: tasks,
      };
    } catch (error) {
      console.error("Erro ao buscar tasks do usuário:", error);
      return {
        success: false,
        error: "Erro interno ao buscar tasks do usuário",
      };
    }
  }

  /**
   * Busca uma task por ID
   */
  async getTaskById(id: number): Promise<ApiResponse<Task>> {
    try {
      const task = await taskRepository.findById(id);

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
   * Busca uma task por ID com dados do usuário
   */
  async getTaskByIdWithUser(id: number): Promise<ApiResponse<Task & { user: any }>> {
    try {
      const task = await taskRepository.findByIdWithUser(id);

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
      console.error("Erro ao buscar task com usuário:", error);
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
      // Verifica se o usuário existe
      const user = await userRepository.findById(data.userId);
      if (!user) {
        return {
          success: false,
          error: "Usuário não encontrado",
        };
      }

      // Validação simples de negócio
      if (!data.title.trim()) {
        return {
          success: false,
          error: "Título da task é obrigatório",
        };
      }

      const newTask = await taskRepository.create(data);

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
    id: number,
    data: UpdateTaskDTO
  ): Promise<ApiResponse<Task>> {
    try {
      // Verifica se a task existe
      const existingTask = await taskRepository.findById(id);
      if (!existingTask) {
        return {
          success: false,
          error: "Task não encontrada",
        };
      }

      // Regra de negócio simples: tasks completadas não podem ser editadas
      if (existingTask.completed && (data.title || data.description)) {
        return {
          success: false,
          error: "Tasks completadas não podem ser editadas",
        };
      }

      const updatedTask = await taskRepository.update(id, data);

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
   * Marca uma task como completa
   */
  async markTaskAsCompleted(id: number): Promise<ApiResponse<Task>> {
    try {
      const existingTask = await taskRepository.findById(id);
      if (!existingTask) {
        return {
          success: false,
          error: "Task não encontrada",
        };
      }

      if (existingTask.completed) {
        return {
          success: false,
          error: "Task já está completa",
        };
      }

      const updatedTask = await taskRepository.markAsCompleted(id);

      if (!updatedTask) {
        return {
          success: false,
          error: "Erro ao marcar task como completa",
        };
      }

      return {
        success: true,
        data: updatedTask,
        message: "Task marcada como completa",
      };
    } catch (error) {
      console.error("Erro ao marcar task como completa:", error);
      return {
        success: false,
        error: "Erro interno ao marcar task como completa",
      };
    }
  }

  /**
   * Marca uma task como incompleta
   */
  async markTaskAsIncomplete(id: number): Promise<ApiResponse<Task>> {
    try {
      const existingTask = await taskRepository.findById(id);
      if (!existingTask) {
        return {
          success: false,
          error: "Task não encontrada",
        };
      }

      const updatedTask = await taskRepository.markAsIncomplete(id);

      if (!updatedTask) {
        return {
          success: false,
          error: "Erro ao marcar task como incompleta",
        };
      }

      return {
        success: true,
        data: updatedTask,
        message: "Task marcada como incompleta",
      };
    } catch (error) {
      console.error("Erro ao marcar task como incompleta:", error);
      return {
        success: false,
        error: "Erro interno ao marcar task como incompleta",
      };
    }
  }

  /**
   * Deleta uma task
   */
  async deleteTask(id: number): Promise<ApiResponse<null>> {
    try {
      // Verifica se a task existe
      const existingTask = await taskRepository.findById(id);
      if (!existingTask) {
        return {
          success: false,
          error: "Task não encontrada",
        };
      }

      const deleted = await taskRepository.delete(id);

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
   * Busca tasks completadas
   */
  async getCompletedTasks(): Promise<ApiResponse<Task[]>> {
    try {
      const tasks = await taskRepository.findCompleted();
      return {
        success: true,
        data: tasks,
      };
    } catch (error) {
      console.error("Erro ao buscar tasks completadas:", error);
      return {
        success: false,
        error: "Erro interno ao buscar tasks completadas",
      };
    }
  }

  /**
   * Busca tasks pendentes
   */
  async getPendingTasks(): Promise<ApiResponse<Task[]>> {
    try {
      const tasks = await taskRepository.findPending();
      return {
        success: true,
        data: tasks,
      };
    } catch (error) {
      console.error("Erro ao buscar tasks pendentes:", error);
      return {
        success: false,
        error: "Erro interno ao buscar tasks pendentes",
      };
    }
  }
}

// Instância singleton do serviço
export const taskService = new TaskService();
