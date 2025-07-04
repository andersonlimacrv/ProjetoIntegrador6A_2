import { Project as ProjectModel } from "@shared";
import { db } from "../db/connection";
import {
  projects,
  tenants,
  users,
  teams,
  team_projects,
  user_teams,
  epics,
  user_stories,
  tasks,
  sprints,
  status_flows,
  project_settings,
  project_labels,
} from "../db/schema";
import { eq, and, desc, asc } from "drizzle-orm";
import type {
  NewProject,
  Project,
  Team,
  TeamProject,
  UserTeam,
  Epic,
  UserStory,
  Task,
  Sprint,
  StatusFlow,
  ProjectSetting,
  ProjectLabel,
} from "../db/schema";

export class ProjectRepository {
  // Criar um novo projeto
  async create(data: NewProject): Promise<Project> {
    const [project] = await db.insert(projects).values(data).returning();

    if (!project) {
      throw new Error("Falha ao criar projeto");
    }

    return project;
  }

  // Buscar projeto por ID
  async findById(id: string): Promise<Project | null> {
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id));
    return project || null;
  }

  // Buscar projeto por slug
  async findBySlug(slug: string): Promise<Project | null> {
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.slug, slug));
    return project || null;
  }

  // Listar projetos por tenant
  async findByTenant(tenantId: string): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.tenantId, tenantId))
      .orderBy(desc(projects.createdAt));
  }

  // Listar projetos por proprietário
  async findByOwner(ownerId: string): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.ownerId, ownerId))
      .orderBy(desc(projects.createdAt));
  }

  // Atualizar projeto
  async update(id: string, data: Partial<Project>): Promise<Project | null> {
    const [project] = await db
      .update(projects)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return project || null;
  }

  // Deletar projeto
  async delete(id: string): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id));
    return result.rowCount > 0;
  }

  // Buscar projeto com detalhes completos
  async findByIdWithDetails(id: string) {
    const [project] = await db
      .select({
        project: projects,
        tenant: tenants,
        owner: users,
      })
      .from(projects)
      .innerJoin(tenants, eq(projects.tenantId, tenants.id))
      .innerJoin(users, eq(projects.ownerId, users.id))
      .where(eq(projects.id, id));

    if (!project) return null;

    return project;
  }

  // Criar equipe
  async createTeam(
    teamData: Omit<Team, "id" | "createdAt" | "updatedAt">
  ): Promise<Team> {
    const [team] = await db
      .insert(teams)
      .values({
        ...teamData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return team;
  }

  // Buscar equipes por tenant
  async findTeamsByTenant(tenantId: string): Promise<Team[]> {
    return await db
      .select()
      .from(teams)
      .where(eq(teams.tenantId, tenantId))
      .orderBy(asc(teams.name));
  }

  // Adicionar equipe ao projeto
  async addTeamToProject(
    teamId: string,
    projectId: string
  ): Promise<TeamProject> {
    const [teamProject] = await db
      .insert(team_projects)
      .values({
        teamId,
        projectId,
        assignedAt: new Date(),
      })
      .returning();
    return teamProject;
  }

  // Remover equipe do projeto
  async removeTeamFromProject(
    teamId: string,
    projectId: string
  ): Promise<boolean> {
    const result = await db
      .delete(team_projects)
      .where(
        and(
          eq(team_projects.teamId, teamId),
          eq(team_projects.projectId, projectId)
        )
      );
    return result.rowCount > 0;
  }

  // Buscar equipes do projeto
  async findProjectTeams(projectId: string) {
    return await db
      .select({
        team: teams,
        teamProject: team_projects,
      })
      .from(team_projects)
      .innerJoin(teams, eq(team_projects.teamId, teams.id))
      .where(eq(team_projects.projectId, projectId))
      .orderBy(asc(teams.name));
  }

  // Adicionar usuário à equipe
  async addUserToTeam(
    userId: string,
    teamId: string,
    role: string = "member"
  ): Promise<UserTeam> {
    const [userTeam] = await db
      .insert(user_teams)
      .values({
        userId,
        teamId,
        role,
        joinedAt: new Date(),
      })
      .returning();
    return userTeam;
  }

  // Buscar usuários da equipe
  async findTeamUsers(teamId: string) {
    return await db
      .select({
        user: users,
        userTeam: user_teams,
      })
      .from(user_teams)
      .innerJoin(users, eq(user_teams.userId, users.id))
      .where(eq(user_teams.teamId, teamId))
      .orderBy(asc(users.name));
  }

  // Criar épico
  async createEpic(
    epicData: Omit<Epic, "id" | "createdAt" | "updatedAt">
  ): Promise<Epic> {
    const [epic] = await db
      .insert(epics)
      .values({
        ...epicData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return epic;
  }

  // Buscar épicos do projeto
  async findProjectEpics(projectId: string): Promise<Epic[]> {
    return await db
      .select()
      .from(epics)
      .where(eq(epics.projectId, projectId))
      .orderBy(desc(epics.createdAt));
  }

  // Criar história de usuário
  async createUserStory(
    storyData: Omit<UserStory, "id" | "createdAt" | "updatedAt">
  ): Promise<UserStory> {
    const [story] = await db
      .insert(user_stories)
      .values({
        ...storyData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return story;
  }

  // Buscar histórias do projeto
  async findProjectStories(projectId: string): Promise<UserStory[]> {
    return await db
      .select()
      .from(user_stories)
      .where(eq(user_stories.projectId, projectId))
      .orderBy(desc(user_stories.createdAt));
  }

  // Buscar histórias do épico
  async findEpicStories(epicId: string): Promise<UserStory[]> {
    return await db
      .select()
      .from(user_stories)
      .where(eq(user_stories.epicId, epicId))
      .orderBy(desc(user_stories.createdAt));
  }

  // Criar tarefa
  async createTask(
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ): Promise<Task> {
    const [task] = await db
      .insert(tasks)
      .values({
        ...taskData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return task;
  }

  // Buscar tarefas do projeto
  async findProjectTasks(projectId: string): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.projectId, projectId))
      .orderBy(desc(tasks.createdAt));
  }

  // Buscar tarefas da história
  async findStoryTasks(storyId: string): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.storyId, storyId))
      .orderBy(desc(tasks.createdAt));
  }

  // Criar sprint
  async createSprint(
    sprintData: Omit<Sprint, "id" | "createdAt" | "updatedAt">
  ): Promise<Sprint> {
    const [sprint] = await db
      .insert(sprints)
      .values({
        ...sprintData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return sprint;
  }

  // Buscar sprints do projeto
  async findProjectSprints(projectId: string): Promise<Sprint[]> {
    return await db
      .select()
      .from(sprints)
      .where(eq(sprints.projectId, projectId))
      .orderBy(desc(sprints.createdAt));
  }

  // Criar fluxo de status
  async createStatusFlow(
    flowData: Omit<StatusFlow, "id" | "createdAt">
  ): Promise<StatusFlow> {
    const [flow] = await db
      .insert(status_flows)
      .values({
        ...flowData,
        createdAt: new Date(),
      })
      .returning();
    return flow;
  }

  // Buscar fluxos de status do projeto
  async findProjectStatusFlows(projectId: string): Promise<StatusFlow[]> {
    return await db
      .select()
      .from(status_flows)
      .where(eq(status_flows.projectId, projectId))
      .orderBy(asc(status_flows.name));
  }

  // Criar configurações do projeto
  async createProjectSettings(
    settingsData: Omit<ProjectSetting, "updatedAt">
  ): Promise<ProjectSetting> {
    const [settings] = await db
      .insert(project_settings)
      .values({
        ...settingsData,
        updatedAt: new Date(),
      })
      .returning();
    return settings;
  }

  // Buscar configurações do projeto
  async findProjectSettings(projectId: string): Promise<ProjectSetting | null> {
    const [settings] = await db
      .select()
      .from(project_settings)
      .where(eq(project_settings.projectId, projectId));
    return settings || null;
  }

  // Atualizar configurações do projeto
  async updateProjectSettings(
    projectId: string,
    data: Partial<ProjectSetting>
  ): Promise<ProjectSetting | null> {
    const [settings] = await db
      .update(project_settings)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(project_settings.projectId, projectId))
      .returning();
    return settings || null;
  }

  // Criar etiqueta do projeto
  async createProjectLabel(
    labelData: Omit<ProjectLabel, "id" | "createdAt">
  ): Promise<ProjectLabel> {
    const [label] = await db
      .insert(project_labels)
      .values({
        ...labelData,
        createdAt: new Date(),
      })
      .returning();
    return label;
  }

  // Buscar etiquetas do projeto
  async findProjectLabels(projectId: string): Promise<ProjectLabel[]> {
    return await db
      .select()
      .from(project_labels)
      .where(eq(project_labels.projectId, projectId))
      .orderBy(asc(project_labels.name));
  }
}

// Instância singleton do repositório
export const projectRepository = new ProjectRepository();
