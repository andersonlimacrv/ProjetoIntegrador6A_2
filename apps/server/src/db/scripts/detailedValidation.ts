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
  numeric_precision: number | null;
  numeric_scale: number | null;
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
 * Validação detalhada do schema vs banco de dados
 */
export async function detailedValidation() {
  try {
    console.log("🔍 Iniciando validação detalhada do schema...\n");

    // Obtém todas as tabelas do schema.ts
    const schemaTables = Object.keys(schema).filter(
      (key) =>
        key.endsWith("s") &&
        !key.includes("Relations") &&
        !key.includes("Type") &&
        !key.includes("New")
    );

    // Obtém todas as tabelas do banco de dados
    const dbTables = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    const dbTableNames = dbTables.map((row) => row["table_name"] as string);

    // Compara tabelas diretamente (ambos já usam snake_case)
    const missingInDb = schemaTables.filter(
      (table) => !dbTableNames.includes(table)
    );
    const extraInDb = dbTableNames.filter(
      (table) => !schemaTables.includes(table)
    );
    const commonTables = schemaTables.filter((table) =>
      dbTableNames.includes(table)
    );

    console.log("📊 ESTATÍSTICAS GERAIS:");
    console.log(`   📋 Tabelas no schema.ts: ${schemaTables.length}`);
    console.log(`   🗄️ Tabelas no banco: ${dbTableNames.length}`);
    console.log(`   ✅ Tabelas em comum: ${commonTables.length}`);
    console.log(`   ❌ Tabelas faltando: ${missingInDb.length}`);
    console.log(`   ⚠️ Tabelas extras: ${extraInDb.length}`);
    console.log();

    // Lista tabelas faltando
    if (missingInDb.length > 0) {
      console.log("❌ TABELAS FALTANDO NO BANCO:");
      missingInDb.forEach((table) => console.log(`   - ${table}`));
      console.log();
    }

    // Lista tabelas extras
    if (extraInDb.length > 0) {
      console.log("⚠️ TABELAS EXTRAS NO BANCO:");
      extraInDb.forEach((table) => console.log(`   - ${table}`));
      console.log();
    }

    // Validação detalhada das tabelas em comum
    if (commonTables.length > 0) {
      console.log("🔍 VALIDAÇÃO DETALHADA DAS TABELAS:\n");

      let totalIssues = 0;

      for (const tableName of commonTables) {
        const issues = await validateTableDetails(tableName, tableName);
        totalIssues += issues;
      }

      console.log(`📊 RESUMO DA VALIDAÇÃO DETALHADA:`);
      console.log(
        `   ✅ Tabelas válidas: ${commonTables.length - totalIssues}`
      );
      console.log(`   ⚠️ Tabelas com problemas: ${totalIssues}`);
      console.log(`   🔍 Total de problemas encontrados: ${totalIssues}`);
    }

    // Resumo final
    console.log("\n🎯 RESUMO FINAL:");
    if (missingInDb.length === 0 && extraInDb.length === 0) {
      console.log("✅ Schema e banco de dados estão sincronizados!");
    } else {
      console.log("⚠️ Existem discrepâncias entre schema e banco de dados.");
      console.log("💡 Execute 'db:create-tables' para sincronizar.");
    }
  } catch (error) {
    console.error("❌ Erro durante a validação detalhada:", error);
    throw error;
  }
}

/**
 * Validação detalhada de uma tabela específica
 */
async function validateTableDetails(
  dbTableName: string,
  schemaTableName: string
): Promise<number> {
  try {
    console.log(`📋 Validando tabela: ${schemaTableName} (${dbTableName})`);

    // Obtém colunas do banco
    const columns = (await db.execute(sql`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default,
        character_maximum_length,
        numeric_precision,
        numeric_scale
      FROM information_schema.columns 
      WHERE table_name = ${dbTableName}
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
      WHERE tc.table_name = ${dbTableName}
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
      AND tc.table_name = ${dbTableName}
      AND tc.table_schema = 'public'
    `)) as unknown as ForeignKeyInfo[];

    // Conta tipos de constraints
    const primaryKeys = constraints.filter(
      (c) => c.constraint_type === "PRIMARY KEY"
    ).length;
    const uniqueConstraints = constraints.filter(
      (c) => c.constraint_type === "UNIQUE"
    ).length;
    const foreignKeyConstraints = constraints.filter(
      (c) => c.constraint_type === "FOREIGN KEY"
    ).length;

    console.log(`   📊 Colunas: ${columns.length}`);
    console.log(`   🔑 Primary Keys: ${primaryKeys}`);
    console.log(`   🔗 Unique Constraints: ${uniqueConstraints}`);
    console.log(`   🌐 Foreign Keys: ${foreignKeyConstraints}`);

    // Verifica se tem pelo menos uma primary key
    let issues = 0;
    if (primaryKeys === 0) {
      console.log(
        `   ⚠️ AVISO: Tabela ${schemaTableName} não possui primary key`
      );
      issues++;
    }

    // Lista foreign keys
    if (foreignKeys.length > 0) {
      console.log(`   🌐 Foreign Keys:`);
      foreignKeys.forEach((fk) => {
        console.log(
          `      - ${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}`
        );
      });
    }

    // Lista algumas colunas como exemplo
    if (columns.length > 0) {
      console.log(`   📝 Colunas (primeiras 5):`);
      columns.slice(0, 5).forEach((col) => {
        let typeInfo = col.data_type;
        if (col.character_maximum_length) {
          typeInfo += `(${col.character_maximum_length})`;
        } else if (col.numeric_precision && col.numeric_scale) {
          typeInfo += `(${col.numeric_precision},${col.numeric_scale})`;
        }
        console.log(
          `      - ${col.column_name}: ${typeInfo}${
            col.is_nullable === "NO" ? " NOT NULL" : ""
          }`
        );
      });
      if (columns.length > 5) {
        console.log(`      ... e mais ${columns.length - 5} colunas`);
      }
    }

    console.log();
    return issues;
  } catch (error) {
    console.error(`   ❌ Erro ao validar tabela ${schemaTableName}:`, error);
    return 1;
  }
}

/**
 * Script para executar a validação detalhada
 */
async function main() {
  try {
    await detailedValidation();
    console.log("✅ Validação detalhada concluída!");
  } catch (error) {
    console.error("❌ Erro ao executar validação detalhada:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Executa o script
main();
