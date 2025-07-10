import { Context } from "hono";
import { TaskService } from "../services/TaskService";
import { ApiResponse, Task, TaskIdInput, TaskStatus } from "@shared";
import { db } from "../db/connection";
import { statuses } from "../db/schema";

export class TaskController {
  static taskService = new TaskService();

  /**
   * Busca os status padrão do banco de dados
   */
  private static async getStatusMapping(): Promise<{ [key: string]: string }> {
    try {
      const statusList = await db.select().from(statuses);
      const mapping: { [key: string]: string } = {};

      statusList.forEach((status) => {
        // Mapear diretamente pelo nome do status no banco
        mapping[status.name] = status.id;
      });

      console.log(
        "🔍 Status encontrados no banco:",
        statusList.map((s) => ({ name: s.name, id: s.id }))
      );
      console.log("📋 Mapping criado:", mapping);

      return mapping;
    } catch (error) {
      console.error("Erro ao buscar status:", error);
      return {};
    }
  }

  /**
   * Limpa campos UUID opcionais convertendo strings vazias para null
   */
  private static async cleanUuidFields(data: any): Promise<any> {
    const uuidFields = ["reporterId", "storyId", "assigneeId", "sprintId"];
    const cleanData = { ...data };

    uuidFields.forEach((field) => {
      if (cleanData[field] === "") {
        cleanData[field] = null;
      }
    });

    // Converter dueDate para Date se for string
    if (cleanData.dueDate && typeof cleanData.dueDate === "string") {
      cleanData.dueDate = new Date(cleanData.dueDate);
    }

    // Mapear status para UUIDs reais do banco
    if (cleanData.status) {
      console.log("🔍 Mapeando status:", cleanData.status);
      const statusMapping = await TaskController.getStatusMapping();
      console.log("📋 Status mapping disponível:", statusMapping);

      if (statusMapping[cleanData.status]) {
        cleanData.statusId = statusMapping[cleanData.status];
        console.log("✅ Status mapeado para ID:", cleanData.statusId);
        delete cleanData.status;
      } else {
        console.log("❌ Status não encontrado no mapping:", cleanData.status);
        // Definir um status padrão se não encontrar
        const defaultStatusId = Object.values(statusMapping)[0];
        if (defaultStatusId) {
          cleanData.statusId = defaultStatusId;
          console.log("🔄 Usando status padrão:", defaultStatusId);
        }
      }
    } else {
      console.log("⚠️ Nenhum status fornecido, definindo padrão");
      const statusMapping = await TaskController.getStatusMapping();
      const defaultStatusId = Object.values(statusMapping)[0];
      if (defaultStatusId) {
        cleanData.statusId = defaultStatusId;
        console.log("🔄 Definindo status padrão:", defaultStatusId);
      }
    }

    console.log("🧹 Dados limpos:", cleanData);
    return cleanData;
  }

