import { clearDatabase } from "../db/seed";

/**
 * Script para limpar dados do banco
 */
async function clear() {
  try {
    console.log("🧹 Iniciando limpeza do banco de dados...");
    await clearDatabase();
    console.log("✅ Limpeza concluída!");
  } catch (error) {
    console.error("❌ Erro ao limpar banco:", error);
  } finally {
    process.exit(0);
  }
}

// Executa o script
clear();
