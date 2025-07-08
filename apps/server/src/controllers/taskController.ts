import { Context } from "hono";
import { TaskService } from "../services/TaskService";
import {
  ApiResponse,
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  TaskIdInput,
  CreateCommentInput,
} from "@shared";

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  static async createTask(c: Context) {
    try {
      const data = await c.req.json();
      console.log("📥 TaskController.createTask - Payload recebido:", data);
      
      const task = await TaskController.taskService.createTask(data);
      console.log("📤 TaskController.createTask - Resposta do service:", {
        success: task.success,
        error: task.error,
        hasData: !!task.data
      });
      
      return c.json(
        {
          ...task,
          message: task.success
            ? "Tarefa criada com sucesso"
            : task.error || "Erro ao criar tarefa",
        },
        task.success ? 201 : 400
      );
    } catch (error) {
      console.error("💥 TaskController.createTask - Erro capturado:", error);
      return c.json({ success: false, error: "Erro ao criar tarefa" }, 500);
    }
  }

  static async getAllTasks(c: Context) {
    try {
      console.log("📥 TaskController.getAllTasks - Requisição recebida");
      
      const tasks = await TaskController.taskService.getAllTasks();
      console.log("📤 TaskController.getAllTasks - Resposta do service:", {
        success: tasks.success,
        count: tasks.data?.length || 0
      });
      
      return c.json(
        { ...tasks, message: "Tarefas listadas com sucesso" },
        tasks.success ? 200 : 500
      );
    } catch (error) {
      console.error("💥 TaskController.getAllTasks - Erro capturado:", error);
      return c.json({ success: false, error: "Erro ao listar tarefas" }, 500);
    }
  }

  static async getTaskById(c: Context) {
    try {
      const id = c.req.param("id");
      console.log("📥 TaskController.getTaskById - ID recebido:", id);
      
      const task = await TaskController.taskService.getTaskById(id);
      console.log("📤 TaskController.getTaskById - Resposta do service:", {
        success: task.success,
        error: task.error,
        hasData: !!task.data
      });
      
      return c.json(
        {
          ...task,
          message: task.success
            ? "Tarefa encontrada com sucesso"
            : task.error || "Tarefa não encontrada",
        },
        task.success ? 200 : 404
      );
    } catch (error) {
      console.error("💥 TaskController.getTaskById - Erro capturado:", error);
      return c.json({ success: false, error: "Erro ao buscar tarefa" }, 500);
    }
  }

  static async updateTask(c: Context) {
    try {
      const id = c.req.param("id");
      const data = await c.req.json();
      console.log("📥 TaskController.updateTask - ID:", id, "Payload:", data);
      
      const task = await TaskController.taskService.updateTask(id, data);
      console.log("📤 TaskController.updateTask - Resposta do service:", {
        success: task.success,
        error: task.error,
        hasData: !!task.data
      });
      
      return c.json(
        {
          ...task,
          message: task.success
            ? "Tarefa atualizada com sucesso"
            : task.error || "Tarefa não encontrada",
        },
        task.success ? 200 : 404
      );
    } catch (error) {
      console.error("💥 TaskController.updateTask - Erro capturado:", error);
      return c.json({ success: false, error: "Erro ao atualizar tarefa" }, 500);
    }
  }

  static async deleteTask(c: Context) {
    try {
      const id = c.req.param("id");
      console.log("📥 TaskController.deleteTask - ID recebido:", id);
      
      const deleted = await TaskController.taskService.deleteTask(id);
      console.log("📤 TaskController.deleteTask - Resposta do service:", {
        success: deleted.success,
        error: deleted.error
      });
      
      return c.json(
        {
          ...deleted,
          message: deleted.success
            ? "Tarefa deletada com sucesso"
            : deleted.error || "Tarefa não encontrada",
        },
        deleted.success ? 200 : 404
      );
    } catch (error) {
      console.error("💥 TaskController.deleteTask - Erro capturado:", error);
      return c.json({ success: false, error: "Erro ao deletar tarefa" }, 500);
    }
  }

  async getTasksByProject(c: Context): Promise<Response> {
    try {
      const { projectId } = c.req.param();
      const tasks = await this.taskService.getTasksByProject(
        parseInt(projectId)
      );

      return c.json<ApiResponse<Task[]>>({
        success: true,
        data: tasks,
        message: "Tarefas do projeto listadas com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error
              ? error.message
              : "Erro ao listar tarefas do projeto",
        },
        400
      );
    }
  }

  async getTasksByStory(c: Context): Promise<Response> {
    try {
      const { storyId } = c.req.param();
      const tasks = await this.taskService.getTasksByStory(parseInt(storyId));

      return c.json<ApiResponse<Task[]>>({
        success: true,
        data: tasks,
        message: "Tarefas da história listadas com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error
              ? error.message
              : "Erro ao listar tarefas da história",
        },
        400
      );
    }
  }

  async getTasksByAssignee(c: Context): Promise<Response> {
    try {
      const { assigneeId } = c.req.param();
      const tasks = await this.taskService.getTasksByAssignee(
        parseInt(assigneeId)
      );

      return c.json<ApiResponse<Task[]>>({
        success: true,
        data: tasks,
        message: "Tarefas do responsável listadas com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error
              ? error.message
              : "Erro ao listar tarefas do responsável",
        },
        400
      );
    }
  }

  async getTasksByReporter(c: Context): Promise<Response> {
    try {
      const { reporterId } = c.req.param();
      const tasks = await this.taskService.getTasksByReporter(
        parseInt(reporterId)
      );

      return c.json<ApiResponse<Task[]>>({
        success: true,
        data: tasks,
        message: "Tarefas do reporter listadas com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error
              ? error.message
              : "Erro ao listar tarefas do reporter",
        },
        400
      );
    }
  }

  async getTasksByStatus(c: Context): Promise<Response> {
    try {
      const { statusId } = c.req.param();
      const tasks = await this.taskService.getTasksByStatus(parseInt(statusId));

      return c.json<ApiResponse<Task[]>>({
        success: true,
        data: tasks,
        message: "Tarefas por status listadas com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error
              ? error.message
              : "Erro ao listar tarefas por status",
        },
        400
      );
    }
  }

  async getTasksByPriority(c: Context): Promise<Response> {
    try {
      const { priority } = c.req.param();
      const tasks = await this.taskService.getTasksByPriority(
        parseInt(priority)
      );

      return c.json<ApiResponse<Task[]>>({
        success: true,
        data: tasks,
        message: "Tarefas por prioridade listadas com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error
              ? error.message
              : "Erro ao listar tarefas por prioridade",
        },
        400
      );
    }
  }

  async assignTask(c: Context): Promise<Response> {
    try {
      const { id, userId } = c.req.param();
      const success = await this.taskService.assignTask(
        parseInt(id),
        parseInt(userId)
      );

      if (!success) {
        return c.json<ApiResponse<null>>(
          {
            success: false,
            data: null,
            message: "Erro ao atribuir tarefa",
          },
          400
        );
      }

      return c.json<ApiResponse<null>>({
        success: true,
        data: null,
        message: "Tarefa atribuída com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error ? error.message : "Erro ao atribuir tarefa",
        },
        400
      );
    }
  }

  async unassignTask(c: Context): Promise<Response> {
    try {
      const { id, userId } = c.req.param();
      const success = await this.taskService.unassignTask(
        parseInt(id),
        parseInt(userId)
      );

      if (!success) {
        return c.json<ApiResponse<null>>(
          {
            success: false,
            data: null,
            message: "Erro ao desatribuir tarefa",
          },
          400
        );
      }

      return c.json<ApiResponse<null>>({
        success: true,
        data: null,
        message: "Tarefa desatribuída com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error
              ? error.message
              : "Erro ao desatribuir tarefa",
        },
        400
      );
    }
  }

  async getTaskAssignments(c: Context): Promise<Response> {
    try {
      const { id } = c.req.param() as TaskIdInput;
      const assignments = await this.taskService.getTaskAssignments(
        parseInt(id)
      );

      return c.json<ApiResponse<any[]>>({
        success: true,
        data: assignments,
        message: "Atribuições da tarefa listadas com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error
              ? error.message
              : "Erro ao listar atribuições",
        },
        400
      );
    }
  }

  async getTaskLabels(c: Context): Promise<Response> {
    try {
      const { id } = c.req.param() as TaskIdInput;
      const labels = await this.taskService.getTaskLabels(parseInt(id));

      return c.json<ApiResponse<any[]>>({
        success: true,
        data: labels,
        message: "Etiquetas da tarefa listadas com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error ? error.message : "Erro ao listar etiquetas",
        },
        400
      );
    }
  }

  async addLabelToTask(c: Context): Promise<Response> {
    try {
      const { id, labelId } = c.req.param();
      const success = await this.taskService.addLabelToTask(
        parseInt(id),
        parseInt(labelId)
      );

      if (!success) {
        return c.json<ApiResponse<null>>(
          {
            success: false,
            data: null,
            message: "Erro ao adicionar etiqueta",
          },
          400
        );
      }

      return c.json<ApiResponse<null>>({
        success: true,
        data: null,
        message: "Etiqueta adicionada com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error
              ? error.message
              : "Erro ao adicionar etiqueta",
        },
        400
      );
    }
  }

  async removeLabelFromTask(c: Context): Promise<Response> {
    try {
      const { id, labelId } = c.req.param();
      const success = await this.taskService.removeLabelFromTask(
        parseInt(id),
        parseInt(labelId)
      );

      if (!success) {
        return c.json<ApiResponse<null>>(
          {
            success: false,
            data: null,
            message: "Erro ao remover etiqueta",
          },
          400
        );
      }

      return c.json<ApiResponse<null>>({
        success: true,
        data: null,
        message: "Etiqueta removida com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error ? error.message : "Erro ao remover etiqueta",
        },
        400
      );
    }
  }

  async getTaskAttachments(c: Context): Promise<Response> {
    try {
      const { id } = c.req.param() as TaskIdInput;
      const attachments = await this.taskService.getTaskAttachments(
        parseInt(id)
      );

      return c.json<ApiResponse<any[]>>({
        success: true,
        data: attachments,
        message: "Anexos da tarefa listados com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error ? error.message : "Erro ao listar anexos",
        },
        400
      );
    }
  }

  async addAttachmentToTask(c: Context): Promise<Response> {
    try {
      const { id } = c.req.param() as TaskIdInput;
      const attachment = await c.req.json();
      const result = await this.taskService.addAttachmentToTask(
        parseInt(id),
        attachment
      );

      return c.json<ApiResponse<any>>({
        success: true,
        data: result,
        message: "Anexo adicionado com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error ? error.message : "Erro ao adicionar anexo",
        },
        400
      );
    }
  }

  async removeAttachmentFromTask(c: Context): Promise<Response> {
    try {
      const { id, attachmentId } = c.req.param();
      const success = await this.taskService.removeAttachmentFromTask(
        parseInt(id),
        parseInt(attachmentId)
      );

      if (!success) {
        return c.json<ApiResponse<null>>(
          {
            success: false,
            data: null,
            message: "Erro ao remover anexo",
          },
          400
        );
      }

      return c.json<ApiResponse<null>>({
        success: true,
        data: null,
        message: "Anexo removido com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error ? error.message : "Erro ao remover anexo",
        },
        400
      );
    }
  }

  async getTaskDependencies(c: Context): Promise<Response> {
    try {
      const { id } = c.req.param() as TaskIdInput;
      const dependencies = await this.taskService.getTaskDependencies(
        parseInt(id)
      );

      return c.json<ApiResponse<any[]>>({
        success: true,
        data: dependencies,
        message: "Dependências da tarefa listadas com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error
              ? error.message
              : "Erro ao listar dependências",
        },
        400
      );
    }
  }

  async addDependencyToTask(c: Context): Promise<Response> {
    try {
      const { id } = c.req.param() as TaskIdInput;
      const dependency = await c.req.json();
      const result = await this.taskService.addDependencyToTask(
        parseInt(id),
        dependency
      );

      return c.json<ApiResponse<any>>({
        success: true,
        data: result,
        message: "Dependência adicionada com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error
              ? error.message
              : "Erro ao adicionar dependência",
        },
        400
      );
    }
  }

  async removeDependencyFromTask(c: Context): Promise<Response> {
    try {
      const { id, dependencyId } = c.req.param();
      const success = await this.taskService.removeDependencyFromTask(
        parseInt(id),
        parseInt(dependencyId)
      );

      if (!success) {
        return c.json<ApiResponse<null>>(
          {
            success: false,
            data: null,
            message: "Erro ao remover dependência",
          },
          400
        );
      }

      return c.json<ApiResponse<null>>({
        success: true,
        data: null,
        message: "Dependência removida com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error
              ? error.message
              : "Erro ao remover dependência",
        },
        400
      );
    }
  }

  async getTaskComments(c: Context): Promise<Response> {
    try {
      const { id } = c.req.param() as TaskIdInput;
      const comments = await this.taskService.getTaskComments(parseInt(id));

      return c.json<ApiResponse<any[]>>({
        success: true,
        data: comments,
        message: "Comentários da tarefa listados com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error
              ? error.message
              : "Erro ao listar comentários",
        },
        400
      );
    }
  }

  async addCommentToTask(c: Context): Promise<Response> {
    try {
      const { id } = c.req.param() as TaskIdInput;
      const input: CreateCommentInput = await c.req.json();
      const comment = await this.taskService.addCommentToTask(
        parseInt(id),
        input
      );

      return c.json<ApiResponse<any>>({
        success: true,
        data: comment,
        message: "Comentário adicionado com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error
              ? error.message
              : "Erro ao adicionar comentário",
        },
        400
      );
    }
  }

  async getOverdueTasks(c: Context): Promise<Response> {
    try {
      const tasks = await this.taskService.getOverdueTasks();

      return c.json<ApiResponse<Task[]>>({
        success: true,
        data: tasks,
        message: "Tarefas em atraso listadas com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error
              ? error.message
              : "Erro ao listar tarefas em atraso",
        },
        400
      );
    }
  }

  async updateTaskTime(c: Context): Promise<Response> {
    try {
      const { id } = c.req.param() as TaskIdInput;
      const timeData = await c.req.json();
      const task = await this.taskService.updateTaskTime(
        parseInt(id),
        timeData
      );

      if (!task) {
        return c.json<ApiResponse<null>>(
          {
            success: false,
            data: null,
            message: "Tarefa não encontrada",
          },
          404
        );
      }

      return c.json<ApiResponse<Task>>({
        success: true,
        data: task,
        message: "Tempo da tarefa atualizado com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error
              ? error.message
              : "Erro ao atualizar tempo da tarefa",
        },
        400
      );
    }
  }

  async getTasksBySprint(c: Context): Promise<Response> {
    try {
      const { sprintId } = c.req.param();
      const tasks = await this.taskService.getTasksBySprint(parseInt(sprintId));

      return c.json<ApiResponse<Task[]>>({
        success: true,
        data: tasks,
        message: "Tarefas do sprint listadas com sucesso",
      });
    } catch (error) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message:
            error instanceof Error
              ? error.message
              : "Erro ao listar tarefas do sprint",
        },
        400
      );
    }
  }
}
