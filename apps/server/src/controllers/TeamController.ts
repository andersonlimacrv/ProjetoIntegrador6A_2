import { Context } from "hono";
import { TeamService } from "../services/TeamService";
import { ApiResponse } from "@shared";

export class TeamController {
  private static teamService = new TeamService();

  // CRUD básico
  static async getAllTeams(c: Context) {
    try {
      const teams = await TeamController.teamService.getAllTeams();
      return c.json({ success: true, data: teams });
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar equipes" }, 500);
    }
  }

  static async getTeamById(c: Context) {
    try {
      const id = c.req.param("id");
      const team = await TeamController.teamService.getTeamById(id);

      if (!team) {
        return c.json({ success: false, error: "Equipe não encontrada" }, 404);
      }

      return c.json({ success: true, data: team });
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar equipe" }, 500);
    }
  }

  static async createTeam(c: Context) {
    try {
      const data = await c.req.json();
      const team = await TeamController.teamService.createTeam(data);
      return c.json({ success: true, data: team }, 201);
    } catch (error) {
      return c.json({ success: false, error: "Erro ao criar equipe" }, 500);
    }
  }

  static async updateTeam(c: Context) {
    try {
      const id = c.req.param("id");
      const data = await c.req.json();
      const team = await TeamController.teamService.updateTeam(id, data);

      if (!team) {
        return c.json({ success: false, error: "Equipe não encontrada" }, 404);
      }

      return c.json({ success: true, data: team });
    } catch (error) {
      return c.json({ success: false, error: "Erro ao atualizar equipe" }, 500);
    }
  }

  static async deleteTeam(c: Context) {
    try {
      const id = c.req.param("id");
      const success = await TeamController.teamService.deleteTeam(id);

      if (!success) {
        return c.json({ success: false, error: "Equipe não encontrada" }, 404);
      }

      return c.json({ success: true, message: "Equipe deletada com sucesso" });
    } catch (error) {
      return c.json({ success: false, error: "Erro ao deletar equipe" }, 500);
    }
  }

  // Equipes por tenant
  static async getTeamsByTenant(c: Context) {
    try {
      const tenantId = c.req.param("tenantId");
      const teams = await TeamController.teamService.getTeamsByTenant(tenantId);
      return c.json({ success: true, data: teams });
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar equipes" }, 500);
    }
  }

  // Membros
  static async getTeamMembers(c: Context) {
    try {
      const teamId = c.req.param("id");
      const members = await TeamController.teamService.getTeamMembers(teamId);
      return c.json({ success: true, data: members });
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar membros" }, 500);
    }
  }

  static async addMemberToTeam(c: Context) {
    try {
      const teamId = c.req.param("id");
      const userId = c.req.param("userId");
      const data = await c.req.json();
      const result = await TeamController.teamService.addMemberToTeam(
        teamId,
        userId,
        data
      );
      return c.json({ success: true, data: result });
    } catch (error) {
      return c.json({ success: false, error: "Erro ao adicionar membro" }, 500);
    }
  }

  static async updateMemberRole(c: Context) {
    try {
      const teamId = c.req.param("id");
      const userId = c.req.param("userId");
      const data = await c.req.json();
      const result = await TeamController.teamService.updateMemberRole(
        teamId,
        userId,
        data
      );

      if (!result) {
        return c.json({ success: false, error: "Membro não encontrado" }, 404);
      }

      return c.json({ success: true, data: result });
    } catch (error) {
      return c.json({ success: false, error: "Erro ao atualizar role" }, 500);
    }
  }

  static async removeMemberFromTeam(c: Context) {
    try {
      const teamId = c.req.param("id");
      const userId = c.req.param("userId");
      const success = await TeamController.teamService.removeMemberFromTeam(
        teamId,
        userId
      );

      if (!success) {
        return c.json({ success: false, error: "Membro não encontrado" }, 404);
      }

      return c.json({ success: true, message: "Membro removido com sucesso" });
    } catch (error) {
      return c.json({ success: false, error: "Erro ao remover membro" }, 500);
    }
  }

  // Projetos
  static async getTeamProjects(c: Context) {
    try {
      const teamId = c.req.param("id");
      const projects = await TeamController.teamService.getTeamProjects(teamId);
      return c.json({ success: true, data: projects });
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar projetos" }, 500);
    }
  }
}
