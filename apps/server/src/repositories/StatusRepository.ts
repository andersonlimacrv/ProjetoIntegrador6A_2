import { Status } from "@shared";
import { db } from "../db/connection";

export class StatusRepository {
  async getAll(): Promise<Status[]> {
    // TODO: Implementar busca de todos os status
    return [];
  }
  async getById(id: string): Promise<Status | null> {
    // TODO: Implementar busca por ID
    return null;
  }
  async create(data: Partial<Status>): Promise<Status> {
    // TODO: Implementar criação
    return {} as Status;
  }
  async update(id: string, data: Partial<Status>): Promise<Status | null> {
    // TODO: Implementar atualização
    return null;
  }
  async delete(id: string): Promise<boolean> {
    // TODO: Implementar remoção
    return false;
  }
}
