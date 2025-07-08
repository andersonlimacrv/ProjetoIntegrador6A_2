import { Sprint as SprintModel } from "@shared";
import { db } from "../db/connection";
import {
  sprints,
  projects,
  sprint_backlog_items,
  user_stories,
  sprint_metrics,
} from "../db/schema";
import { eq, and, desc, asc } from "drizzle-orm";

export class SprintRepository {
  async getAll(): Promise<SprintModel[]> {
    const results = await db
      .select()
      .from(sprints)
      .orderBy(desc(sprints.createdAt));
    return results as SprintModel[];
  }

  async getById(id: string): Promise<SprintModel | null> {
    const [sprint] = await db.select().from(sprints).where(eq(sprints.id, id));
    return (sprint as SprintModel) || null;
  }

  async create(data: Partial<SprintModel>): Promise<SprintModel> {
    const [sprint] = await db
      .insert(sprints)
      .values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    if (!sprint) {
      throw new Error("Falha ao criar sprint");
    }

    return sprint as SprintModel;
  }

  async update(
    id: string,
    data: Partial<SprintModel>
  ): Promise<SprintModel | null> {
    const [sprint] = await db
      .update(sprints)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(sprints.id, id))
      .returning();
    return (sprint as SprintModel) || null;
  }

  async delete(id: string): Promise<boolean> {
    try {
      const [deleted] = await db
        .delete(sprints)
        .where(eq(sprints.id, id))
        .returning();
      return !!deleted;
    } catch (error) {
      throw error;
    }
  }

  async getSprintsByProject(projectId: string): Promise<SprintModel[]> {
    const results = await db
      .select()
      .from(sprints)
      .where(eq(sprints.projectId, projectId))
      .orderBy(desc(sprints.createdAt));
    return results as SprintModel[];
  }

  async getSprintBacklog(sprintId: string): Promise<any[]> {
    return await db
      .select({
        story: user_stories,
        sprintStory: sprint_backlog_items,
      })
      .from(sprint_backlog_items)
      .innerJoin(
        user_stories,
        eq(sprint_backlog_items.storyId, user_stories.id)
      )
      .where(eq(sprint_backlog_items.sprintId, sprintId))
      .orderBy(asc(user_stories.priority));
  }

  async addStoryToBacklog(sprintId: string, data: any): Promise<any> {
    const [sprintStory] = await db
      .insert(sprint_backlog_items)
      .values({
        sprintId,
        storyId: data.userStoryId,
        order: data.order || 0,
        addedAt: new Date(),
      })
      .returning();

    if (!sprintStory) {
      throw new Error("Falha ao adicionar história ao backlog");
    }

    return sprintStory;
  }

  async removeStoryFromBacklog(
    sprintId: string,
    storyId: string
  ): Promise<boolean> {
    const [deleted] = await db
      .delete(sprint_backlog_items)
      .where(
        and(
          eq(sprint_backlog_items.sprintId, sprintId),
          eq(sprint_backlog_items.storyId, storyId)
        )
      )
      .returning();
    return !!deleted;
  }

  async getSprintMetrics(sprintId: string): Promise<any> {
    const [metrics] = await db
      .select()
      .from(sprint_metrics)
      .where(eq(sprint_metrics.sprintId, sprintId));
    return metrics || null;
  }

  async createSprintMetrics(sprintId: string, data: any): Promise<any> {
    const [metrics] = await db
      .insert(sprint_metrics)
      .values({
        sprintId,
        ...data,
        calculatedAt: new Date(),
      })
      .returning();

    if (!metrics) {
      throw new Error("Falha ao criar métricas do sprint");
    }

    return metrics;
  }
}
