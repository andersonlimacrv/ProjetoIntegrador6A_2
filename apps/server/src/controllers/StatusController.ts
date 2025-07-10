import { Context } from "hono";
import { ApiResponse, Status } from "@shared";
import { db } from "../db/connection";
import { statuses, status_flows } from "../db/schema";
import { eq, and, inArray } from "drizzle-orm";

export class StatusController {
  /**
   * Busca todos os status
   */
  static async getAllStatuses(c: Context) {
    try {
      console.log("📥 StatusController.getAllStatuses - Requisição recebida");

      const statusList = await db
        .select()
        .from(statuses)
        .orderBy(statuses.order);

      console.log("📤 StatusController.getAllStatuses - Status encontrados:", {
        count: statusList.length,
      });

      return c.json(
        {
          success: true,
          data: statusList,
          message: "Status listados com sucesso",
        },
        200
      );
    } catch (error) {
      console.error(
        "💥 StatusController.getAllStatuses - Erro capturado:",
        error
      );
      return c.json({ success: false, error: "Erro ao listar status" }, 500);
    }
  }

  /**
   * Busca status por projeto
   */
  static async getStatusesByProject(c: Context) {
    try {
      const projectId = c.req.param("projectId");
      console.log(
        "📥 StatusController.getStatusesByProject - ProjectId:",
        projectId
      );

      // Buscar fluxos de status do projeto
      const flows = await db
        .select()
        .from(status_flows)
        .where(
          and(
            eq(status_flows.projectId, projectId),
            eq(status_flows.entityType, "task")
          )
        );

      if (flows.length === 0) {
        console.log("⚠️ Nenhum fluxo de status encontrado para o projeto");
        return c.json(
          {
            success: true,
            data: [],
            message: "Nenhum status encontrado para este projeto",
          },
          200
        );
      }

      // Buscar status dos fluxos encontrados
      const flowIds = flows.map((flow) => flow.id);
      const statusList = await db
        .select()
        .from(statuses)
        .where(inArray(statuses.flowId, flowIds))
        .orderBy(statuses.order);

      console.log(
        "📤 StatusController.getStatusesByProject - Status encontrados:",
        {
          projectId,
          flowsCount: flows.length,
          statusCount: statusList.length,
        }
      );

      return c.json(
        {
          success: true,
          data: statusList,
          message: "Status do projeto listados com sucesso",
        },
        200
      );
    } catch (error) {
      console.error(
        "💥 StatusController.getStatusesByProject - Erro capturado:",
        error
      );
      return c.json(
        { success: false, error: "Erro ao listar status do projeto" },
        500
      );
    }
  }

  /**
   * Busca status por ID
   */
  static async getStatusById(c: Context) {
    try {
      const id = c.req.param("id");
      console.log("📥 StatusController.getStatusById - ID recebido:", id);

      const [status] = await db
        .select()
        .from(statuses)
        .where(eq(statuses.id, id));

      if (!status) {
        return c.json(
          {
            success: false,
            error: "Status não encontrado",
          },
          404
        );
      }

      console.log("📤 StatusController.getStatusById - Status encontrado");

      return c.json(
        {
          success: true,
          data: status,
          message: "Status encontrado com sucesso",
        },
        200
      );
    } catch (error) {
      console.error(
        "💥 StatusController.getStatusById - Erro capturado:",
        error
      );
      return c.json({ success: false, error: "Erro ao buscar status" }, 500);
    }
  }
}
