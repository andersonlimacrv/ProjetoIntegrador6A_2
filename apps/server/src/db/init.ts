import { sql } from "drizzle-orm";
import { db } from "./connection";
import { Config } from "../config";

export async function initializeDatabase() {
  try {
    console.log("🔄 Inicializando conexão com o banco de dados...");
    await db.execute(sql`SELECT 1 as test`);

    return true;
  } catch (error) {
    console.error("❌ Erro ao conectar com o banco de dados:", error);

    if (Config.isDevelopment()) {
      console.error("Detalhes do erro:", error);
    }

    return false;
  }
}


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
