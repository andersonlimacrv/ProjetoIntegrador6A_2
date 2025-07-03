import { db } from "./connection";
import { users, tasks } from "./schema";

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

const sampleTasks = [
  {
    title: "Estudar React",
    description: "Revisar hooks e componentes",
    userId: 1,
  },
  { title: "Implementar API", description: "Criar endpoints REST", userId: 1 },
  {
    title: "Testar aplicação",
    description: "Executar testes unitários",
    userId: 2,
  },
  { title: "Deploy", description: "Fazer deploy em produção", userId: 2 },
  { title: "Documentação", description: "Atualizar README", userId: 3 },
];

/**
 * Cria dados de exemplo se as tabelas estiverem vazias
 */
export async function seedDatabase() {
  try {
    console.log("🌱 Verificando se há dados de exemplo...");

    const existingUsers = await db.select().from(users);

    if (existingUsers.length === 0) {
      console.log("🌱 Criando usuários de exemplo...");

      for (const userData of sampleUsers) {
        await db.insert(users).values(userData);
      }

      console.log(`✅ ${sampleUsers.length} usuários de exemplo criados!`);
    } else {
      console.log(`ℹ️ Já existem ${existingUsers.length} usuários no banco`);
    }

    const existingTasks = await db.select().from(tasks);

    if (existingTasks.length === 0) {
      console.log("🌱 Criando tasks de exemplo...");

      for (const taskData of sampleTasks) {
        await db.insert(tasks).values(taskData);
      }

      console.log(`✅ ${sampleTasks.length} tasks de exemplo criadas!`);
    } else {
      console.log(`ℹ️ Já existem ${existingTasks.length} tasks no banco`);
    }

    console.log("🎉 Seed concluído com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao verificar dados de exemplo:", error);
  }
}

/**
 * Limpa todos os dados das tabelas (apenas para desenvolvimento)
 */
export async function clearDatabase() {
  try {
    console.log("🧹 Limpando dados do banco...");

    await db.delete(tasks);
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
