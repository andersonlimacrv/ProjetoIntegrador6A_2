import { db } from "../db/connection";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { User, CreateUserInput, UpdateUserInput } from "../models/User";

export class UserRepository {
  /**
   * Busca todos os usuários
   */
  async findAll(): Promise<User[]> {
    return await db.select().from(users);
  }

  /**
   * Busca um usuário por ID
   */
  async findById(id: number): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || null;
  }

  /**
   * Busca um usuário por email
   */
  async findByEmail(email: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || null;
  }

  /**
   * Cria um novo usuário
   */
  async create(data: CreateUserInput): Promise<User> {
    const [newUser] = await db
      .insert(users)
      .values({
        name: data.name,
        email: data.email,
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
  async update(id: number, data: UpdateUserInput): Promise<User | null> {
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (data.name !== undefined) {
      updateData.name = data.name;
    }

    if (data.email !== undefined) {
      updateData.email = data.email;
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
  async delete(id: number): Promise<boolean> {
    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning();

    return !!deletedUser;
  }

  /**
   * Verifica se um email já existe
   */
  async emailExists(email: string, excludeId?: number): Promise<boolean> {
    let query = db.select().from(users).where(eq(users.email, email));

    if (excludeId) {
      query = query.where(eq(users.id, excludeId));
    }

    const [existingUser] = await query;
    return !!existingUser;
  }
}

// Instância singleton do repositório
export const userRepository = new UserRepository();
