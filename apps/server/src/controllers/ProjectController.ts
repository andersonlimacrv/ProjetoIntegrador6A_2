import { Context } from "hono";
import { ProjectService } from "../services/ProjectService";
import { ApiResponse } from "@shared";

export class ProjectController {
  private static projectService = new ProjectService();

  // CRUD básico
  static async getAllProjects(c: Context) {
    try {
      const projects = await ProjectController.projectService.getAllProjects();
      return c.json(
        {
          ...projects,
          message: projects.success
            ? "Projetos listados com sucesso"
            : projects.error || "Erro ao buscar projetos",
        },
        projects.success ? 200 : 500
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar projetos" }, 500);
    }
  }

  static async getProjectById(c: Context) {
    try {
      const id = c.req.param("id");
      const project = await ProjectController.projectService.getProjectById(id);
      return c.json(
        {
          ...project,
          message: project.success
            ? "Projeto encontrado com sucesso"
            : project.error || "Projeto não encontrado",
        },
        project.success ? 200 : 404
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar projeto" }, 500);
    }
  }

  static async getProjectBySlug(c: Context) {
    try {
      const slug = c.req.param("slug");
      const project = await ProjectController.projectService.getProjectBySlug(
        slug
      );
      return c.json(
        {
          ...project,
          message: project.success
            ? "Projeto encontrado com sucesso"
            : project.error || "Projeto não encontrado",
        },
        project.success ? 200 : 404
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar projeto" }, 500);
    }
  }

  static async createProject(c: Context) {
    try {
      const data = await c.req.json();

      // Log do payload recebido
      console.log(
        "📥 ProjectController.createProject - Payload recebido:",
        data
      );

      const project = await ProjectController.projectService.createProject(
        data
      );

      // Log da resposta do service
      console.log("📤 ProjectController.createProject - Resposta do service:", {
        success: project.success,
        error: project.error,
        message: project.message,
        data: project.data ? "Projeto criado" : "Sem dados",
      });

      return c.json(
        {
          ...project,
          message: project.success
            ? "Projeto criado com sucesso"
            : project.error || "Erro ao criar projeto",
        },
        project.success ? 201 : 400
      );
    } catch (error) {
      console.error(
        "💥 ProjectController.createProject - Erro capturado:",
        error
      );
      return c.json(
        {
          success: false,
          error: "Erro ao criar projeto",
          message:
            error instanceof Error ? error.message : "Erro interno no servidor",
        },
        500
      );
    }
  }

  static async updateProject(c: Context) {
    try {
      const id = c.req.param("id");
      const data = await c.req.json();
      const project = await ProjectController.projectService.updateProject(
        id,
        data
      );
      return c.json(
        {
          ...project,
          message: project.success
            ? "Projeto atualizado com sucesso"
            : project.error || "Projeto não encontrado",
        },
        project.success ? 200 : 404
      );
    } catch (error) {
      return c.json(
        { success: false, error: "Erro ao atualizar projeto" },
        500
      );
    }
  }

  static async deleteProject(c: Context) {
    try {
      const id = c.req.param("id");

      // Log do início da operação
      console.log(
        "🗑️ ProjectController.deleteProject - Iniciando exclusão do projeto:",
        id
      );

      const deleted = await ProjectController.projectService.deleteProject(id);

      // Log da resposta do service
      console.log("📤 ProjectController.deleteProject - Resposta do service:", {
        success: deleted.success,
        error: deleted.error,
        message: deleted.message,
      });

      const response = {
        ...deleted,
        message: deleted.success
          ? "Projeto deletado com sucesso"
          : deleted.error || "Projeto não encontrado",
      };

      const statusCode = deleted.success ? 200 : 404;

      // Log da resposta final
      console.log("📤 ProjectController.deleteProject - Resposta final:", {
        statusCode,
        response,
      });

      return c.json(response, statusCode);
    } catch (error) {
      console.error(
        "💥 ProjectController.deleteProject - Erro capturado:",
        error
      );
      return c.json({ success: false, error: "Erro ao deletar projeto" }, 500);
    }
  }

  // Projetos por tenant
  static async getProjectsByTenant(c: Context) {
    try {
      const tenantId = c.req.param("tenantId");
      const projects =
        await ProjectController.projectService.getProjectsByTenant(tenantId);
      return c.json(
        {
          ...projects,
          message: projects.success
            ? "Projetos do tenant listados com sucesso"
            : projects.error || "Erro ao buscar projetos",
        },
        projects.success ? 200 : 400
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar projetos" }, 500);
    }
  }

  static async getProjectsByOwner(c: Context) {
    try {
      const ownerId = c.req.param("ownerId");
      const projects =
        await ProjectController.projectService.getProjectsByOwner(ownerId);
      return c.json(
        {
          ...projects,
          message: projects.success
            ? "Projetos do proprietário listados com sucesso"
            : projects.error || "Erro ao buscar projetos",
        },
        projects.success ? 200 : 400
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar projetos" }, 500);
    }
  }

  // Teams
  static async getProjectTeams(c: Context) {
    try {
      const projectId = c.req.param("id");
      const teams = await ProjectController.projectService.getProjectTeams(
        projectId
      );
      return c.json(
        {
          ...teams,
          message: teams.success
            ? "Equipes do projeto listadas com sucesso"
            : teams.error || "Erro ao buscar equipes",
        },
        teams.success ? 200 : 400
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar equipes" }, 500);
    }
  }

  static async addTeamToProject(c: Context) {
    try {
      const projectId = c.req.param("id");
      const teamId = c.req.param("teamId");
      const result = await ProjectController.projectService.addTeamToProject(
        projectId,
        teamId
      );
      return c.json(
        {
          ...result,
          message: result.success
            ? "Equipe adicionada ao projeto com sucesso"
            : result.error || "Erro ao adicionar equipe",
        },
        result.success ? 200 : 400
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao adicionar equipe" }, 500);
    }
  }

  static async removeTeamFromProject(c: Context) {
    try {
      const projectId = c.req.param("id");
      const teamId = c.req.param("teamId");
      const removed =
        await ProjectController.projectService.removeTeamFromProject(
          projectId,
          teamId
        );
      return c.json(
        {
          ...removed,
          message: removed.success
            ? "Equipe removida do projeto com sucesso"
            : removed.error || "Equipe não encontrada",
        },
        removed.success ? 200 : 404
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao remover equipe" }, 500);
    }
  }

  // Settings
  static async getProjectSettings(c: Context) {
    try {
      const projectId = c.req.param("id");
      const settings =
        await ProjectController.projectService.getProjectSettings(projectId);
      return c.json({ success: true, data: settings });
    } catch (error) {
      return c.json(
        { success: false, error: "Erro ao buscar configurações" },
        500
      );
    }
  }

  static async createProjectSettings(c: Context) {
    try {
      const projectId = c.req.param("id");
      const data = await c.req.json();
      const settings =
        await ProjectController.projectService.createProjectSettings(
          projectId,
          data
        );
      return c.json({ success: true, data: settings }, 201);
    } catch (error) {
      return c.json(
        { success: false, error: "Erro ao criar configurações" },
        500
      );
    }
  }

  static async updateProjectSettings(c: Context) {
    try {
      const projectId = c.req.param("id");
      const data = await c.req.json();
      const settings =
        await ProjectController.projectService.updateProjectSettings(
          projectId,
          data
        );

      if (!settings) {
        return c.json(
          { success: false, error: "Configurações não encontradas" },
          404
        );
      }

      return c.json({ success: true, data: settings });
    } catch (error) {
      return c.json(
        { success: false, error: "Erro ao atualizar configurações" },
        500
      );
    }
  }

  // Labels
  static async getProjectLabels(c: Context) {
    try {
      const projectId = c.req.param("id");
      const labels = await ProjectController.projectService.getProjectLabels(
        projectId
      );
      return c.json({ success: true, data: labels });
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar etiquetas" }, 500);
    }
  }

  static async createProjectLabel(c: Context) {
    try {
      const projectId = c.req.param("id");
      const data = await c.req.json();
      const label = await ProjectController.projectService.createProjectLabel(
        projectId,
        data
      );
      return c.json({ success: true, data: label }, 201);
    } catch (error) {
      return c.json({ success: false, error: "Erro ao criar etiqueta" }, 500);
    }
  }

  static async updateProjectLabel(c: Context) {
    try {
      const projectId = c.req.param("id");
      const labelId = c.req.param("labelId");
      const data = await c.req.json();
      const label = await ProjectController.projectService.updateProjectLabel(
        projectId,
        labelId,
        data
      );

      if (!label) {
        return c.json(
          { success: false, error: "Etiqueta não encontrada" },
          404
        );
      }

      return c.json({ success: true, data: label });
    } catch (error) {
      return c.json(
        { success: false, error: "Erro ao atualizar etiqueta" },
        500
      );
    }
  }

  static async deleteProjectLabel(c: Context) {
    try {
      const projectId = c.req.param("id");
      const labelId = c.req.param("labelId");
      const success = await ProjectController.projectService.deleteProjectLabel(
        projectId,
        labelId
      );

      if (!success) {
        return c.json(
          { success: false, error: "Etiqueta não encontrada" },
          404
        );
      }

      return c.json({
        success: true,
        message: "Etiqueta deletada com sucesso",
      });
    } catch (error) {
      return c.json({ success: false, error: "Erro ao deletar etiqueta" }, 500);
    }
  }

  // Status Flows
  static async getProjectStatusFlows(c: Context) {
    try {
      const projectId = c.req.param("id");
      const flows =
        await ProjectController.projectService.getProjectStatusFlows(projectId);
      return c.json({ success: true, data: flows });
    } catch (error) {
      return c.json(
        { success: false, error: "Erro ao buscar fluxos de status" },
        500
      );
    }
  }

  static async createStatusFlow(c: Context) {
    try {
      const projectId = c.req.param("id");
      const data = await c.req.json();
      const flow = await ProjectController.projectService.createStatusFlow(
        projectId,
        data
      );
      return c.json({ success: true, data: flow }, 201);
    } catch (error) {
      return c.json(
        { success: false, error: "Erro ao criar fluxo de status" },
        500
      );
    }
  }
}
