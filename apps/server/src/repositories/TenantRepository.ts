import { Tenant as TenantModel } from "@shared";
import { db } from "../db/connection";
import { tenants, users, user_tenants, roles, invitations } from "../db/schema";
import { eq, and, desc } from "drizzle-orm";
import type {
  NewTenant,
  Tenant,
  UserTenant,
  Role,
  Invitation,
} from "../db/schema";

export class TenantRepository {
  // Criar um novo tenant
  async create(data: NewTenant): Promise<Tenant> {
    const [tenant] = await db.insert(tenants).values(data).returning();
    return tenant;
  }

  // Buscar tenant por ID
  async findById(id: string): Promise<Tenant | null> {
    const [tenant] = await db.select().from(tenants).where(eq(tenants.id, id));
    return tenant || null;
  }

  // Buscar tenant por slug
  async findBySlug(slug: string): Promise<Tenant | null> {
    const [tenant] = await db
      .select()
      .from(tenants)
      .where(eq(tenants.slug, slug));
    return tenant || null;
  }

  // Listar todos os tenants
  async findAll(): Promise<Tenant[]> {
    return await db.select().from(tenants).orderBy(desc(tenants.createdAt));
  }

  // Atualizar tenant
  async update(id: string, data: Partial<Tenant>): Promise<Tenant | null> {
    const [tenant] = await db
      .update(tenants)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(tenants.id, id))
      .returning();
    return tenant || null;
  }

  // Deletar tenant
  async delete(id: string): Promise<boolean> {
    const result = await db.delete(tenants).where(eq(tenants.id, id));
    return result.rowCount > 0;
  }

  // Adicionar usuário ao tenant
  async addUser(
    tenantId: string,
    userId: string,
    status: string = "active"
  ): Promise<UserTenant> {
    const [userTenant] = await db
      .insert(user_tenants)
      .values({
        tenantId,
        userId,
        status,
        joinedAt: new Date(),
      })
      .returning();
    return userTenant;
  }

  // Remover usuário do tenant
  async removeUser(tenantId: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(user_tenants)
      .where(
        and(eq(user_tenants.tenantId, tenantId), eq(user_tenants.userId, userId))
      );
    return result.rowCount > 0;
  }

  // Buscar usuários do tenant
  async findUsers(tenantId: string) {
    return await db
      .select({
        user: users,
        userTenant: user_tenants,
      })
      .from(user_tenants)
      .innerJoin(users, eq(user_tenants.userId, users.id))
      .where(eq(user_tenants.tenantId, tenantId))
      .orderBy(desc(user_tenants.joinedAt));
  }

  // Buscar tenant com usuários
  async findByIdWithUsers(id: string) {
    const [tenant] = await db.select().from(tenants).where(eq(tenants.id, id));

    if (!tenant) return null;

    const tenantUsers = await this.findUsers(id);

    return {
      ...tenant,
      users: tenantUsers,
    };
  }

  // Criar role para o tenant
  async createRole(
    tenantId: string,
    roleData: Omit<Role, "id" | "tenantId" | "createdAt">
  ): Promise<Role> {
    const [role] = await db
      .insert(roles)
      .values({
        ...roleData,
        tenantId,
        createdAt: new Date(),
      })
      .returning();
    return role;
  }

  // Buscar roles do tenant
  async findRoles(tenantId: string): Promise<Role[]> {
    return await db
      .select()
      .from(roles)
      .where(eq(roles.tenantId, tenantId))
      .orderBy(roles.name);
  }

  // Criar convite
  async createInvitation(
    invitationData: Omit<Invitation, "id" | "createdAt">
  ): Promise<Invitation> {
    const [invitation] = await db
      .insert(invitations)
      .values({
        ...invitationData,
        createdAt: new Date(),
      })
      .returning();
    return invitation;
  }

  // Buscar convite por token
  async findInvitationByToken(token: string): Promise<Invitation | null> {
    const [invitation] = await db
      .select()
      .from(invitations)
      .where(eq(invitations.token, token));
    return invitation || null;
  }

  // Atualizar status do convite
  async updateInvitationStatus(
    token: string,
    status: string,
    acceptedAt?: Date
  ): Promise<Invitation | null> {
    const [invitation] = await db
      .update(invitations)
      .set({ status, acceptedAt })
      .where(eq(invitations.token, token))
      .returning();
    return invitation || null;
  }

  // Buscar convites do tenant
  async findInvitations(tenantId: string): Promise<Invitation[]> {
    return await db
      .select()
      .from(invitations)
      .where(eq(invitations.tenantId, tenantId))
      .orderBy(desc(invitations.createdAt));
  }
}
