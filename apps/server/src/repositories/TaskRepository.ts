import { Task as TaskModel, CreateTaskDTO, UpdateTaskDTO } from "@shared";
import { db } from "../db/connection";
import {
  tasks,
  users,
  projects,
  user_stories,
  epics,
  statuses,
  task_assignments,
  task_labels,
  project_labels,
  task_attachments,
  task_dependencies,
  comments,
  sprints,
  sprint_backlog_items,
} from "../db/schema";
import { eq, and, desc, asc, inArray } from "drizzle-orm";
import type {
  Task as DbTask,
  NewTask,
  User,
  Project,
  UserStory,
  Epic,
  Status,
  TaskAssignment,
  TaskLabel,
  TaskAttachment,
  TaskDependency,
  Comment,
  Sprint,
} from "../db/schema";

export class TaskRepository {
  /**
   * Busca todas as tasks
   */
  async findAll(): Promise<DbTask[]> {
    return await db.select().from(tasks).orderBy(desc(tasks.createdAt));
  }

  /**
   * Busca todas as tasks de um projeto
   */
  async findByProjectId(projectId: string): Promise<DbTask[]> {
    const result = await db
      .select()
      .from(tasks)
      .where(eq(tasks.projectId, projectId))
      .orderBy(desc(tasks.createdAt));
    return Array.isArray(result) ? result : [];
  }

  /**
   * Busca todas as tasks de uma história de usuário
   */
  async findByStoryId(storyId: string): Promise<DbTask[]> {
    const result = await db
      .select()
      .from(tasks)
      .where(eq(tasks.storyId, storyId))
      .orderBy(desc(tasks.createdAt));
    return Array.isArray(result) ? result : [];
  }

