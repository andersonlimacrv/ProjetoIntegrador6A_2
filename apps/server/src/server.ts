import { serve } from "@hono/node-server";
import app from "./index";
import { Config } from "./config";
import { initializeDatabase } from "./db/init";

async function startServer() {
  try {
    console.log(
      "🚀 Iniciando Sistema de Gestão de Projetos - Projeto Integrador 6A"
    );
    console.log("🚀".repeat(30));
    Config.debug();

    const dbInitialized = await initializeDatabase();

    if (!dbInitialized) {
      process.exit(1);
    }

    const serverConfig = Config.getServerConfig();
    const dbConfig = Config.getDatabaseConfig();

    console.log("\n" + "=".repeat(60));
    console.log("🎯 CONFIGURAÇÃO DO SERVIDOR");
    console.log("=".repeat(60));
    console.log(`📍 Porta: ${serverConfig.port}`);
    console.log(`🌍 Ambiente: ${serverConfig.environment}`);
    console.log(`🔗 CORS Origins: ${serverConfig.corsOrigins.join(", ")}`);
    console.log(
      `🗄️  Database: ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`
    );
    console.log(`👤 Database User: ${dbConfig.user}`);

    console.log("\n" + "=".repeat(60));
    console.log("🚀 INICIANDO SERVIDOR");
    console.log("=".repeat(60));

    serve({
      fetch: app.fetch,
      port: Config.SERVER_PORT,
    });

    console.log(
      `✅ Servidor rodando em http://localhost:${Config.SERVER_PORT}`
    );
    console.log(
      `📊 Health check: http://localhost:${Config.SERVER_PORT}/health`
    );
    console.log(
      `📚 API Documentation: http://localhost:${Config.SERVER_PORT}/`
    );
    console.log(`🔧 Ambiente: ${Config.NODE_ENV}`);

    console.log("\n📋 ENDPOINTS DISPONÍVEIS:");
    console.log("   • /health - Health check");
    console.log("   • /api/tenants - Gestão de tenants");
    console.log("   • /api/users - Gestão de usuários");
    console.log("   • /api/projects - Gestão de projetos");
    console.log("   • /api/teams - Gestão de equipes");
    console.log("   • /api/epics - Gestão de epics");
    console.log("   • /api/user-stories - Gestão de user stories");
    console.log("   • /api/tasks - Gestão de tarefas");
    console.log("   • /api/sprints - Gestão de sprints");
    console.log("   • /api/comments - Gestão de comentários");
    console.log("   • /api/activities - Gestão de atividades");

    console.log("\n" + "=".repeat(60));
    console.log("🎉 SISTEMA PRONTO PARA USO!");
    console.log("=".repeat(60));
  } catch (error) {
    console.error("\n❌ Erro crítico ao iniciar servidor:");
    console.error(error);
    console.error("\n🛑 Encerrando sistema...");
    process.exit(1);
  }
}

// Inicia o servidor
startServer();

// Tratamento de sinais para graceful shutdown
process.on("SIGINT", () => {
  console.log("\n" + "=".repeat(60));
  console.log("🛑 Recebido SIGINT. Encerrando servidor...");
  console.log("👋 Sistema finalizado com sucesso!");
  console.log("=".repeat(60));
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n" + "=".repeat(60));
  console.log("🛑 Recebido SIGTERM. Encerrando servidor...");
  console.log("👋 Sistema finalizado com sucesso!");
  console.log("=".repeat(60));
  process.exit(0);
});

// Tratamento de erros não capturados
process.on("uncaughtException", (error) => {
  console.error("\n💥 Erro não capturado:");
  console.error(error);
  console.error("\n🛑 Encerrando sistema devido a erro crítico...");
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("\n💥 Promise rejeitada não tratada:");
  console.error("Promise:", promise);
  console.error("Motivo:", reason);
  console.error("\n🛑 Encerrando sistema devido a erro crítico...");
  process.exit(1);
});
