import { Activity as ActivityModel } from "@shared";
import { db } from "../db/connection";
import { activities, users, projects, tasks } from "../db/schema";
import { eq, and, desc, asc } from "drizzle-orm";

export class ActivityRepository {
  async getAll(): Promise<ActivityModel[]> {
    const results = await db
      .select()
      .from(activities)
      .orderBy(desc(activities.createdAt));
    return results as ActivityModel[];
  }

  async getById(id: string): Promise<ActivityModel | null> {
    const [activity] = await db
      .select()
      .from(activities)
      .where(eq(activities.id, id));
    return (activity as ActivityModel) || null;
  }

  async create(data: Partial<ActivityModel>): Promise<ActivityModel> {
    const [activity] = await db
      .insert(activities)
      .values({
        ...data,
        createdAt: new Date(),
      })
      .returning();

    if (!activity) {
      throw new Error("Falha ao criar atividade");
    }

    return activity as ActivityModel;
  }

  async update(
    id: string,
    data: Partial<ActivityModel>
  ): Promise<ActivityModel | null> {
    const [activity] = await db
      .update(activities)
      .set(data)
      .where(eq(activities.id, id))
      .returning();
    return (activity as ActivityModel) || null;
  }

  async delete(id: string): Promise<boolean> {
    try {
      const [deleted] = await db
        .delete(activities)
        .where(eq(activities.id, id))
        .returning();
      return !!deleted;
    } catch (error) {
      throw error;
    }
  }

  async getActivitiesByUser(userId: string): Promise<ActivityModel[]> {
    const results = await db
      .select()
      .from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(desc(activities.createdAt));
    return results as ActivityModel[];
  }

  async getActivitiesByProject(projectId: string): Promise<ActivityModel[]> {
    const results = await db
      .select()
      .from(activities)
      .where(eq(activities.projectId, projectId))
      .orderBy(desc(activities.createdAt));
    return results as ActivityModel[];
  }

  async getActivitiesByTask(taskId: string): Promise<ActivityModel[]> {
    const results = await db
      .select()
      .from(activities)
      .where(eq(activities.taskId, taskId))
      .orderBy(desc(activities.createdAt));
    return results as ActivityModel[];
  }

  async getActivitiesByType(type: string): Promise<ActivityModel[]> {
    const results = await db
      .select()
      .from(activities)
      .where(eq(activities.type, type))
      .orderBy(desc(activities.createdAt));
    return results as ActivityModel[];
  }

  async getUserFeed(userId: string): Promise<ActivityModel[]> {
    // Busca atividades do usuário e de projetos que ele participa
    const results = await db
      .select()
      .from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(desc(activities.createdAt))
      .limit(50);
    return results as ActivityModel[];
  }
}
