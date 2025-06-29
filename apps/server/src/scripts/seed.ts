import { db } from "../db/connection";
import { users, tasks } from "../db/schema";

/**
 * Dados de exemplo para usuários
 */
const userData = [
  {
    name: "João Silva",
    email: "joao@example.com",
  },
  {
    name: "Maria Santos",
    email: "maria@example.com",
  },
  {
    name: "Pedro Oliveira",
    email: "pedro@example.com",
  },
  {
    name: "Ana Costa",
    email: "ana@example.com",
  },
  {
    name: "Carlos Ferreira",
    email: "carlos@example.com",
  },
];

/**
 * Dados de exemplo para tasks
 */
const taskData = [
  {
    title: "Implementar autenticação",
    description: "Criar sistema de login e registro de usuários",
    completed: false,
    userId: 1,
  },
  {
    title: "Criar dashboard",
    description: "Desenvolver interface principal do sistema",
    completed: true,
    userId: 1,
  },
  {
    title: "Configurar banco de dados",
    description: "Instalar e configurar PostgreSQL",
    completed: true,
    userId: 2,
  },
  {
    title: "Escrever documentação",
    description: "Documentar APIs e componentes",
    completed: false,
    userId: 2,
  },
  {
    title: "Implementar testes",
    description: "Criar testes unitários e de integração",
    completed: false,
    userId: 3,
  },
  {
    title: "Deploy em produção",
    description: "Configurar ambiente de produção",
    completed: false,
    userId: 3,
  },
  {
    title: "Revisar código",
    description: "Fazer code review dos PRs pendentes",
    completed: true,
    userId: 4,
  },
  {
    title: "Atualizar dependências",
    description: "Atualizar pacotes para versões mais recentes",
    completed: false,
    userId: 4,
  },
  {
    title: "Otimizar performance",
    description: "Melhorar tempo de resposta das APIs",
    completed: false,
    userId: 5,
  },
  {
    title: "Implementar cache",
    description: "Adicionar Redis para cache de dados",
    completed: false,
    userId: 5,
  },
];

/**
 * Limpa todas as tabelas
 */
async function clearTables() {
  console.log("🧹 Limpando tabelas...");

  try {
    await db.delete(tasks);
    await db.delete(users);
    console.log("✅ Tabelas limpas com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao limpar tabelas:", error);
    throw error;
  }
}

/**
 * Popula a tabela de usuários
 */
async function seedUsers() {
  console.log("👥 Populando usuários...");

  try {
    const insertedUsers = await db.insert(users).values(userData).returning();
    console.log(`✅ ${insertedUsers.length} usuários criados!`);
    return insertedUsers;
  } catch (error) {
    console.error("❌ Erro ao criar usuários:", error);
    throw error;
  }
}

/**
 * Popula a tabela de tasks
 */
async function seedTasks() {
  console.log("📋 Populando tasks...");

  try {
    const insertedTasks = await db.insert(tasks).values(taskData).returning();
    console.log(`✅ ${insertedTasks.length} tasks criadas!`);
    return insertedTasks;
  } catch (error) {
    console.error("❌ Erro ao criar tasks:", error);
    throw error;
  }
}

/**
 * Executa o seed completo
 */
async function seed() {
  console.log("🌱 Iniciando seed do banco de dados...");

  try {
    await clearTables();
    await seedUsers();
    await seedTasks();

    console.log("🎉 Seed concluído com sucesso!");
    console.log("📊 Resumo:");
    console.log(`   - ${userData.length} usuários criados`);
    console.log(`   - ${taskData.length} tasks criadas`);
  } catch (error) {
    console.error("💥 Erro durante o seed:", error);
    process.exit(1);
  }
}

/**
 * Executa apenas o reset (limpar + popular)
 */
async function reset() {
  console.log("🔄 Iniciando reset do banco de dados...");
  await seed();
}

// Execução baseada no argumento da linha de comando
const command = process.argv[2];

switch (command) {
  case "reset":
    reset();
    break;
  case "clear":
    clearTables();
    break;
  default:
    seed();
}

export { seed, reset, clearTables };
