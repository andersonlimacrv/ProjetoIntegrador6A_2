import {
  User as UserModel,
  CreateUserInput,
  UpdateUserInput,
  LoginUserInput,
} from "@shared";
import { db } from "../db/connection";
import { users, user_tenants, sessions, activities } from "../db/schema";
import { eq, and, desc } from "drizzle-orm";
import type { NewUser, User as DbUser, Session, Activity } from "../db/schema";
import bcrypt from "bcryptjs";

export class UserRepository {
  /**
   * Busca todos os usuários
   */
  async findAll(): Promise<DbUser[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  /**
   * Busca um usuário por ID
   */
  async findById(id: string): Promise<DbUser | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || null;
  }

  /**
   * Busca um usuário por email
   */
  async findByEmail(email: string): Promise<DbUser | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || null;
  }

  /**
   * Cria um novo usuário
   */
  async create(data: CreateUserInput): Promise<DbUser> {
    const hashedPassword = await bcrypt.hash(data.password, 12);

    const [newUser] = await db
      .insert(users)
      .values({
        email: data.email,
        passwordHash: hashedPassword,
        name: data.name,
        avatarUrl: data.avatarUrl,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    if (!newUser) {
      throw new Error("Falha ao criar usuário");
    }

    return newUser;
  }

  /**
   * Atualiza um usuário existente
   */
  async update(id: string, data: UpdateUserInput): Promise<DbUser | null> {
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (data.name !== undefined) {
      updateData.name = data.name;
    }

    if (data.email !== undefined) {
      updateData.email = data.email;
    }

    if (data.avatarUrl !== undefined) {
      updateData.avatarUrl = data.avatarUrl;
    }

    if (data.isActive !== undefined) {
      updateData.isActive = data.isActive;
    }

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();

    return updatedUser || null;
  }

  /**
   * Deleta um usuário
   */
  async delete(id: string): Promise<boolean> {
    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning();

    return !!deletedUser;
  }

  /**
   * Verifica se um email já existe
   */
  async emailExists(email: string, excludeId?: string): Promise<boolean> {
    if (excludeId) {
      const existingUser = await db
        .select()
        .from(users)
        .where(and(eq(users.email, email), eq(users.id, excludeId)));
      return existingUser.length > 0;
    } else {
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email));
      return existingUser.length > 0;
    }
  }

  /**
   * Autentica um usuário
   */
  async authenticate(data: LoginUserInput): Promise<DbUser | null> {
    const user = await this.findByEmail(data.email);

    if (!user || !user.isActive) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(
      data.password,
      user.passwordHash
    );

    if (!isValidPassword) {
      return null;
    }

    // Atualiza último login
    await db
      .update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, user.id));

    return user;
  }

  /**
   * Busca tenants do usuário
   */
  async findUserTenants(userId: string) {
    return await db
      .select({
        userTenant: userTenants,
        user: users,
      })
      .from(userTenants)
      .innerJoin(users, eq(userTenants.userId, users.id))
      .where(eq(userTenants.userId, userId))
      .orderBy(desc(userTenants.joinedAt));
  }

  /**
   * Cria uma nova sessão
   */
  async createSession(
    sessionData: Omit<Session, "id" | "createdAt">
  ): Promise<Session> {
    const [session] = await db
      .insert(sessions)
      .values({
        ...sessionData,
        createdAt: new Date(),
      })
      .returning();

    if (!session) {
      throw new Error("Falha ao criar sessão");
    }

    return session;
  }

  /**
   * Busca sessão por token hash
   */
  async findSessionByToken(tokenHash: string): Promise<Session | null> {
    const [session] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.tokenHash, tokenHash));
    return session || null;
  }

  /**
   * Deleta sessão
   */
  async deleteSession(id: string): Promise<boolean> {
    const result = await db.delete(sessions).where(eq(sessions.id, id));
    return result.length > 0;
  }

  /**
   * Deleta todas as sessões expiradas
   */
  async deleteExpiredSessions(): Promise<number> {
    const result = await db
      .delete(sessions)
      .where(eq(sessions.expiresAt, new Date()));
    return result.length;
  }

  /**
   * Registra atividade do usuário
   */
  async logActivity(
    activityData: Omit<Activity, "id" | "createdAt">
  ): Promise<Activity> {
    const [activity] = await db
      .insert(activities)
      .values({
        ...activityData,
        createdAt: new Date(),
      })
      .returning();

    if (!activity) {
      throw new Error("Falha ao registrar atividade");
    }

    return activity;
  }

  /**
   * Busca atividades do usuário
   */
  async findUserActivities(
    userId: string,
    limit: number = 50
  ): Promise<Activity[]> {
    return await db
      .select()
      .from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(desc(activities.createdAt))
      .limit(limit);
  }

  /**
   * Busca atividades do tenant
   */
  async findTenantActivities(
    tenantId: string,
    limit: number = 50
  ): Promise<Activity[]> {
    return await db
      .select()
      .from(activities)
      .where(eq(activities.tenantId, tenantId))
      .orderBy(desc(activities.createdAt))
      .limit(limit);
  }
}

// Instância singleton do repositório
export const userRepository = new UserRepository();
