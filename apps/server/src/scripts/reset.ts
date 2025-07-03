import { resetDatabase } from "../db/seed";

/**
 * Script para resetar o banco de dados
 */
async function reset() {
  try {
    console.log("🔄 Iniciando reset do banco de dados...");
    await resetDatabase();
    console.log("✅ Reset concluído!");
  } catch (error) {
    console.error("❌ Erro ao resetar banco:", error);
  } finally {
    process.exit(0);
  }
}

// Executa o script
reset();
