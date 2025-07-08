import { Team as TeamModel } from "@shared";
import { db } from "../db/connection";
import {
  teams,
  user_teams,
  team_projects,
  projects,
  users,
} from "../db/schema";
import { eq, and, desc, asc } from "drizzle-orm";
import type { Team, NewTeam } from "../db/schema";

export class TeamRepository {
  async getAll(): Promise<TeamModel[]> {
    const results = await db.select().from(teams).orderBy(asc(teams.name));
    return results as TeamModel[];
  }

  async getById(id: string): Promise<TeamModel | null> {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return (team as TeamModel) || null;
  }

  async create(data: Partial<TeamModel>): Promise<TeamModel> {
    const [team] = await db
      .insert(teams)
      .values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    if (!team) {
      throw new Error("Falha ao criar equipe");
    }

    return team as TeamModel;
  }

  async update(
    id: string,
    data: Partial<TeamModel>
  ): Promise<TeamModel | null> {
    const [team] = await db
      .update(teams)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(teams.id, id))
      .returning();
    return (team as TeamModel) || null;
  }

  async delete(id: string): Promise<boolean> {
    try {
      const [deleted] = await db
        .delete(teams)
        .where(eq(teams.id, id))
        .returning();
      return !!deleted;
    } catch (error) {
      throw error;
    }
  }

  async getTeamsByTenant(tenantId: string): Promise<TeamModel[]> {
    const results = await db
      .select()
      .from(teams)
      .where(eq(teams.tenantId, tenantId))
      .orderBy(asc(teams.name));
    return results as TeamModel[];
  }

  async getTeamMembers(teamId: string): Promise<any[]> {
    return await db
      .select({
        member: user_teams,
        user: users,
      })
      .from(user_teams)
      .innerJoin(users, eq(user_teams.userId, users.id))
      .where(eq(user_teams.teamId, teamId))
      .orderBy(asc(users.name));
  }

  async addMemberToTeam(
    teamId: string,
    userId: string,
    data: any
  ): Promise<any> {
    const [member] = await db
      .insert(user_teams)
      .values({
        teamId,
        userId,
        role: data.role || "member",
        joinedAt: new Date(),
      })
      .returning();

    if (!member) {
      throw new Error("Falha ao adicionar membro à equipe");
    }

    return member;
  }

  async updateMemberRole(
    teamId: string,
    userId: string,
    data: any
  ): Promise<any> {
    const [member] = await db
      .update(user_teams)
      .set({ role: data.role })
      .where(and(eq(user_teams.teamId, teamId), eq(user_teams.userId, userId)))
      .returning();
    return member || null;
  }

  async removeMemberFromTeam(teamId: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(user_teams)
      .where(and(eq(user_teams.teamId, teamId), eq(user_teams.userId, userId)));
    return result.length > 0;
  }

  async getTeamProjects(teamId: string): Promise<any[]> {
    return await db
      .select({
        project: projects,
        teamProject: team_projects,
      })
      .from(team_projects)
      .innerJoin(projects, eq(team_projects.projectId, projects.id))
      .where(eq(team_projects.teamId, teamId))
      .orderBy(asc(projects.name));
  }
}
