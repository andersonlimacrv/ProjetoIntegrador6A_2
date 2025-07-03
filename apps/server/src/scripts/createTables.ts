import { db } from "../db/connection";
import { sql } from "drizzle-orm";

/**
 * Script para criar as tabelas do banco de dados
 */
export async function createTables() {
  try {
    console.log("🔄 Criando tabelas do banco de dados...");

    // Cria a tabela users
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ON_ERROR (IGNORE);
    `);

    console.log("✅ Tabela 'users' criada com sucesso!");

    // Cria a tabela tasks
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT FALSE NOT NULL,
        user_id INTEGER NOT NULL REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ Tabela 'tasks' criada com sucesso!");

    // Cria a tabela posts (para uso futuro)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        content TEXT NOT NULL,
        author_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ Tabela 'posts' criada com sucesso!");
    console.log("🎉 Todas as tabelas foram criadas com sucesso!");

    return true;
  } catch (error) {
    console.error("❌ Erro ao criar tabelas:", error);
    return false;
  }
}

// Executa o script quando chamado diretamente
if (import.meta.main) {
  createTables().finally(() => process.exit(0));
}
