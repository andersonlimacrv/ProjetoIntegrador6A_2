import { seedDatabase } from "../seed";

/**
 * Script para povoar o banco de dados
 */
async function seed() {
  try {
    console.log("🌱 Iniciando seed do banco de dados...");
    await seedDatabase();
    console.log("✅ Seed concluído!");
  } catch (error) {
    console.error("❌ Erro ao fazer seed:", error);
  } finally {
    process.exit(0);
  }
}

// Executa o script
seed();
