import type { Team } from "@shared/types/project";
import type { ApiResponse } from "@shared/types/user";
import { TeamRepository } from "../repositories/TeamRepository";

export class TeamService {
  private teamRepository = new TeamRepository();

  async getAllTeams(): Promise<ApiResponse<Team[]>> {
    try {
      const teams = await this.teamRepository.getAll();
      return {
        success: true,
        data: teams,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro ao buscar equipes",
      };
    }
  }

  async getTeamById(id: string): Promise<ApiResponse<Team>> {
    try {
      const team = await this.teamRepository.getById(id);
      if (!team) {
        return {
          success: false,
          error: "Equipe não encontrada",
        };
      }
      return {
        success: true,
        data: team,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao buscar equipe",
      };
    }
  }

  async createTeam(data: Partial<Team>): Promise<ApiResponse<Team>> {
    try {
      const team = await this.teamRepository.create(data);
      return {
        success: true,
        data: team,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao criar equipe",
      };
    }
  }

  async updateTeam(
    id: string,
    data: Partial<Team>
  ): Promise<ApiResponse<Team>> {
    try {
      const team = await this.teamRepository.update(id, data);
      if (!team) {
        return {
          success: false,
          error: "Equipe não encontrada",
        };
      }
      return {
        success: true,
        data: team,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro ao atualizar equipe",
      };
    }
  }

  async deleteTeam(id: string): Promise<ApiResponse<boolean>> {
    try {
      const deleted = await this.teamRepository.delete(id);
      return {
        success: deleted,
        data: deleted,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro ao deletar equipe",
      };
    }
  }

  async getTeamsByTenant(tenantId: string): Promise<ApiResponse<Team[]>> {
    try {
      const teams = await this.teamRepository.getTeamsByTenant(tenantId);
      return {
        success: true,
        data: teams,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro ao buscar equipes",
      };
    }
  }

  async getTeamMembers(teamId: string): Promise<ApiResponse<any[]>> {
    try {
      const members = await this.teamRepository.getTeamMembers(teamId);
      return {
        success: true,
        data: members,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro ao buscar membros",
      };
    }
  }

  async addMemberToTeam(
    teamId: string,
    userId: string,
    data: any
  ): Promise<ApiResponse<any>> {
    try {
      // Verifica se já existe
      const members = await this.teamRepository.getTeamMembers(teamId);
      if (members.some((m) => m.user.id === userId)) {
        return {
          success: false,
          error: "Usuário já é membro do time",
        };
      }
      const member = await this.teamRepository.addMemberToTeam(
        teamId,
        userId,
        data
      );
      return {
        success: true,
        data: member,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro ao adicionar membro",
      };
    }
  }

  async updateMemberRole(
    teamId: string,
    userId: string,
    data: any
  ): Promise<ApiResponse<any>> {
    try {
      const member = await this.teamRepository.updateMemberRole(
        teamId,
        userId,
        data
      );
      if (!member) {
        return {
          success: false,
          error: "Membro não encontrado",
        };
      }
      return {
        success: true,
        data: member,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro ao atualizar role",
      };
    }
  }

  async removeMemberFromTeam(
    teamId: string,
    userId: string
  ): Promise<ApiResponse<boolean>> {
    try {
      await this.teamRepository.removeMemberFromTeam(teamId, userId);
      return {
        success: true,
        data: true,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro ao remover membro",
      };
    }
  }

  async getTeamProjects(teamId: string): Promise<ApiResponse<any[]>> {
    try {
      const projects = await this.teamRepository.getTeamProjects(teamId);
      return {
        success: true,
        data: projects,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro ao buscar projetos",
      };
    }
  }
}
