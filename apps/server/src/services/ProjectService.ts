import { ProjectRepository } from "../repositories/ProjectRepository";
import { TenantRepository } from "../repositories/TenantRepository";
import { UserRepository } from "../repositories/UserRepository";
import {
  Project,
  Team,
  UserTeam,
  TeamProject,
  ProjectSetting,
  ProjectLabel,
  CreateProjectDTO,
  UpdateProjectDTO,
  CreateTeamDTO,
  UpdateTeamDTO,
  CreateProjectSettingDTO,
  UpdateProjectSettingDTO,
  CreateProjectLabelDTO,
  UpdateProjectLabelDTO,
  ApiResponse,
  CreateProjectInput,
  UpdateProjectInput,
  ProjectIdInput,
  ProjectSlugInput,
  CreateTeamInput,
  UpdateTeamInput,
  TeamIdInput,
  CreateProjectSettingInput,
  UpdateProjectSettingInput,
  CreateProjectLabelInput,
  UpdateProjectLabelInput,
  ProjectLabelIdInput,
} from "../../../packages/shared/src";
import { randomUUID } from "crypto";

export class ProjectService {
  private projectRepository: ProjectRepository;
  private tenantRepository: TenantRepository;
  private userRepository: UserRepository;

  constructor() {
    this.projectRepository = new ProjectRepository();
    this.tenantRepository = new TenantRepository();
    this.userRepository = new UserRepository();
  }

  /**
   * Lista todos os projetos
   */
  async getAllProjects(): Promise<ApiResponse<any>> {
    try {
      const projects = await this.projectRepository.findAll();
      return {
        success: true,
        data: projects,
      };
    } catch (error) {
      return {
        success: false,
        error: "Erro ao listar projetos",
      };
    }
  }

