import { db } from "../db/connection";
import { tasks, users } from "../db/schema";
import { eq, and, desc } from "drizzle-orm";
import { Task, CreateTaskDTO, UpdateTaskDTO } from "@packages/shared";

export class TaskRepository {
  /**
   * Busca todas as tasks
   */
  async findAll(): Promise<Task[]> {
    return await db.select().from(tasks).orderBy(desc(tasks.createdAt));
  }

  /**
   * Busca todas as tasks de um usuário
   */
  async findByUserId(userId: number): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId))
      .orderBy(desc(tasks.createdAt));
  }

  /**
   * Busca uma task por ID
   */
  async findById(id: number): Promise<Task | null> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task || null;
  }

  /**
   * Busca uma task por ID com dados do usuário
   */
  async findByIdWithUser(id: number): Promise<(Task & { user: any }) | null> {
    const [task] = await db
      .select({
        id: tasks.id,
        title: tasks.title,
        description: tasks.description,
        completed: tasks.completed,
        userId: tasks.userId,
        createdAt: tasks.createdAt,
        updatedAt: tasks.updatedAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(tasks)
      .leftJoin(users, eq(tasks.userId, users.id))
      .where(eq(tasks.id, id));

    return task || null;
  }

  /**
   * Cria uma nova task
   */
  async create(data: CreateTaskDTO): Promise<Task> {
    const [newTask] = await db
      .insert(tasks)
      .values({
        title: data.title,
        description: data.description,
        userId: data.userId,
      })
      .returning();

    if (!newTask) {
      throw new Error("Falha ao criar task");
    }

    return newTask;
  }

  /**
   * Atualiza uma task existente
   */
  async update(id: number, data: UpdateTaskDTO): Promise<Task | null> {
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (data.title !== undefined) {
      updateData.title = data.title;
    }

    if (data.description !== undefined) {
      updateData.description = data.description;
    }

    if (data.completed !== undefined) {
      updateData.completed = data.completed;
    }

    const [updatedTask] = await db
      .update(tasks)
      .set(updateData)
      .where(eq(tasks.id, id))
      .returning();

    return updatedTask || null;
  }

  /**
   * Deleta uma task
   */
  async delete(id: number): Promise<boolean> {
    const [deletedTask] = await db
      .delete(tasks)
      .where(eq(tasks.id, id))
      .returning();

    return !!deletedTask;
  }

  /**
   * Marca uma task como completa
   */
  async markAsCompleted(id: number): Promise<Task | null> {
    const [updatedTask] = await db
      .update(tasks)
      .set({
        completed: true,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, id))
      .returning();

    return updatedTask || null;
  }

  /**
   * Marca uma task como incompleta
   */
  async markAsIncomplete(id: number): Promise<Task | null> {
    const [updatedTask] = await db
      .update(tasks)
      .set({
        completed: false,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, id))
      .returning();

    return updatedTask || null;
  }

  /**
   * Busca tasks completadas
   */
  async findCompleted(): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.completed, true))
      .orderBy(desc(tasks.updatedAt));
  }

  /**
   * Busca tasks pendentes
   */
  async findPending(): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.completed, false))
      .orderBy(desc(tasks.createdAt));
  }

  /**
   * Verifica se uma task pertence a um usuário
   */
  async belongsToUser(taskId: number, userId: number): Promise<boolean> {
    const [task] = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));

    return !!task;
  }
}

// Instância singleton do repositório
export const taskRepository = new TaskRepository();
