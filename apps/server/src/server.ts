import { serve } from "@hono/node-server";
import app from "./index";
import { Config } from "./config";
import { initializeDatabase, createTables } from "./db/init";
import { seedDatabase } from "./db/seed";

async function startServer() {
  try {
    // Debug das variáveis de ambiente
    Config.debug();

    console.log("🔄 Iniciando servidor...");

    // Inicializa o banco de dados
    const dbInitialized = await initializeDatabase();

    if (!dbInitialized) {
      console.error("❌ Falha ao inicializar banco de dados. Encerrando...");
      process.exit(1);
    }

    // Cria as tabelas se necessário
    const tablesCreated = await createTables();
    if (!tablesCreated) {
      console.error("❌ Falha ao criar tabelas. Encerrando...");
      process.exit(1);
    }

    // Cria dados de exemplo se necessário
    if (Config.isDevelopment()) {
      await seedDatabase();
    }

    console.log(
      `🚀 Servidor rodando em http://localhost:${Config.SERVER_PORT}`
    );
    console.log(
      `📊 Health check: http://localhost:${Config.SERVER_PORT}/health`
    );
    console.log(`🔧 Ambiente: ${Config.NODE_ENV}`);
    console.log(`📚 API Docs: http://localhost:${Config.SERVER_PORT}/`);

    serve({
      fetch: app.fetch,
      port: Config.SERVER_PORT,
    });
  } catch (error) {
    console.error("❌ Erro ao iniciar servidor:", error);
    process.exit(1);
  }
}

// Inicia o servidor
startServer();

// Tratamento de sinais para graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Recebido SIGINT. Encerrando servidor...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n🛑 Recebido SIGTERM. Encerrando servidor...");
  process.exit(0);
});