  static async createTask(c: Context) {
    try {
      const data = await c.req.json();
      const cleanData = await TaskController.cleanUuidFields(data);

      console.log(
        "📥 TaskController.createTask - Payload recebido:",
        cleanData
      );

      const task = await TaskController.taskService.createTask(cleanData);
      console.log("📤 TaskController.createTask - Resposta do service:", {
        success: task.success,
        error: task.error,
        hasData: !!task.data,
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
        count: tasks.data?.length || 0,
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
        hasData: !!task.data,
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
      const cleanData = await TaskController.cleanUuidFields(data);
      console.log(
        "📥 TaskController.updateTask - ID:",
        id,
        "Payload:",
        cleanData
      );

      const task = await TaskController.taskService.updateTask(id, cleanData);
      console.log("📤 TaskController.updateTask - Resposta do service:", {
        success: task.success,
        error: task.error,
        hasData: !!task.data,
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
        error: deleted.error,
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

  static async getTasksByProject(c: Context): Promise<Response> {
    try {
      const { projectId } = c.req.param();
      const tasks = await TaskService.getTasksByProject(String(projectId));
      return c.json({
        success: true,
        data: tasks,
        message: "Tarefas do projeto listadas com sucesso",
      });
    } catch (error) {
      return c.json(
        {
          success: false,
          data: [],
          message:
            error instanceof Error
              ? error.message
              : "Erro ao listar tarefas do projeto",
        },
        400
      );
    }
  }

  static async getTasksByStory(c: Context): Promise<Response> {
    try {
      const { storyId } = c.req.param();
      const tasks = await TaskService.getTasksByStory(String(storyId));
      return c.json({
        success: true,
        data: tasks,
        message: "Tarefas da história listadas com sucesso",
      });
    } catch (error) {
      return c.json(
        {
          success: false,
          data: [],
          message:
            error instanceof Error
              ? error.message
              : "Erro ao listar tarefas da história",
        },
        400
      );
    }
  }

  /*   static async getTasksByAssignee(c: Context): Promise<Response> {
    try {
      const { assigneeId } = c.req.param();
      const tasks = await TaskService.getTasksByAssigneeId(String(assigneeId));
      return c.json({
        success: true,
        data: tasks,
        message: "Tarefas do responsável listadas com sucesso",
      });
    } catch (error) {
      return c.json(
        {
          success: false,
          data: [],
          message:
            error instanceof Error
              ? error.message
              : "Erro ao listar tarefas do responsável",
        },
        400
      );
    }
  }

  static async getTasksByReporter(c: Context): Promise<Response> {
    try {
      const { reporterId } = c.req.param();
      const tasks = await TaskService.getTasksByReporterId(String(reporterId));
      return c.json({
        success: true,
        data: tasks,
        message: "Tarefas do reporter listadas com sucesso",
      });
    } catch (error) {
      return c.json(
        {
          success: false,
          data: [],
          message:
            error instanceof Error
              ? error.message
              : "Erro ao listar tarefas do reporter",
        },
        400
      );
    }
  } */

  static async getTasksByStatus(c: Context): Promise<Response> {
    try {
      const { statusId } = c.req.param();
      // TODO: Implementar método getTasksByStatus no TaskService/Repository
      // const tasks = await TaskService.getTasksByStatus(String(statusId));
      return c.json<ApiResponse<Task[]>>({
        success: false,
        data: [],
        message: "Método getTasksByStatus ainda não implementado.",
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

  static async getTasksByPriority(c: Context): Promise<Response> {
    try {
      const { priority } = c.req.param();
      // TODO: Implementar método getTasksByPriority no TaskService/Repository
      // const tasks = await TaskService.getTasksByPriority(String(priority));
      return c.json<ApiResponse<Task[]>>({
        success: false,
        data: [],
        message: "Método getTasksByPriority ainda não implementado.",
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

  /* static async assignTask(c: Context): Promise<Response> {
    try {
      const { id, userId } = c.req.param();
      // TODO: Implementar assignTask no TaskService/Repository
      // const success = await TaskService.assignTask(String(id), String(userId));
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message: "Método assignTask ainda não implementado.",
        },
        400
      );
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

  static async unassignTask(c: Context): Promise<Response> {
    try {
      const { id, userId } = c.req.param();
      // TODO: Implementar unassignTask no TaskService/Repository
      // const success = await TaskService.unassignTask(String(id), String(userId));
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message: "Método unassignTask ainda não implementado.",
        },
        400
      );
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
  } */

  static async getTaskAssignments(c: Context): Promise<Response> {
    try {
      const { id } = c.req.param() as TaskIdInput;
      // TODO: Implementar getTaskAssignments no TaskService/Repository
      // const assignments = await TaskService.getTaskAssignments(String(id));
      return c.json<ApiResponse<any[]>>({
        success: false,
        data: [],
        message: "Método getTaskAssignments ainda não implementado.",
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

  static async getTaskLabels(c: Context): Promise<Response> {
    try {
      const { id } = c.req.param() as TaskIdInput;
      // TODO: Implementar getTaskLabels no TaskService/Repository
      // const labels = await TaskService.getTaskLabels(String(id));
      return c.json<ApiResponse<any[]>>({
        success: false,
        data: [],
        message: "Método getTaskLabels ainda não implementado.",
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

  /*  static async addLabelToTask(c: Context): Promise<Response> {
    try {
      const { id, labelId } = c.req.param();
      // TODO: Implementar addLabelToTask no TaskService/Repository
      // const success = await TaskService.addLabelToTask(String(id), String(labelId));
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message: "Método addLabelToTask ainda não implementado.",
        },
        400
      );
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

Property 'taskService' does not exist on type 'typeof TaskController'.ts(2339)
 static async removeLabelFromTask(c: Context): Promise<Response> {
    try {
      const { id, labelId } = c.req.param();
      // TODO: Implementar removeLabelFromTask no TaskService/Repository
      // const success = await TaskService.removeLabelFromTask(String(id), String(labelId));
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message: "Método removeLabelFromTask ainda não implementado.",
        },
        400
      );
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
  } */

  static async getTaskAttachments(c: Context): Promise<Response> {
    try {
      const { id } = c.req.param() as TaskIdInput;
      // TODO: Implementar getTaskAttachments no TaskService/Repository
      // const attachments = await TaskService.getTaskAttachments(String(id));
      return c.json<ApiResponse<any[]>>({
        success: false,
        data: [],
        message: "Método getTaskAttachments ainda não implementado.",
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

  static async addAttachmentToTask(c: Context): Promise<Response> {
    try {
      const { id } = c.req.param() as TaskIdInput;
      // TODO: Implementar addAttachmentToTask no TaskService/Repository
      // const result = await TaskService.addAttachmentToTask(String(id), ...);
      return c.json<ApiResponse<any>>(
        {
          success: false,
          data: null,
          message: "Método addAttachmentToTask ainda não implementado.",
        },
        400
      );
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

  /*   static async removeAttachmentFromTask(c: Context): Promise<Response> {
    try {
      const { id, attachmentId } = c.req.param();
      // TODO: Implementar removeAttachmentFromTask no TaskService/Repository
      // const success = await TaskService.removeAttachmentFromTask(String(id), String(attachmentId));
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message: "Método removeAttachmentFromTask ainda não implementado.",
        },
        400
      );
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
  } */

  static async getTaskDependencies(c: Context): Promise<Response> {
    try {
      const { id } = c.req.param() as TaskIdInput;
      // TODO: Implementar getTaskDependencies no TaskService/Repository
      // const dependencies = await TaskService.getTaskDependencies(String(id));
      return c.json<ApiResponse<any[]>>({
        success: false,
        data: [],
        message: "Método getTaskDependencies ainda não implementado.",
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

  static async addDependencyToTask(c: Context): Promise<Response> {
    try {
      const { id } = c.req.param() as TaskIdInput;
      // TODO: Implementar addDependencyToTask no TaskService/Repository
      // const result = await TaskService.addDependencyToTask(String(id), ...);
      return c.json<ApiResponse<any>>(
        {
          success: false,
          data: null,
          message: "Método addDependencyToTask ainda não implementado.",
        },
        400
      );
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

  /*   static async removeDependencyFromTask(c: Context): Promise<Response> {
    try {
      const { id, dependencyId } = c.req.param();
      // TODO: Implementar removeDependencyFromTask no TaskService/Repository
      // const success = await TaskService.removeDependencyFromTask(String(id), String(dependencyId));
      return c.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          message: "Método removeDependencyFromTask ainda não implementado.",
        },
        400
      );
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
  } */

  static async getTaskComments(c: Context): Promise<Response> {
    try {
      const { id } = c.req.param() as TaskIdInput;
      // TODO: Implementar getTaskComments no TaskService/Repository
      // const comments = await TaskService.getTaskComments(String(id));
      return c.json<ApiResponse<any[]>>({
        success: false,
        data: [],
        message: "Método getTaskComments ainda não implementado.",
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

  static async addCommentToTask(c: Context): Promise<Response> {
    try {
      const { id } = c.req.param() as TaskIdInput;
      // TODO: Implementar addCommentToTask no TaskService/Repository
      // const comment = await TaskService.addCommentToTask(String(id), ...);
      return c.json<ApiResponse<any>>(
        {
          success: false,
          data: null,
          message: "Método addCommentToTask ainda não implementado.",
        },
        400
      );
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

  static async getOverdueTasks(c: Context): Promise<Response> {
    try {
      // TODO: Implementar getOverdueTasks no TaskService/Repository
      // const tasks = await TaskService.getOverdueTasks();
      return c.json<ApiResponse<Task[]>>({
        success: false,
        data: [],
        message: "Método getOverdueTasks ainda não implementado.",
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

  /*   static async updateTaskTime(c: Context): Promise<Response> {
    try {
      const { id } = c.req.param() as TaskIdInput;
      // TODO: Implementar updateTaskTime no TaskService/Repository
      // const task = await TaskService.updateTaskTime(String(id), ...);
      return c.json<ApiResponse<Task>>({
        success: false,
        data: null,
        message: "Método updateTaskTime ainda não implementado.",
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
  } */

  static async getTasksBySprint(c: Context): Promise<Response> {
    try {
      const { sprintId } = c.req.param();
      const tasks = await TaskService.getTasksBySprint(String(sprintId));
      return c.json({
        success: true,
        data: tasks,
        message: "Tarefas do sprint listadas com sucesso",
      });
    } catch (error) {
      return c.json(
        {
          success: false,
          data: [],
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