  /**
   * Busca todas as tasks de um usuário
   */
  async findByAssigneeId(assigneeId: string): Promise<DbTask[]> {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.assigneeId, assigneeId))
      .orderBy(desc(tasks.createdAt));
  }

  /**
   * Busca todas as tasks de um reporter
   */
  async findByReporterId(reporterId: string): Promise<DbTask[]> {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.reporterId, reporterId))
      .orderBy(desc(tasks.createdAt));
  }

  /**
   * Busca uma task por ID
   */
  async findById(id: string): Promise<DbTask | null> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task || null;
  }

  /**
   * Busca uma task por ID com dados relacionados
   */
  async findByIdWithDetails(id: string) {
    const [task] = await db
      .select({
        task: tasks,
        project: projects,
        story: user_stories,
        epic: epics,
        status: statuses,
        assignee: users,
        reporter: users,
      })
      .from(tasks)
      .leftJoin(projects, eq(tasks.projectId, projects.id))
      .leftJoin(user_stories, eq(tasks.storyId, user_stories.id))
      .leftJoin(epics, eq(user_stories.epicId, epics.id))
      .leftJoin(statuses, eq(tasks.statusId, statuses.id))
      .leftJoin(users, eq(tasks.assigneeId, users.id))
      .leftJoin(users, eq(tasks.reporterId, users.id))
      .where(eq(tasks.id, id));

    return task || null;
  }

  /**
   * Cria uma nova task
   */
  async create(data: CreateTaskDTO): Promise<DbTask> {
    const [newTask] = await db
      .insert(tasks)
      .values({
        storyId: data.storyId,
        projectId: data.projectId,
        statusId: data.statusId,
        title: data.title,
        description: data.description,
        priority: data.priority || 3,
        estimatedHours: data.estimatedHours,
        assigneeId: data.assigneeId,
        reporterId: data.reporterId,
        dueDate: data.dueDate,
        createdAt: new Date(),
        updatedAt: new Date(),
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
  async update(id: string, data: UpdateTaskDTO): Promise<DbTask | null> {
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (data.storyId !== undefined) {
      updateData.storyId = data.storyId;
    }

    if (data.statusId !== undefined) {
      updateData.statusId = data.statusId;
    }

    if (data.title !== undefined) {
      updateData.title = data.title;
    }

    if (data.description !== undefined) {
      updateData.description = data.description;
    }

    if (data.priority !== undefined) {
      updateData.priority = data.priority;
    }

    if (data.estimatedHours !== undefined) {
      updateData.estimatedHours = data.estimatedHours;
    }

    if (data.actualHours !== undefined) {
      updateData.actualHours = data.actualHours;
    }

    if (data.assigneeId !== undefined) {
      updateData.assigneeId = data.assigneeId;
    }

    if (data.dueDate !== undefined) {
      updateData.dueDate = data.dueDate;
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
  async delete(id: string): Promise<boolean> {
    try {
      const [deleted] = await db
        .delete(tasks)
        .where(eq(tasks.id, id))
        .returning();
      return !!deleted;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Atribui uma task a um usuário
   */
  async assignTask(taskId: string, userId: string): Promise<TaskAssignment> {
    const [assignment] = await db
      .insert(task_assignments)
      .values({
        taskId,
        userId,
        assignedAt: new Date(),
      })
      .returning();
    return assignment;
  }

  /**
   * Remove atribuição de uma task
   */
  async unassignTask(taskId: string, userId: string): Promise<boolean> {
    const result = await db
      .update(task_assignments)
      .set({ unassignedAt: new Date() })
      .where(
        and(
          eq(task_assignments.taskId, taskId),
          eq(task_assignments.userId, userId)
        )
      );
    return result.rowCount > 0;
  }

  /**
   * Busca atribuições de uma task
   */
  async findTaskAssignments(taskId: string) {
    return await db
      .select({
        assignment: task_assignments,
        user: users,
      })
      .from(task_assignments)
      .innerJoin(users, eq(task_assignments.userId, users.id))
      .where(eq(task_assignments.taskId, taskId))
      .orderBy(desc(task_assignments.assignedAt));
  }

  /**
   * Adiciona etiqueta à task
   */
  async addLabel(taskId: string, labelId: string): Promise<TaskLabel> {
    const [taskLabel] = await db
      .insert(task_labels)
      .values({
        taskId,
        labelId,
      })
      .returning();
    return taskLabel;
  }

  /**
   * Remove etiqueta da task
   */
  async removeLabel(taskId: string, labelId: string): Promise<boolean> {
    const [deleted] = await db
      .delete(task_labels)
      .where(
        and(eq(task_labels.taskId, taskId), eq(task_labels.labelId, labelId))
      )
      .returning();
    return !!deleted;
  }

  /**
   * Busca etiquetas de uma task
   */
  async findTaskLabels(taskId: string) {
    return await db
      .select({
        taskLabel: task_labels,
        label: project_labels,
      })
      .from(task_labels)
      .innerJoin(project_labels, eq(task_labels.labelId, project_labels.id))
      .where(eq(task_labels.taskId, taskId))
      .orderBy(asc(project_labels.name));
  }

  /**
   * Adiciona anexo à task
   */
  async addAttachment(
    attachmentData: Omit<TaskAttachment, "id" | "createdAt">
  ): Promise<TaskAttachment> {
    const [attachment] = await db
      .insert(task_attachments)
      .values({
        ...attachmentData,
        createdAt: new Date(),
      })
      .returning();
    return attachment;
  }

  /**
   * Busca anexos de uma task
   */
  async findTaskAttachments(taskId: string): Promise<TaskAttachment[]> {
    return await db
      .select()
      .from(task_attachments)
      .where(eq(task_attachments.taskId, taskId))
      .orderBy(desc(task_attachments.createdAt));
  }

  /**
   * Remove anexo da task
   */
  async removeAttachment(attachmentId: string): Promise<boolean> {
    const [deleted] = await db
      .delete(task_attachments)
      .where(eq(task_attachments.id, attachmentId))
      .returning();
    return !!deleted;
  }

  /**
   * Adiciona dependência à task
   */
  async addDependency(
    dependencyData: Omit<TaskDependency, "id" | "createdAt">
  ): Promise<TaskDependency> {
    const [dependency] = await db
      .insert(task_dependencies)
      .values({
        ...dependencyData,
        createdAt: new Date(),
      })
      .returning();
    return dependency;
  }

  /**
   * Busca dependências de uma task
   */
  async findTaskDependencies(taskId: string): Promise<TaskDependency[]> {
    return await db
      .select()
      .from(task_dependencies)
      .where(eq(task_dependencies.taskId, taskId))
      .orderBy(desc(task_dependencies.createdAt));
  }

  /**
   * Remove dependência da task
   */
  async removeDependency(dependencyId: string): Promise<boolean> {
    const [deleted] = await db
      .delete(task_dependencies)
      .where(eq(task_dependencies.id, dependencyId))
      .returning();
    return !!deleted;
  }

  /**
   * Adiciona comentário à task
   */
  async addComment(
    commentData: Omit<Comment, "id" | "createdAt" | "updatedAt">
  ): Promise<Comment> {
    const [comment] = await db
      .insert(comments)
      .values({
        ...commentData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return comment;
  }

  /**
   * Busca comentários de uma task
   */
  async findTaskComments(taskId: string): Promise<Comment[]> {
    return await db
      .select()
      .from(comments)
      .where(
        and(eq(comments.entityType, "task"), eq(comments.entityId, taskId))
      )
      .orderBy(desc(comments.createdAt));
  }

  /**
   * Busca tasks por status
   */
  async findByStatus(statusId: string): Promise<DbTask[]> {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.statusId, statusId))
      .orderBy(desc(tasks.createdAt));
  }

  /**
   * Busca tasks por prioridade
   */
  async findByPriority(priority: number): Promise<DbTask[]> {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.priority, priority))
      .orderBy(desc(tasks.createdAt));
  }

  /**
   * Busca tasks vencidas
   */
  async findOverdue(): Promise<DbTask[]> {
    return await db
      .select()
      .from(tasks)
      .where(
        and(eq(tasks.dueDate, new Date()), eq(tasks.statusId, "completed"))
      )
      .orderBy(asc(tasks.dueDate));
  }

  /**
   * Verifica se uma task pertence a um projeto
   */
  async belongsToProject(taskId: string, projectId: string): Promise<boolean> {
    const [task] = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.projectId, projectId)));

    return !!task;
  }

  /**
   * Busca tasks de um sprint
   */
  async findBySprint(sprintId: string): Promise<DbTask[]> {
    const result = await db
      .select()
      .from(tasks)
      .where(eq(tasks.sprintId, sprintId))
      .orderBy(desc(tasks.createdAt));
    return Array.isArray(result) ? result : [];
  }
}

// Instância singleton do repositório
export const taskRepository = new TaskRepository();
