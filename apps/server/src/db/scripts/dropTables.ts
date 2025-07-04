import { db_script as db } from "./connection";
import { sql } from "drizzle-orm";

/**
 * Script para dropar todas as tabelas do banco de dados
 */
export async function dropTables() {
  try {
    console.log("🗑️ Iniciando remoção de todas as tabelas...");

    // Lista de todas as 25 tabelas na ordem correta (respeitando foreign keys)
    const tables = [
      // Tabelas de relacionamento primeiro (mais dependentes)
      "task_dependencies",
      "task_attachments",
      "task_labels",
      "task_assignments",
      "sprint_backlog_items",
      "sprint_metrics",
      "user_roles",
      "permissions",
      "invitations",
      "activities",
      "comments",
      "sessions",

      // Tabelas principais (menos dependentes)
      "tasks",
      "user_stories",
      "epics",
      "statuses",
      "status_flows",
      "sprints",
      "team_projects",
      "user_teams",
      "teams",
      "project_settings",
      "project_labels",
      "projects",
      "roles",
      "user_tenants",
      "users",
      "tenants",
    ];

    let successCount = 0;
    let errorCount = 0;

    // Drop de cada tabela
    for (const table of tables) {
      try {
        await db.execute(
          sql`DROP TABLE IF EXISTS ${sql.identifier(table)} CASCADE`
        );
        console.log(`✅ Tabela '${table}' removida com sucesso!`);
        successCount++;
      } catch (error) {
        console.log(`⚠️ Erro ao remover tabela '${table}':`, error);
        errorCount++;
      }
    }

    console.log(
      `🎉 Processo concluído! ${successCount} tabelas removidas, ${errorCount} erros.`
    );
  } catch (error) {
    console.error("❌ Erro ao dropar tabelas:", error);
    throw error;
  }
}

/**
 * Script para executar o drop das tabelas
 */
async function main() {
  try {
    await dropTables();
    console.log("✅ Script de remoção de tabelas executado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao executar script:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main();
