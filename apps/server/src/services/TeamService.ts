import { Team, ApiResponse } from "../../../packages/shared/src";
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
        error: error instanceof Error ? error.message : "Erro ao buscar equipes",
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

  async updateTeam(id: string, data: Partial<Team>): Promise<ApiResponse<Team>> {
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
        error: error instanceof Error ? error.message : "Erro ao atualizar equipe",
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
        error: error instanceof Error ? error.message : "Erro ao deletar equipe",
      };
    }
  }

  async getTeamsByTenant(tenantId: string): Promise<ApiResponse<Team[]>> {
    try {
      // TODO: Implementar busca por tenant
      return {
        success: true,
        data: [],
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao buscar equipes",
      };
    }
  }

  async getTeamMembers(teamId: string): Promise<ApiResponse<any[]>> {
    try {
      // TODO: Implementar busca de membros
      return {
        success: true,
        data: [],
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao buscar membros",
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
      const member = await this.teamRepository.addMemberToTeam(teamId, userId, data);
      return {
        success: true,
        data: member,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao adicionar membro",
      };
    }
  }

  async updateMemberRole(
    teamId: string,
    userId: string,
    data: any
  ): Promise<ApiResponse<any>> {
    try {
      // TODO: Implementar atualização de role
      return {
        success: true,
        data: {},
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao atualizar role",
      };
    }
  }

  async removeMemberFromTeam(teamId: string, userId: string): Promise<ApiResponse<boolean>> {
    try {
      // TODO: Implementar remoção de membro
      return {
        success: true,
        data: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao remover membro",
      };
    }
  }

  async getTeamProjects(teamId: string): Promise<ApiResponse<any[]>> {
    try {
      // TODO: Implementar busca de projetos
      return {
        success: true,
        data: [],
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao buscar projetos",
      };
    }
  }
}
