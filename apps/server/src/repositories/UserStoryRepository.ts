import { UserStory as UserStoryModel } from "@shared";
import { db } from "../db/connection";
import {
  user_stories,
  epics,
  projects,
  tasks,
  sprints,
  sprint_backlog_items,
} from "../db/schema";
import { eq, and, desc, asc } from "drizzle-orm";
import type { UserStory as DbUserStory, NewUserStory } from "../db/schema";

export class UserStoryRepository {
  async getAll(): Promise<UserStoryModel[]> {
    const results = await db
      .select()
      .from(user_stories)
      .orderBy(desc(user_stories.createdAt));
    return results as UserStoryModel[];
  }

  async getById(id: string): Promise<UserStoryModel | null> {
    const [story] = await db
      .select()
      .from(user_stories)
      .where(eq(user_stories.id, id));
    return (story as UserStoryModel) || null;
  }

  async create(data: Partial<UserStoryModel>): Promise<UserStoryModel> {
    const [story] = await db
      .insert(user_stories)
      .values({
        projectId: data.projectId!,
        statusId: data.statusId!,
        title: data.title!,
        description: data.description,
        acceptanceCriteria: data.acceptanceCriteria,
        storyPoints: data.storyPoints,
        priority: data.priority || 3,
        assigneeId: data.assigneeId,
        dueDate: data.dueDate,
        epicId: data.epicId,
      })
      .returning();

    if (!story) {
      throw new Error("Falha ao criar história de usuário");
    }

    return story as UserStoryModel;
  }

  async update(
    id: string,
    data: Partial<UserStoryModel>
  ): Promise<UserStoryModel | null> {
    const [story] = await db
      .update(user_stories)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(user_stories.id, id))
      .returning();
    return (story as UserStoryModel) || null;
  }

  async delete(id: string): Promise<boolean> {
    try {
      const [deleted] = await db
        .delete(user_stories)
        .where(eq(user_stories.id, id))
        .returning();
      return !!deleted;
    } catch (error) {
      throw error;
    }
  }

  async getUserStoriesByProject(projectId: string): Promise<UserStoryModel[]> {
    const results = await db
      .select()
      .from(user_stories)
      .where(eq(user_stories.projectId, projectId))
      .orderBy(desc(user_stories.createdAt));
    return results as UserStoryModel[];
  }

  async getUserStoriesByEpic(epicId: string): Promise<UserStoryModel[]> {
    const results = await db
      .select()
      .from(user_stories)
      .where(eq(user_stories.epicId, epicId))
      .orderBy(desc(user_stories.createdAt));
    return results as UserStoryModel[];
  }

  async getUserStoryTasks(storyId: string): Promise<any[]> {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.storyId, storyId))
      .orderBy(desc(tasks.createdAt));
  }

  async addToSprint(storyId: string, sprintId: string): Promise<any> {
    const [sprintStory] = await db
      .insert(sprint_backlog_items)
      .values({
        sprintId,
        storyId,
        order: 0, // Será atualizado pelo service
        addedAt: new Date(),
      })
      .returning();

    if (!sprintStory) {
      throw new Error("Falha ao adicionar história ao sprint");
    }

    return sprintStory;
  }

  async removeFromSprint(storyId: string): Promise<boolean> {
    const result = await db
      .delete(sprint_backlog_items)
      .where(eq(sprint_backlog_items.storyId, storyId));
    return result.length > 0;
  }
}
