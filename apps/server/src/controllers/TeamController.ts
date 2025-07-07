import { Context } from "hono";
import { TeamService } from "../services/TeamService";
import { ApiResponse } from "@shared";

export class TeamController {
  private static teamService = new TeamService();

  // CRUD básico
  static async getAllTeams(c: Context) {
    try {
      const teams = await TeamController.teamService.getAllTeams();
      return c.json(
        {
          ...teams,
          message: teams.success
            ? "Equipes listadas com sucesso"
            : teams.error || "Erro ao buscar equipes",
        },
        teams.success ? 200 : 400
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar equipes" }, 500);
    }
  }

  static async getTeamById(c: Context) {
    try {
      const id = c.req.param("id");
      const team = await TeamController.teamService.getTeamById(id);
      return c.json(
        {
          ...team,
          message: team.success
            ? "Equipe encontrada com sucesso"
            : team.error || "Equipe não encontrada",
        },
        team.success ? 200 : 404
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar equipe" }, 500);
    }
  }

  static async createTeam(c: Context) {
    try {
      const data = await c.req.json();
      const team = await TeamController.teamService.createTeam(data);
      return c.json(
        {
          ...team,
          message: team.success
            ? "Equipe criada com sucesso"
            : team.error || "Erro ao criar equipe",
        },
        team.success ? 201 : 400
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao criar equipe" }, 500);
    }
  }

  static async updateTeam(c: Context) {
    try {
      const id = c.req.param("id");
      const data = await c.req.json();
      const team = await TeamController.teamService.updateTeam(id, data);
      return c.json(
        {
          ...team,
          message: team.success
            ? "Equipe atualizada com sucesso"
            : team.error || "Equipe não encontrada",
        },
        team.success ? 200 : 404
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao atualizar equipe" }, 500);
    }
  }

  static async deleteTeam(c: Context) {
    try {
      const id = c.req.param("id");
      const deleted = await TeamController.teamService.deleteTeam(id);
      return c.json(
        {
          ...deleted,
          message: deleted.success
            ? "Equipe deletada com sucesso"
            : deleted.error || "Equipe não encontrada",
        },
        deleted.success ? 200 : 404
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao deletar equipe" }, 500);
    }
  }

  // Equipes por tenant
  static async getTeamsByTenant(c: Context) {
    try {
      const tenantId = c.req.param("tenantId");
      const teams = await TeamController.teamService.getTeamsByTenant(tenantId);
      return c.json(
        {
          ...teams,
          message: teams.success
            ? "Equipes do tenant listadas com sucesso"
            : teams.error || "Erro ao buscar equipes",
        },
        teams.success ? 200 : 400
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar equipes" }, 500);
    }
  }

  // Membros
  static async getTeamMembers(c: Context) {
    try {
      const teamId = c.req.param("id");
      const members = await TeamController.teamService.getTeamMembers(teamId);
      return c.json(
        {
          ...members,
          message: members.success
            ? "Membros da equipe listados com sucesso"
            : members.error || "Erro ao buscar membros",
        },
        members.success ? 200 : 400
      );
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
      return c.json(
        {
          ...result,
          message: result.success
            ? "Membro adicionado com sucesso"
            : result.error || "Erro ao adicionar membro",
        },
        result.success ? 200 : 400
      );
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
      return c.json(
        {
          ...result,
          message: result.success
            ? "Role do membro atualizada com sucesso"
            : result.error || "Membro não encontrado",
        },
        result.success ? 200 : 404
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao atualizar role" }, 500);
    }
  }

  static async removeMemberFromTeam(c: Context) {
    try {
      const teamId = c.req.param("id");
      const userId = c.req.param("userId");
      const removed = await TeamController.teamService.removeMemberFromTeam(
        teamId,
        userId
      );
      return c.json(
        {
          ...removed,
          message: removed.success
            ? "Membro removido com sucesso"
            : removed.error || "Membro não encontrado",
        },
        removed.success ? 200 : 404
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao remover membro" }, 500);
    }
  }

  // Projetos
  static async getTeamProjects(c: Context) {
    try {
      const teamId = c.req.param("id");
      const projects = await TeamController.teamService.getTeamProjects(teamId);
      return c.json(
        {
          ...projects,
          message: projects.success
            ? "Projetos da equipe listados com sucesso"
            : projects.error || "Erro ao buscar projetos",
        },
        projects.success ? 200 : 400
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar projetos" }, 500);
    }
  }
}