  /**
   * Cria um novo projeto
   */
  async createProject(data: CreateProjectInput): Promise<ApiResponse<any>> {
    try {
      console.log("🔍 ProjectService.createProject - Iniciando criação:", data);
      
      // Verifica se o tenant existe
      console.log("🔍 Verificando tenant:", data.tenantId);
      const tenant = await this.tenantRepository.findById(data.tenantId);
      if (!tenant) {
        console.error("❌ Tenant não encontrado:", data.tenantId);
        return {
          success: false,
          error: "Tenant não encontrado",
        };
      }
      console.log("✅ Tenant encontrado:", tenant.name);

      // Verifica se o proprietário existe
      console.log("🔍 Verificando proprietário:", data.ownerId);
      const owner = await this.userRepository.findById(data.ownerId);
      if (!owner) {
        console.error("❌ Proprietário não encontrado:", data.ownerId);
        return {
          success: false,
          error: "Proprietário não encontrado",
        };
      }
      console.log("✅ Proprietário encontrado:", owner.name);

      // Verifica se o slug já existe no tenant
      console.log("🔍 Verificando slug único:", data.slug);
      const existingProject = await this.projectRepository.findBySlug(
        data.slug
      );
      if (existingProject) {
        console.error("❌ Slug já existe:", data.slug);
        return {
          success: false,
          error: "Slug já existe",
        };
      }
      console.log("✅ Slug único confirmado");

      console.log("🔧 Criando projeto no banco de dados...");
      const project = await this.projectRepository.create({
        id: randomUUID(),
        tenantId: data.tenantId,
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        projectKey: data.projectKey,
        status: "active",
        ownerId: data.ownerId,
        startDate: data.startDate || null,
        endDate: data.endDate || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log("✅ Projeto criado com sucesso:", {
        id: project.id,
        name: project.name,
        slug: project.slug,
        projectKey: project.projectKey
      });

      return {
        success: true,
        data: project,
        message: "Projeto criado com sucesso",
      };
    } catch (error) {
      console.error("💥 ProjectService.createProject - Erro:", error);
      return {
        success: false,
        error: "Erro ao criar projeto",
      };
    }
  }

  /**
   * Busca um projeto por ID
   */
  async getProjectById(id: string): Promise<ApiResponse<any>> {
    try {
      const project = await this.projectRepository.findById(id);
      if (!project) {
        return {
          success: false,
          error: "Projeto não encontrado",
        };
      }

      return {
        success: true,
        data: project,
      };
    } catch (error) {
      return {
        success: false,
        error: "Erro ao buscar projeto",
      };
    }
  }

  /**
   * Busca um projeto por slug
   */
  async getProjectBySlug(slug: string): Promise<ApiResponse<any>> {
    try {
      const project = await this.projectRepository.findBySlug(slug);
      if (!project) {
        return {
          success: false,
          error: "Projeto não encontrado",
        };
      }

      return {
        success: true,
        data: project,
      };
    } catch (error) {
      return {
        success: false,
        error: "Erro ao buscar projeto",
      };
    }
  }

  /**
   * Lista projetos por tenant
   */
  async getProjectsByTenant(tenantId: string): Promise<ApiResponse<any>> {
    try {
      const tenant = await this.tenantRepository.findById(tenantId);
      if (!tenant) {
        return {
          success: false,
          error: "Tenant não encontrado",
        };
      }

      const projects = await this.projectRepository.findByTenant(tenantId);

      return {
        success: true,
        data: projects,
      };
    } catch (error) {
      return {
        success: false,
        error: "Erro ao listar projetos",
      };
    }
  }

  /**
   * Atualiza um projeto
   */
  async updateProject(
    id: string,
    data: UpdateProjectInput
  ): Promise<ApiResponse<any>> {
    try {
      const project = await this.projectRepository.findById(id);
      if (!project) {
        return {
          success: false,
          error: "Projeto não encontrado",
        };
      }

      // Verifica se o slug já existe (se foi alterado)
      if (data.slug && data.slug !== project.slug) {
        const existingProject = await this.projectRepository.findBySlug(
          data.slug
        );
        if (existingProject) {
          return {
            success: false,
            error: "Slug já existe",
          };
        }
      }

      const updatedProject = await this.projectRepository.update(id, data);
      if (!updatedProject) {
        return {
          success: false,
          error: "Erro ao atualizar projeto",
        };
      }

      return {
        success: true,
        data: updatedProject,
        message: "Projeto atualizado com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        error: "Erro ao atualizar projeto",
      };
    }
  }

  /**
   * Deleta um projeto
   */
  async deleteProject(id: string): Promise<ApiResponse<any>> {
    try {
      console.log("🔍 ProjectService.deleteProject - Iniciando exclusão do projeto:", id);
      
      const project = await this.projectRepository.findById(id);
      if (!project) {
        console.log("❌ ProjectService.deleteProject - Projeto não encontrado:", id);
        return {
          success: false,
          error: "Projeto não encontrado",
        };
      }
      
      console.log("✅ ProjectService.deleteProject - Projeto encontrado:", {
        id: project.id,
        name: project.name,
        slug: project.slug
      });

      const deleted = await this.projectRepository.delete(id);
      console.log("🗑️ ProjectService.deleteProject - Resultado da exclusão:", {
        deleted,
        projectId: id
      });
      
      if (!deleted) {
        console.error("❌ ProjectService.deleteProject - Falha na exclusão do projeto:", id);
        return {
          success: false,
          error: "Erro ao deletar projeto",
        };
      }

      console.log("✅ ProjectService.deleteProject - Projeto deletado com sucesso:", id);
      return {
        success: true,
        message: "Projeto deletado com sucesso",
      };
    } catch (error) {
      console.error("💥 ProjectService.deleteProject - Erro:", error);
      return {
        success: false,
        error: "Erro ao deletar projeto",
      };
    }
  }

  /**
   * Cria uma equipe
   */
  async createTeam(data: CreateTeamInput): Promise<ApiResponse<any>> {
    try {
      const tenant = await this.tenantRepository.findById(data.tenantId);
      if (!tenant) {
        return {
          success: false,
          error: "Tenant não encontrado",
        };
      }

      const team = await this.projectRepository.createTeam({
        tenantId: data.tenantId,
        name: data.name,
        description: data.description || null,
      });

      return {
        success: true,
        data: team,
        message: "Equipe criada com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        error: "Erro ao criar equipe",
      };
    }
  }

  /**
   * Lista equipes por tenant
   */
  async getTeamsByTenant(tenantId: string): Promise<ApiResponse<any>> {
    try {
      const tenant = await this.tenantRepository.findById(tenantId);
      if (!tenant) {
        return {
          success: false,
          error: "Tenant não encontrado",
        };
      }

      const teams = await this.projectRepository.findTeamsByTenant(tenantId);

      return {
        success: true,
        data: teams,
      };
    } catch (error) {
      return {
        success: false,
        error: "Erro ao listar equipes",
      };
    }
  }

  /**
   * Adiciona equipe ao projeto
   */
  async addTeamToProject(
    teamId: string,
    projectId: string
  ): Promise<ApiResponse<any>> {
    try {
      const teamProject = await this.projectRepository.addTeamToProject(
        teamId,
        projectId
      );

      return {
        success: true,
        data: teamProject,
        message: "Equipe adicionada ao projeto com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        error: "Erro ao adicionar equipe ao projeto",
      };
    }
  }

  /**
   * Lista equipes do projeto
   */
  async getProjectTeams(projectId: string): Promise<ApiResponse<any>> {
    try {
      const project = await this.projectRepository.findById(projectId);
      if (!project) {
        return {
          success: false,
          error: "Projeto não encontrado",
        };
      }

      const teams = await this.projectRepository.findProjectTeams(projectId);

      return {
        success: true,
        data: teams,
      };
    } catch (error) {
      return {
        success: false,
        error: "Erro ao listar equipes do projeto",
      };
    }
  }

  /**
   * Adiciona usuário à equipe
   */
  async addUserToTeam(
    userId: string,
    teamId: string,
    role: string = "member"
  ): Promise<ApiResponse<any>> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return {
          success: false,
          error: "Usuário não encontrado",
        };
      }

      const userTeam = await this.projectRepository.addUserToTeam(
        userId,
        teamId,
        role
      );

      return {
        success: true,
        data: userTeam,
        message: "Usuário adicionado à equipe com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        error: "Erro ao adicionar usuário à equipe",
      };
    }
  }

  /**
   * Lista usuários da equipe
   */
  async getTeamUsers(teamId: string): Promise<ApiResponse<any>> {
    try {
      const users = await this.projectRepository.findTeamUsers(teamId);

      return {
        success: true,
        data: users,
      };
    } catch (error) {
      return {
        success: false,
        error: "Erro ao listar usuários da equipe",
      };
    }
  }

  /**
   * Cria um épico
   */
  async createEpic(data: CreateEpicInput): Promise<ApiResponse<any>> {
    try {
      const project = await this.projectRepository.findById(data.projectId);
      if (!project) {
        return {
          success: false,
          error: "Projeto não encontrado",
        };
      }

      const epic = await this.projectRepository.createEpic({
        projectId: data.projectId,
        statusId: data.statusId,
        name: data.name,
        description: data.description,
        priority: data.priority || 3,
        storyPoints: data.storyPoints,
        assigneeId: data.assigneeId,
        startDate: data.startDate,
        dueDate: data.dueDate,
      });

      return {
        success: true,
        data: epic,
        message: "Épico criado com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        error: "Erro ao criar épico",
      };
    }
  }

  /**
   * Lista épicos do projeto
   */
  async getProjectEpics(projectId: string): Promise<ApiResponse<any>> {
    try {
      const project = await this.projectRepository.findById(projectId);
      if (!project) {
        return {
          success: false,
          error: "Projeto não encontrado",
        };
      }

      const epics = await this.projectRepository.findProjectEpics(projectId);

      return {
        success: true,
        data: epics,
      };
    } catch (error) {
      return {
        success: false,
        error: "Erro ao listar épicos",
      };
    }
  }

  /**
   * Cria uma história de usuário
   */
  async createUserStory(data: CreateUserStoryInput): Promise<ApiResponse<any>> {
    try {
      const project = await this.projectRepository.findById(data.projectId);
      if (!project) {
        return {
          success: false,
          error: "Projeto não encontrado",
        };
      }

      const story = await this.projectRepository.createUserStory({
        epicId: data.epicId,
        projectId: data.projectId,
        statusId: data.statusId,
        title: data.title,
        description: data.description,
        acceptanceCriteria: data.acceptanceCriteria,
        storyPoints: data.storyPoints,
        priority: data.priority || 3,
        assigneeId: data.assigneeId,
        dueDate: data.dueDate,
      });

      return {
        success: true,
        data: story,
        message: "História de usuário criada com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        error: "Erro ao criar história de usuário",
      };
    }
  }

  /**
   * Lista histórias do projeto
   */
  async getProjectStories(projectId: string): Promise<ApiResponse<any>> {
    try {
      const project = await this.projectRepository.findById(projectId);
      if (!project) {
        return {
          success: false,
          error: "Projeto não encontrado",
        };
      }

      const stories = await this.projectRepository.findProjectStories(
        projectId
      );

      return {
        success: true,
        data: stories,
      };
    } catch (error) {
      return {
        success: false,
        error: "Erro ao listar histórias",
      };
    }
  }

  /**
   * Lista histórias do épico
   */
  async getEpicStories(epicId: string): Promise<ApiResponse<any>> {
    try {
      const stories = await this.projectRepository.findEpicStories(epicId);

      return {
        success: true,
        data: stories,
      };
    } catch (error) {
      return {
        success: false,
        error: "Erro ao listar histórias do épico",
      };
    }
  }

  /**
   * Cria um sprint
   */
  async createSprint(data: CreateSprintInput): Promise<ApiResponse<any>> {
    try {
      const project = await this.projectRepository.findById(data.projectId);
      if (!project) {
        return {
          success: false,
          error: "Projeto não encontrado",
        };
      }

      const sprint = await this.projectRepository.createSprint({
        projectId: data.projectId,
        name: data.name,
        goal: data.goal,
        startDate: data.startDate,
        endDate: data.endDate,
        status: "planned",
      });

      return {
        success: true,
        data: sprint,
        message: "Sprint criado com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        error: "Erro ao criar sprint",
      };
    }
  }

  /**
   * Lista sprints do projeto
   */
  async getProjectSprints(projectId: string): Promise<ApiResponse<any>> {
    try {
      const project = await this.projectRepository.findById(projectId);
      if (!project) {
        return {
          success: false,
          error: "Projeto não encontrado",
        };
      }

      const sprints = await this.projectRepository.findProjectSprints(
        projectId
      );

      return {
        success: true,
        data: sprints,
      };
    } catch (error) {
      return {
        success: false,
        error: "Erro ao listar sprints",
      };
    }
  }

  /**
   * Atualiza sprint
   */
  async updateSprint(
    id: string,
    data: UpdateSprintInput
  ): Promise<ApiResponse<any>> {
    try {
      const updatedSprint = await this.projectRepository.update(id, data);
      if (!updatedSprint) {
        return {
          success: false,
          error: "Erro ao atualizar sprint",
        };
      }

      return {
        success: true,
        data: updatedSprint,
        message: "Sprint atualizado com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        error: "Erro ao atualizar sprint",
      };
    }
  }

  /**
   * Lista projetos por proprietário
   */
  async getProjectsByOwner(ownerId: string): Promise<ApiResponse<any>> {
    try {
      const user = await this.userRepository.findById(ownerId);
      if (!user) {
        return {
          success: false,
          error: "Usuário não encontrado",
        };
      }

      const projects = await this.projectRepository.findByOwner(ownerId);
      return {
        success: true,
        data: projects,
      };
    } catch (error) {
      return {
        success: false,
        error: "Erro ao listar projetos do proprietário",
      };
    }
  }

  /**
   * Remove equipe do projeto
   */
  async removeTeamFromProject(
    projectId: string,
    teamId: string
  ): Promise<ApiResponse<any>> {
    try {
      const project = await this.projectRepository.findById(projectId);
      if (!project) {
        return {
          success: false,
          error: "Projeto não encontrado",
        };
      }

      const success = await this.projectRepository.removeTeamFromProject(
        projectId,
        teamId
      );
      if (!success) {
        return {
          success: false,
          error: "Equipe não encontrada no projeto",
        };
      }

      return {
        success: true,
        message: "Equipe removida do projeto com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        error: "Erro ao remover equipe do projeto",
      };
    }
  }

  /**
   * Busca configurações do projeto
   */
  async getProjectSettings(projectId: string): Promise<ApiResponse<any>> {
    try {
      const project = await this.projectRepository.findById(projectId);
      if (!project) {
        return {
          success: false,
          error: "Projeto não encontrado",
        };
      }

      const settings = await this.projectRepository.getProjectSettings(
        projectId
      );
      return {
        success: true,
        data: settings,
      };
    } catch (error) {
      return {
        success: false,
        error: "Erro ao buscar configurações do projeto",
      };
    }
  }

  /**
   * Cria configurações do projeto
   */
  async createProjectSettings(
    projectId: string,
    data: any
  ): Promise<ApiResponse<any>> {
    try {
      const project = await this.projectRepository.findById(projectId);
      if (!project) {
        return {
          success: false,
          error: "Projeto não encontrado",
        };
      }

      const settings = await this.projectRepository.createProjectSettings(
        projectId,
        data
      );
      return {
        success: true,
        data: settings,
        message: "Configurações criadas com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        error: "Erro ao criar configurações do projeto",
      };
    }
  }

  /**
   * Atualiza configurações do projeto
   */
  async updateProjectSettings(
    projectId: string,
    data: any
  ): Promise<ApiResponse<any>> {
    try {
      const project = await this.projectRepository.findById(projectId);
      if (!project) {
        return {
          success: false,
          error: "Projeto não encontrado",
        };
      }

      const settings = await this.projectRepository.updateProjectSettings(
        projectId,
        data
      );
      if (!settings) {
        return {
          success: false,
          error: "Configurações não encontradas",
        };
      }

      return {
        success: true,
        data: settings,
        message: "Configurações atualizadas com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        error: "Erro ao atualizar configurações do projeto",
      };
    }
  }

  /**
   * Busca etiquetas do projeto
   */
  async getProjectLabels(projectId: string): Promise<ApiResponse<any>> {
    try {
      const project = await this.projectRepository.findById(projectId);
      if (!project) {
        return {
          success: false,
          error: "Projeto não encontrado",
        };
      }

      const labels = await this.projectRepository.getProjectLabels(projectId);
      return {
        success: true,
        data: labels,
      };
    } catch (error) {
      return {
        success: false,
        error: "Erro ao buscar etiquetas do projeto",
      };
    }
  }
}

// Instância singleton do service
export const projectService = new ProjectService();
