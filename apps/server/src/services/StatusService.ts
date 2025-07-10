import { db } from "../db/connection";
import { status_flows, statuses } from "../db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { ApiResponse } from "../../../packages/shared/src";

export class StatusService {
  /**
   * Cria status flows padrão para um projeto
   */
  async createDefaultStatusFlows(projectId: string): Promise<ApiResponse<any>> {
    try {
      console.log(
        "🔧 StatusService.createDefaultStatusFlows - Criando fluxos padrão para projeto:",
        projectId
      );

      // Status flows padrão para tarefas
      const defaultTaskFlow = await db
        .insert(status_flows)
        .values({
          id: randomUUID(),
          projectId: projectId,
          name: "Fluxo Padrão de Tarefas",
          entityType: "task",
          isDefault: true,
          createdAt: new Date(),
        })
        .returning();

      console.log("✅ Status flow de tarefas criado:", defaultTaskFlow[0].id);

      // Status flows padrão para user stories
      const defaultStoryFlow = await db
        .insert(status_flows)
        .values({
          id: randomUUID(),
          projectId: projectId,
          name: "Fluxo Padrão de User Stories",
          entityType: "story",
          isDefault: true,
          createdAt: new Date(),
        })
        .returning();

      console.log(
        "✅ Status flow de user stories criado:",
        defaultStoryFlow[0].id
      );

      // Status flows padrão para epics
      const defaultEpicFlow = await db
        .insert(status_flows)
        .values({
          id: randomUUID(),
          projectId: projectId,
          name: "Fluxo Padrão de Epics",
          entityType: "epic",
          isDefault: true,
          createdAt: new Date(),
        })
        .returning();

      console.log("✅ Status flow de epics criado:", defaultEpicFlow[0].id);

      return {
        success: true,
        data: {
          taskFlow: defaultTaskFlow[0],
          storyFlow: defaultStoryFlow[0],
          epicFlow: defaultEpicFlow[0],
        },
        message: "Status flows padrão criados com sucesso",
      };
    } catch (error) {
      console.error("💥 StatusService.createDefaultStatusFlows - Erro:", error);
      return {
        success: false,
        error: "Erro ao criar status flows padrão",
      };
    }
  }

  /**
   * Cria status padrão para um fluxo
   */
  async createDefaultStatuses(
    flowId: string,
    entityType: string
  ): Promise<ApiResponse<any>> {
    try {
      console.log(
        "🔧 StatusService.createDefaultStatuses - Criando status padrão para flow:",
        flowId,
        "tipo:",
        entityType
      );

      let defaultStatuses: Array<{
        name: string;
        color: string;
        order: number;
        isFinal: boolean;
        isInitial: boolean;
      }> = [];

      // Status padrão baseados no tipo de entidade
      if (entityType === "task") {
        defaultStatuses = [
          {
            name: "TODO",
            color: "#6B7280",
            order: 1,
            isFinal: false,
            isInitial: true,
          },
          {
            name: "IN_PROGRESS",
            color: "#3B82F6",
            order: 2,
            isFinal: false,
            isInitial: false,
          },
          {
            name: "IN_REVIEW",
            color: "#F59E0B",
            order: 3,
            isFinal: false,
            isInitial: false,
          },
          {
            name: "DONE",
            color: "#10B981",
            order: 4,
            isFinal: true,
            isInitial: false,
          },
          {
            name: "BLOCKED",
            color: "#EF4444",
            order: 5,
            isFinal: false,
            isInitial: false,
          },
        ];
      } else if (entityType === "story") {
        defaultStatuses = [
          {
            name: "BACKLOG",
            color: "#6B7280",
            order: 1,
            isFinal: false,
            isInitial: true,
          },
          {
            name: "READY",
            color: "#8B5CF6",
            order: 2,
            isFinal: false,
            isInitial: false,
          },
          {
            name: "IN_PROGRESS",
            color: "#3B82F6",
            order: 3,
            isFinal: false,
            isInitial: false,
          },
          {
            name: "IN_REVIEW",
            color: "#F59E0B",
            order: 4,
            isFinal: false,
            isInitial: false,
          },
          {
            name: "DONE",
            color: "#10B981",
            order: 5,
            isFinal: true,
            isInitial: false,
          },
        ];
      } else if (entityType === "epic") {
        defaultStatuses = [
          {
            name: "PLANNING",
            color: "#6B7280",
            order: 1,
            isFinal: false,
            isInitial: true,
          },
          {
            name: "IN_PROGRESS",
            color: "#3B82F6",
            order: 2,
            isFinal: false,
            isInitial: false,
          },
          {
            name: "REVIEW",
            color: "#F59E0B",
            order: 3,
            isFinal: false,
            isInitial: false,
          },
          {
            name: "COMPLETED",
            color: "#10B981",
            order: 4,
            isFinal: true,
            isInitial: false,
          },
        ];
      }

      // Criar todos os status
      const createdStatuses = [];
      for (const statusData of defaultStatuses) {
        const [status] = await db
          .insert(statuses)
          .values({
            id: randomUUID(),
            flowId: flowId,
            name: statusData.name,
            color: statusData.color,
            order: statusData.order,
            isFinal: statusData.isFinal,
            isInitial: statusData.isInitial,
          })
          .returning();

        createdStatuses.push(status);
        console.log(`✅ Status criado: ${status.name} (${status.color})`);
      }

      return {
        success: true,
        data: createdStatuses,
        message: `Status padrão criados para ${entityType}`,
      };
    } catch (error) {
      console.error("💥 StatusService.createDefaultStatuses - Erro:", error);
      return {
        success: false,
        error: "Erro ao criar status padrão",
      };
    }
  }

