import { db } from "./connection";
import { sql } from "drizzle-orm";
import { Config } from "../config";

/**
 * Inicializa o banco de dados
 */
export async function initializeDatabase() {
  try {
    console.log("🔄 Inicializando conexão com o banco de dados...");

    // Testa a conexão com uma query simples
    await db.execute(sql`SELECT 1 as test`);

    console.log("✅ Conexão com o banco de dados estabelecida com sucesso!");
    console.log("📊 Banco de dados pronto para uso");

    return true;
  } catch (error) {
    console.error("❌ Erro ao conectar com o banco de dados:", error);

    if (Config.isDevelopment()) {
      console.error("Detalhes do erro:", error);
    }

    return false;
  }
}

/**
 * Verifica a saúde da conexão com o banco
 */
export async function checkDatabaseHealth(): Promise<{
  status: "healthy" | "unhealthy";
  message: string;
  timestamp: string;
}> {
  try {
    const start = Date.now();
    await db.execute(sql`SELECT 1 as test`);
    const duration = Date.now() - start;

    return {
      status: "healthy",
      message: `Conexão OK (${duration}ms)`,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: "unhealthy",
      message: "Falha na conexão com o banco de dados",
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Cria as tabelas do banco de dados
 */
export async function createTables() {
  try {
    console.log("🔄 Criando tabelas do banco de dados...");

    // Cria a tabela users usando o schema do Drizzle
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ Tabela 'users' criada com sucesso!");
    return true;
  } catch (error) {
    console.error("❌ Erro ao criar tabelas:", error);
    return false;
  }
}
