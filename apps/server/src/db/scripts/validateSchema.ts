import { db_script as db } from "./connection";
import { sql } from "drizzle-orm";
import * as schema from "../schema";

/**
 * Interface para representar uma coluna do banco
 */
interface ColumnInfo {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
  character_maximum_length: number | null;
  [key: string]: unknown;
}

/**
 * Interface para representar uma constraint do banco
 */
interface ConstraintInfo {
  constraint_name: string;
  constraint_type: string;
  table_name: string;
  column_name: string;
  [key: string]: unknown;
}

/**
 * Interface para representar uma foreign key do banco
 */
interface ForeignKeyInfo {
  constraint_name: string;
  table_name: string;
  column_name: string;
  foreign_table_name: string;
  foreign_column_name: string;
  [key: string]: unknown;
}

/**
 * Valida se as tabelas do banco correspondem ao schema
 */
export async function validateSchema() {
  try {
    console.log("🔍 Iniciando validação do schema...\n");

    // Obtém todas as tabelas do schema.ts
    const schemaTables = Object.keys(schema).filter(
      (key) =>
        key.endsWith("s") &&
        !key.includes("Relations") &&
        !key.includes("Type") &&
        !key.includes("New")
    );

    console.log(`📋 Tabelas definidas no schema.ts: ${schemaTables.length}`);
    schemaTables.forEach((table) => console.log(`   - ${table}`));
    console.log();

    // Obtém todas as tabelas do banco de dados
    const dbTables = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    const dbTableNames = dbTables.map((row) => row["table_name"] as string);
    console.log(`🗄️ Tabelas encontradas no banco: ${dbTableNames.length}`);
    dbTableNames.forEach((table) => console.log(`   - ${table}`));
    console.log();

    // Compara tabelas diretamente (ambos já usam snake_case)
    const missingInDb = schemaTables.filter(
      (table) => !dbTableNames.includes(table)
    );
    const extraInDb = dbTableNames.filter(
      (table) => !schemaTables.includes(table)
    );

    if (missingInDb.length > 0) {
      console.log("❌ Tabelas faltando no banco de dados:");
      missingInDb.forEach((table) => console.log(`   - ${table}`));
      console.log();
    }

    if (extraInDb.length > 0) {
      console.log("⚠️ Tabelas extras no banco de dados:");
      extraInDb.forEach((table) => console.log(`   - ${table}`));
      console.log();
    }

    // Valida estrutura das tabelas que existem em ambos
    const commonTables = schemaTables.filter((table) =>
      dbTableNames.includes(table)
    );

    if (commonTables.length > 0) {
      console.log("🔍 Validando estrutura das tabelas...\n");

      for (const tableName of commonTables) {
        await validateTableStructure(tableName, tableName);
      }
    }

    // Resumo final
    console.log("📊 RESUMO DA VALIDAÇÃO:");
    console.log(`   ✅ Tabelas válidas: ${commonTables.length}`);
    console.log(`   ❌ Tabelas faltando: ${missingInDb.length}`);
    console.log(`   ⚠️ Tabelas extras: ${extraInDb.length}`);

    if (missingInDb.length === 0 && extraInDb.length === 0) {
      console.log(
        "\n🎉 Schema validado com sucesso! Todas as tabelas estão sincronizadas."
      );
    } else {
      console.log(
        "\n⚠️ Foram encontradas discrepâncias entre o schema e o banco de dados."
      );
    }
  } catch (error) {
    console.error("❌ Erro durante a validação:", error);
    throw error;
  }
}

/**
 * Valida a estrutura de uma tabela específica
 */
async function validateTableStructure(
  tableName: string,
  originalTableName: string
) {
  try {
    console.log(`📋 Validando tabela: ${tableName}`);

    // Obtém colunas do banco
    const columns = (await db.execute(sql`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default,
        character_maximum_length
      FROM information_schema.columns 
      WHERE table_name = ${tableName}
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `)) as unknown as ColumnInfo[];

    // Obtém constraints do banco
    const constraints = (await db.execute(sql`
      SELECT 
        tc.constraint_name,
        tc.constraint_type,
        tc.table_name,
        kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
      WHERE tc.table_name = ${tableName}
      AND tc.table_schema = 'public'
    `)) as unknown as ConstraintInfo[];

    // Obtém foreign keys do banco
    const foreignKeys = (await db.execute(sql`
      SELECT 
        tc.constraint_name,
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage ccu 
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_name = ${tableName}
      AND tc.table_schema = 'public'
    `)) as unknown as ForeignKeyInfo[];

    console.log(`   📊 Colunas: ${columns.length}`);
    console.log(`   🔗 Constraints: ${constraints.length}`);
    console.log(`   🌐 Foreign Keys: ${foreignKeys.length}`);

    // Lista algumas colunas como exemplo
    if (columns.length > 0) {
      console.log(`   📝 Exemplo de colunas:`);
      columns.slice(0, 5).forEach((col) => {
        console.log(
          `      - ${col.column_name}: ${col.data_type}${
            col.is_nullable === "NO" ? " NOT NULL" : ""
          }`
        );
      });
      if (columns.length > 5) {
        console.log(`      ... e mais ${columns.length - 5} colunas`);
      }
    }

    console.log();
  } catch (error) {
    console.error(`   ❌ Erro ao validar tabela ${originalTableName}:`, error);
  }
}

/**
 * Script para executar a validação do schema
 */
async function main() {
  try {
    await validateSchema();
    console.log("✅ Validação concluída!");
  } catch (error) {
    console.error("❌ Erro ao executar validação:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Executa o script
main();
