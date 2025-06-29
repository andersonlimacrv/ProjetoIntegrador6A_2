import { db } from "./connection";
import { users } from "./schema";

/**
 * Dados de exemplo para popular o banco
 */
const sampleUsers = [
  { name: "João Silva", email: "joao@example.com" },
  { name: "Maria Santos", email: "maria@example.com" },
  { name: "Pedro Costa", email: "pedro@example.com" },
  { name: "Ana Oliveira", email: "ana@example.com" },
  { name: "Carlos Ferreira", email: "carlos@example.com" },
];

/**
 * Cria dados de exemplo se a tabela estiver vazia
 */
export async function seedDatabase() {
  try {
    console.log("🌱 Verificando se há dados de exemplo...");

    const existingUsers = await db.select().from(users);

    if (existingUsers.length === 0) {
      console.log("🌱 Criando dados de exemplo...");

      for (const userData of sampleUsers) {
        await db.insert(users).values(userData);
      }

      console.log(`✅ ${sampleUsers.length} usuários de exemplo criados!`);
    } else {
      console.log(`ℹ️ Já existem ${existingUsers.length} usuários no banco`);
    }
  } catch (error) {
    console.error("❌ Erro ao verificar dados de exemplo:", error);
  }
}

/**
 * Limpa todos os dados da tabela (apenas para desenvolvimento)
 */
export async function clearDatabase() {
  try {
    console.log("🧹 Limpando dados do banco...");

    await db.delete(users);

    console.log("✅ Dados limpos com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao limpar dados:", error);
  }
}

/**
 * Reseta o banco (limpa e recria dados)
 */
export async function resetDatabase() {
  try {
    console.log("🔄 Resetando banco de dados...");

    await clearDatabase();
    await seedDatabase();

    console.log("✅ Banco resetado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao resetar banco:", error);
  }
}
