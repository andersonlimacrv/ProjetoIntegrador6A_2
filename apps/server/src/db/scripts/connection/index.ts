import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../../schema";

// Encontra o índice da flag
const dbUrlIndex = process.argv.findIndex((arg) => arg === "-db_url");

// Se não achar a flag ou não tiver valor em seguida, sai com erro
if (dbUrlIndex === -1 || dbUrlIndex === process.argv.length - 1) {
  console.error(
    "\u274C Você deve passar a string de conexão usando o argumento -db_url <URL>\n" +
      "Exemplo: bun run src/db/scripts/createTables.ts -db_url postgresql://user:senha@localhost:5432/db"
  );
  process.exit(1);
}

const conn = process.argv[dbUrlIndex + 1];

// Garante em tempo de execução que não é undefined
if (!conn) {
  console.error("❌ URL de conexão inválida.");
  process.exit(1);
}

const connectionString: string = conn;

// Testa a conexão antes de prosseguir
let client: postgres.Sql;
try {
  client = postgres(connectionString, {
    ssl: false,
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  // Testa a conexão
  await client`SELECT 1`;
  console.log("✅ Conexão com o banco de dados estabelecida com sucesso!");
} catch (error) {
  console.error("❌ Erro ao conectar com o banco de dados:");
  console.error("   - Verifique se o PostgreSQL está rodando");
  console.error("   - Verifique se as credenciais estão corretas");
  console.error("   - Verifique se a URL de conexão está no formato correto");
  console.error(
    `   - Erro: ${error instanceof Error ? error.message : "Erro desconhecido"}`
  );
  process.exit(1);
}

export const db_script = drizzle(client, { schema });
export default db_script;