  /**
   * Cria todos os status flows e status padrão para um projeto
   */
  async initializeProjectStatuses(
    projectId: string
  ): Promise<ApiResponse<any>> {
    try {
      console.log(
        "🚀 StatusService.initializeProjectStatuses - Inicializando status para projeto:",
        projectId
      );

      // 1. Criar status flows padrão
      const flowsResult = await this.createDefaultStatusFlows(projectId);
      if (!flowsResult.success) {
        return flowsResult;
      }

      const flows = flowsResult.data;

      // 2. Criar status para cada flow
      const taskStatusesResult = await this.createDefaultStatuses(
        flows.taskFlow.id,
        "task"
      );
      const storyStatusesResult = await this.createDefaultStatuses(
        flows.storyFlow.id,
        "story"
      );
      const epicStatusesResult = await this.createDefaultStatuses(
        flows.epicFlow.id,
        "epic"
      );

      if (
        !taskStatusesResult.success ||
        !storyStatusesResult.success ||
        !epicStatusesResult.success
      ) {
        return {
          success: false,
          error: "Erro ao criar status padrão",
        };
      }

      console.log(
        "✅ StatusService.initializeProjectStatuses - Projeto inicializado com sucesso"
      );

      return {
        success: true,
        data: {
          flows: flows,
          taskStatuses: taskStatusesResult.data,
          storyStatuses: storyStatusesResult.data,
          epicStatuses: epicStatusesResult.data,
        },
        message: "Status do projeto inicializados com sucesso",
      };
    } catch (error) {
      console.error(
        "💥 StatusService.initializeProjectStatuses - Erro:",
        error
      );
      return {
        success: false,
        error: "Erro ao inicializar status do projeto",
      };
    }
  }

  /**
   * Busca todos os fluxos de status de um projeto
   */
  async getProjectStatusFlows(projectId: string): Promise<ApiResponse<any>> {
    try {
      const flows = await db
        .select()
        .from(status_flows)
        .where(eq(status_flows.projectId, projectId));

      return {
        success: true,
        data: flows,
      };
    } catch (error) {
      console.error("💥 StatusService.getProjectStatusFlows - Erro:", error);
      return {
        success: false,
        error: "Erro ao buscar fluxos de status",
      };
    }
  }

  /**
   * Cria um novo fluxo de status para um projeto
   */
  async createStatusFlow(
    projectId: string,
    data: {
      name: string;
      entityType: string;
      isDefault?: boolean;
    }
  ): Promise<ApiResponse<any>> {
    try {
      const [flow] = await db
        .insert(status_flows)
        .values({
          id: randomUUID(),
          projectId: projectId,
          name: data.name,
          entityType: data.entityType,
          isDefault: data.isDefault || false,
          createdAt: new Date(),
        })
        .returning();

      return {
        success: true,
        data: flow,
        message: "Fluxo de status criado com sucesso",
      };
    } catch (error) {
      console.error("💥 StatusService.createStatusFlow - Erro:", error);
      return {
        success: false,
        error: "Erro ao criar fluxo de status",
      };
    }
  }
}
