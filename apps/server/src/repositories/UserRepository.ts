import {
  User,
  CreateUserDTO,
  UpdateUserDTO,
  LoginUserDTO,
  Session,
  Activity,
} from "@shared/types";
import { db } from "../db/connection";
import {
  users,
  user_tenants,
  sessions,
  activities,
  tenants,
} from "../db/schema";
import { eq, and, desc, lt } from "drizzle-orm";
import bcrypt from "bcryptjs";

export class UserRepository {
  // Função utilitária para adaptar User
  private adaptUser(u: any): User {
    return {
      ...u,
      avatarUrl: u.avatarUrl === null ? undefined : u.avatarUrl,
    };
  }

  // Função utilitária para adaptar Session
  private adaptSession(s: any): Session {
    return {
      ...s,
      ipAddress: s.ipAddress === null ? undefined : s.ipAddress,
      userAgent: s.userAgent === null ? undefined : s.userAgent,
    };
  }

  // Função utilitária para adaptar Activity
  private adaptActivity(a: any): Activity {
    return {
      ...a,
      // entityType já é string, mas pode precisar de cast
      entityType: a.entityType as Activity["entityType"],
    };
  }

  /**
   * Busca todos os usuários
   */
  async findAll(): Promise<User[]> {
    const results = await db
      .select()
      .from(users)
      .orderBy(desc(users.createdAt));
    return results.map(this.adaptUser);
  }

  /**
   * Busca um usuário por ID
   */
  async findById(id: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user ? this.adaptUser(user) : null;
  }

  /**
   * Busca um usuário por email
   */
  async findByEmail(email: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user ? this.adaptUser(user) : null;
  }

  /**
   * Cria um novo usuário
   */
  async create(data: CreateUserDTO): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 12);

    const [newUser] = await db
      .insert(users)
      .values({
        email: data.email,
        passwordHash: hashedPassword,
        name: data.name,
        avatarUrl: data.avatarUrl ?? null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    if (!newUser) {
      throw new Error("Falha ao criar usuário");
    }

    return this.adaptUser(newUser);
  }

  /**
   * Atualiza um usuário existente
   */
  async update(id: string, data: UpdateUserDTO): Promise<User | null> {
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
      updateData.avatarUrl = data.avatarUrl ?? null;
    }

    if (data.isActive !== undefined) {
      updateData.isActive = data.isActive;
    }

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();

    return updatedUser ? this.adaptUser(updatedUser) : null;
  }

  /**
   * Deleta um usuário
   */
  async delete(id: string): Promise<boolean> {
    try {
      const [deleted] = await db
        .delete(users)
        .where(eq(users.id, id))
        .returning();
      return !!deleted;
    } catch (error) {
      throw error;
    }
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
  async authenticate(data: LoginUserDTO): Promise<User | null> {
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
        userTenant: user_tenants,
        user: users,
        tenant: tenants,
      })
      .from(user_tenants)
      .innerJoin(users, eq(user_tenants.userId, users.id))
      .innerJoin(tenants, eq(user_tenants.tenantId, tenants.id))
      .where(eq(user_tenants.userId, userId))
      .orderBy(desc(user_tenants.joinedAt));
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
        ipAddress: sessionData.ipAddress ?? null,
        userAgent: sessionData.userAgent ?? null,
        createdAt: new Date(),
      })
      .returning();

    if (!session) {
      throw new Error("Falha ao criar sessão");
    }

    return this.adaptSession(session);
  }

  /**
   * Busca sessão por token hash
   */
  async findSessionByToken(tokenHash: string): Promise<Session | null> {
    const [session] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.tokenHash, tokenHash));
    return session ? this.adaptSession(session) : null;
  }

  /**
   * Deleta sessão
   */
  async deleteSession(id: string): Promise<boolean> {
    const [deletedSession] = await db
      .delete(sessions)
      .where(eq(sessions.id, id))
      .returning();
    return !!deletedSession;
  }

  /**
   * Deleta todas as sessões expiradas
   */
  async deleteExpiredSessions(): Promise<number> {
    const result = await db
      .delete(sessions)
      .where(lt(sessions.expiresAt, new Date()))
      .returning();
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

    return this.adaptActivity(activity);
  }

  /**
   * Busca atividades do usuário
   */
  async findUserActivities(
    userId: string,
    limit: number = 50
  ): Promise<Activity[]> {
    const results = await db
      .select()
      .from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(desc(activities.createdAt))
      .limit(limit);
    return results.map(this.adaptActivity);
  }

  /**
   * Busca atividades do tenant
   */
  async findTenantActivities(
    tenantId: string,
    limit: number = 50
  ): Promise<Activity[]> {
    const results = await db
      .select()
      .from(activities)
      .where(eq(activities.tenantId, tenantId))
      .orderBy(desc(activities.createdAt))
      .limit(limit);
    return results.map(this.adaptActivity);
  }
}

// Instância singleton do repositório
export const userRepository = new UserRepository();
