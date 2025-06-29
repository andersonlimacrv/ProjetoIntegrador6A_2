import { seedDatabase, clearDatabase, resetDatabase } from "../db/seed";

async function main() {
  const command = process.argv[2];

  switch (command) {
    case "seed":
      console.log("🌱 Executando seed do banco de dados...");
      await seedDatabase();
      break;

    case "clear":
      console.log("🧹 Limpando banco de dados...");
      await clearDatabase();
      break;

    case "reset":
      console.log("🔄 Resetando banco de dados...");
      await resetDatabase();
      break;

    default:
      console.log("Uso: bun run seed [seed|clear|reset]");
      console.log("  seed  - Adiciona dados de exemplo");
      console.log("  clear - Remove todos os dados");
      console.log("  reset - Remove e adiciona dados de exemplo");
      break;
  }
}

main().catch(console.error);
