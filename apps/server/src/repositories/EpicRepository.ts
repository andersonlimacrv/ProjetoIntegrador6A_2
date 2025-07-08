import { Epic as EpicModel } from "@shared";
import { db } from "../db/connection";
import { epics, projects, user_stories } from "../db/schema";
import { eq, and, desc, asc } from "drizzle-orm";
import type { Epic, NewEpic } from "../db/schema";

export class EpicRepository {
  async getAll(): Promise<EpicModel[]> {
    const results = await db
      .select()
      .from(epics)
      .orderBy(desc(epics.createdAt));
    return results as EpicModel[];
  }

  async getById(id: string): Promise<EpicModel | null> {
    const [epic] = await db.select().from(epics).where(eq(epics.id, id));
    return (epic as EpicModel) || null;
  }

  async create(data: Partial<EpicModel>): Promise<EpicModel> {
    const [epic] = await db
      .insert(epics)
      .values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    if (!epic) {
      throw new Error("Falha ao criar épico");
    }

    return epic as EpicModel;
  }

  async update(
    id: string,
    data: Partial<EpicModel>
  ): Promise<EpicModel | null> {
    const [epic] = await db
      .update(epics)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(epics.id, id))
      .returning();
    return (epic as EpicModel) || null;
  }

  async delete(id: string): Promise<boolean> {
    try {
      const [deleted] = await db
        .delete(epics)
        .where(eq(epics.id, id))
        .returning();
      return !!deleted;
    } catch (error) {
      throw error;
    }
  }

  async getEpicsByProject(projectId: string): Promise<EpicModel[]> {
    const results = await db
      .select()
      .from(epics)
      .where(eq(epics.projectId, projectId))
      .orderBy(desc(epics.createdAt));
    return results as EpicModel[];
  }

  async getEpicStories(epicId: string): Promise<any[]> {
    return await db
      .select()
      .from(user_stories)
      .where(eq(user_stories.epicId, epicId))
      .orderBy(desc(user_stories.createdAt));
  }
}
