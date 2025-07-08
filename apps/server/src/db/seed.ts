import { db_script as db } from "./scripts/connection";

import {
  users,
  tenants,
  userTenants,
  projects,
  teams,
  userTeams,
  teamProjects,
  statusFlows,
  statuses,
  epics,
  userStories,
  tasks,
  sprints,
  sprintBacklogItems,
  sprintMetrics,
  comments,
  activities,
  projectSettings,
  roles,
  permissions,
  userRoles,
  invitations,
  taskAssignments,
  taskLabels,
  taskAttachments,
  taskDependencies,
  projectLabels,
} from "./schema";

/**
 * Dados de exemplo para popular o banco
 */
const sampleTenants = [
  {
    name: "TechCorp Solutions",
    slug: "techcorp",
    description: "Empresa de desenvolvimento de software",
    avatarUrl: "https://example.com/techcorp-logo.png",
  },
  {
    name: "StartupXYZ",
    slug: "startupxyz",
    description: "Startup inovadora em tecnologia",
    avatarUrl: "https://example.com/startupxyz-logo.png",
  },
];

const sampleUsers = [
  {
    name: "João Silva",
    email: "joao@techcorp.com",
    passwordHash: "$2b$10$example.hash.here",
    isActive: true,
  },
  {
    name: "Maria Santos",
    email: "maria@techcorp.com",
    passwordHash: "$2b$10$example.hash.here",
    isActive: true,
  },
  {
    name: "Pedro Costa",
    email: "pedro@techcorp.com",
    passwordHash: "$2b$10$example.hash.here",
    isActive: true,
  },
  {
    name: "Ana Oliveira",
    email: "ana@startupxyz.com",
    passwordHash: "$2b$10$example.hash.here",
    isActive: true,
  },
  {
    name: "Carlos Ferreira",
    email: "carlos@startupxyz.com",
    passwordHash: "$2b$10$example.hash.here",
    isActive: true,
  },
];

const sampleProjects = [
  {
    name: "Sistema de Gestão",
    slug: "sistema-gestao",
    description: "Sistema completo de gestão empresarial",
    projectKey: "SG",
    status: "active",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-12-31"),
  },
  {
    name: "App Mobile",
    slug: "app-mobile",
    description: "Aplicativo mobile para clientes",
    projectKey: "AM",
    status: "active",
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-11-30"),
  },
];

const sampleTeams = [
  {
    name: "Equipe Frontend",
    description: "Desenvolvedores frontend especializados",
  },
  {
    name: "Equipe Backend",
    description: "Desenvolvedores backend e DevOps",
  },
  {
    name: "Equipe Mobile",
    description: "Desenvolvedores mobile nativos",
  },
];

const sampleStatusFlows = [
  {
    name: "Fluxo Kanban Padrão",
    entityType: "task",
    isDefault: true,
  },
  {
    name: "Fluxo de Histórias",
    entityType: "story",
    isDefault: true,
  },
  {
    name: "Fluxo de Épicos",
    entityType: "epic",
    isDefault: true,
  },
];

const sampleStatuses = [
  {
    name: "To Do",
    color: "#6B7280",
    order: 1,
    isInitial: true,
    isFinal: false,
  },
  {
    name: "In Progress",
    color: "#3B82F6",
    order: 2,
    isInitial: false,
    isFinal: false,
  },
  {
    name: "Review",
    color: "#F59E0B",
    order: 3,
    isInitial: false,
    isFinal: false,
  },
  { name: "Done", color: "#10B981", order: 4, isInitial: false, isFinal: true },
];

const sampleEpics = [
  {
    name: "Autenticação e Autorização",
    description: "Sistema completo de autenticação e controle de acesso",
    priority: 1,
    storyPoints: 13,
    startDate: new Date("2024-01-15"),
    dueDate: new Date("2024-03-15"),
  },
  {
    name: "Dashboard Principal",
    description: "Dashboard com métricas e indicadores principais",
    priority: 2,
    storyPoints: 8,
    startDate: new Date("2024-02-01"),
    dueDate: new Date("2024-04-01"),
  },
];

const sampleUserStories = [
  {
    title: "Como usuário, quero fazer login no sistema",
    description: "Implementar tela de login com validação de credenciais",
    acceptanceCriteria:
      "1. Campo de email e senha\n2. Validação de campos obrigatórios\n3. Mensagem de erro para credenciais inválidas\n4. Redirecionamento após login bem-sucedido",
    storyPoints: 3,
    priority: 1,
  },
  {
    title: "Como usuário, quero visualizar meu perfil",
    description: "Tela para visualizar e editar informações do perfil",
    acceptanceCriteria:
      "1. Exibir informações atuais\n2. Permitir edição de dados\n3. Upload de avatar\n4. Salvar alterações",
    storyPoints: 5,
    priority: 2,
  },
  {
    title: "Como usuário, quero criar um novo projeto",
    description: "Formulário para criação de projetos",
    acceptanceCriteria:
      "1. Campos: nome, descrição, chave do projeto\n2. Validação de campos\n3. Criação automática de fluxos padrão\n4. Redirecionamento para o projeto criado",
    storyPoints: 8,
    priority: 1,
  },
];

const sampleTasks = [
  {
    title: "Implementar tela de login",
    description: "Criar componente React para tela de login",
    priority: 1,
    estimatedHours: 4,
  },
  {
    title: "Configurar autenticação JWT",
    description: "Implementar middleware de autenticação JWT",
    priority: 1,
    estimatedHours: 6,
  },
  {
    title: "Criar componente de perfil",
    description: "Desenvolver componente para exibição e edição do perfil",
    priority: 2,
    estimatedHours: 8,
  },
  {
    title: "Implementar upload de avatar",
    description: "Sistema de upload e redimensionamento de imagens",
    priority: 3,
    estimatedHours: 6,
  },
];

const sampleSprints = [
  {
    name: "Sprint 1 - Fundação",
    goal: "Estabelecer base do projeto e autenticação",
    startDate: new Date("2024-01-15"),
    endDate: new Date("2024-01-29"),
    status: "active",
  },
  {
    name: "Sprint 2 - Perfil e Projetos",
    goal: "Implementar funcionalidades de perfil e criação de projetos",
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-02-15"),
    status: "planned",
  },
];

const sampleRoles = [
  {
    name: "owner",
    displayName: "Proprietário",
    description: "Acesso total ao tenant e todos os projetos",
    isSystemRole: true,
  },
  {
    name: "admin",
    displayName: "Administrador",
    description: "Administração de projetos e usuários",
    isSystemRole: true,
  },
  {
    name: "member",
    displayName: "Membro",
    description: "Acesso aos projetos atribuídos",
    isSystemRole: true,
  },
  {
    name: "viewer",
    displayName: "Visualizador",
    description: "Apenas visualização de projetos",
    isSystemRole: true,
  },
];

const sampleProjectLabels = [
  {
    name: "Bug",
    color: "#EF4444",
    description: "Problemas e correções",
  },
  {
    name: "Feature",
    color: "#10B981",
    description: "Novas funcionalidades",
  },
  {
    name: "Improvement",
    color: "#3B82F6",
    description: "Melhorias e otimizações",
  },
  {
    name: "Documentation",
    color: "#8B5CF6",
    description: "Documentação e guias",
  },
];

/**
 * Cria dados de exemplo se as tabelas estiverem vazias
 */
export async function seedDatabase() {
  try {
    console.log("🌱 Verificando se há dados de exemplo...");

    // Verifica se já existem tenants
    const existingTenants = await db.select().from(tenants);
    if (existingTenants.length === 0) {
      console.log("🌱 Criando tenants de exemplo...");
      for (const tenantData of sampleTenants) {
        await db.insert(tenants).values(tenantData);
      }
      console.log(`✅ ${sampleTenants.length} tenants de exemplo criados!`);
    } else {
      console.log(`ℹ️ Já existem ${existingTenants.length} tenants no banco`);
    }

    // Verifica se já existem usuários
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

    // Verifica se já existem projetos
    const existingProjects = await db.select().from(projects);
    if (existingProjects.length === 0) {
      console.log("🌱 Criando projetos de exemplo...");
      const tenantIds = await db.select({ id: tenants.id }).from(tenants);
      const userIds = await db.select({ id: users.id }).from(users);

      for (let i = 0; i < sampleProjects.length; i++) {
        const projectData = {
          ...sampleProjects[i],
          tenantId: tenantIds[i % tenantIds.length].id,
          ownerId: userIds[i % userIds.length].id,
        };
        await db.insert(projects).values(projectData);
      }
      console.log(`✅ ${sampleProjects.length} projetos de exemplo criados!`);
    } else {
      console.log(`ℹ️ Já existem ${existingProjects.length} projetos no banco`);
    }

    // Verifica se já existem equipes
    const existingTeams = await db.select().from(teams);
    if (existingTeams.length === 0) {
      console.log("🌱 Criando equipes de exemplo...");
      const tenantIds = await db.select({ id: tenants.id }).from(tenants);

      for (let i = 0; i < sampleTeams.length; i++) {
        const teamData = {
          ...sampleTeams[i],
          tenantId: tenantIds[i % tenantIds.length].id,
        };
        await db.insert(teams).values(teamData);
      }
      console.log(`✅ ${sampleTeams.length} equipes de exemplo criadas!`);
    } else {
      console.log(`ℹ️ Já existem ${existingTeams.length} equipes no banco`);
    }

    // Verifica se já existem fluxos de status
    const existingStatusFlows = await db.select().from(statusFlows);
    if (existingStatusFlows.length === 0) {
      console.log("🌱 Criando fluxos de status de exemplo...");
      const projectIds = await db.select({ id: projects.id }).from(projects);

      for (const flowData of sampleStatusFlows) {
        for (const projectId of projectIds) {
          await db.insert(statusFlows).values({
            ...flowData,
            projectId: projectId.id,
          });
        }
      }
      console.log(`✅ Fluxos de status de exemplo criados!`);
    } else {
      console.log(
        `ℹ️ Já existem ${existingStatusFlows.length} fluxos de status no banco`
      );
    }

    // Verifica se já existem status
    const existingStatuses = await db.select().from(statuses);
    if (existingStatuses.length === 0) {
      console.log("🌱 Criando status de exemplo...");
      const flowIds = await db.select({ id: statusFlows.id }).from(statusFlows);

      for (const statusData of sampleStatuses) {
        for (const flowId of flowIds) {
          await db.insert(statuses).values({
            ...statusData,
            flowId: flowId.id,
          });
        }
      }
      console.log(`✅ Status de exemplo criados!`);
    } else {
      console.log(`ℹ️ Já existem ${existingStatuses.length} status no banco`);
    }

    // Verifica se já existem épicos
    const existingEpics = await db.select().from(epics);
    if (existingEpics.length === 0) {
      console.log("🌱 Criando épicos de exemplo...");
      const projectIds = await db.select({ id: projects.id }).from(projects);
      const statusIds = await db.select({ id: statuses.id }).from(statuses);
      const userIds = await db.select({ id: users.id }).from(users);

      for (let i = 0; i < sampleEpics.length; i++) {
        const epicData = {
          ...sampleEpics[i],
          projectId: projectIds[i % projectIds.length].id,
          statusId: statusIds[i % statusIds.length].id,
          assigneeId: userIds[i % userIds.length].id,
        };
        await db.insert(epics).values(epicData);
      }
      console.log(`✅ ${sampleEpics.length} épicos de exemplo criados!`);
    } else {
      console.log(`ℹ️ Já existem ${existingEpics.length} épicos no banco`);
    }

    // Verifica se já existem histórias de usuário
    const existingUserStories = await db.select().from(userStories);
    if (existingUserStories.length === 0) {
      console.log("🌱 Criando histórias de usuário de exemplo...");
      const projectIds = await db.select({ id: projects.id }).from(projects);
      const statusIds = await db.select({ id: statuses.id }).from(statuses);
      const epicIds = await db.select({ id: epics.id }).from(epics);
      const userIds = await db.select({ id: users.id }).from(users);

      for (let i = 0; i < sampleUserStories.length; i++) {
        const storyData = {
          ...sampleUserStories[i],
          projectId: projectIds[i % projectIds.length].id,
          statusId: statusIds[i % statusIds.length].id,
          epicId: epicIds[i % epicIds.length]?.id,
          assigneeId: userIds[i % userIds.length].id,
        };
        await db.insert(userStories).values(storyData);
      }
      console.log(
        `✅ ${sampleUserStories.length} histórias de usuário de exemplo criadas!`
      );
    } else {
      console.log(
        `ℹ️ Já existem ${existingUserStories.length} histórias de usuário no banco`
      );
    }

    // Verifica se já existem tarefas
    const existingTasks = await db.select().from(tasks);
    if (existingTasks.length === 0) {
      console.log("🌱 Criando tarefas de exemplo...");
      const projectIds = await db.select({ id: projects.id }).from(projects);
      const statusIds = await db.select({ id: statuses.id }).from(statuses);
      const storyIds = await db
        .select({ id: userStories.id })
        .from(userStories);
      const userIds = await db.select({ id: users.id }).from(users);

      for (let i = 0; i < sampleTasks.length; i++) {
        const taskData = {
          ...sampleTasks[i],
          projectId: projectIds[i % projectIds.length].id,
          statusId: statusIds[i % statusIds.length].id,
          storyId: storyIds[i % storyIds.length]?.id,
          assigneeId: userIds[i % userIds.length].id,
          reporterId: userIds[(i + 1) % userIds.length].id,
        };
        await db.insert(tasks).values(taskData);
      }
      console.log(`✅ ${sampleTasks.length} tarefas de exemplo criadas!`);
    } else {
      console.log(`ℹ️ Já existem ${existingTasks.length} tarefas no banco`);
    }

    // Verifica se já existem sprints
    const existingSprints = await db.select().from(sprints);
    if (existingSprints.length === 0) {
      console.log("🌱 Criando sprints de exemplo...");
      const projectIds = await db.select({ id: projects.id }).from(projects);

      for (let i = 0; i < sampleSprints.length; i++) {
        const sprintData = {
          ...sampleSprints[i],
          projectId: projectIds[i % projectIds.length].id,
        };
        await db.insert(sprints).values(sprintData);
      }
      console.log(`✅ ${sampleSprints.length} sprints de exemplo criados!`);
    } else {
      console.log(`ℹ️ Já existem ${existingSprints.length} sprints no banco`);
    }

    // Verifica se já existem papéis
    const existingRoles = await db.select().from(roles);
    if (existingRoles.length === 0) {
      console.log("🌱 Criando papéis de exemplo...");
      const tenantIds = await db.select({ id: tenants.id }).from(tenants);

      for (const roleData of sampleRoles) {
        for (const tenantId of tenantIds) {
          await db.insert(roles).values({
            ...roleData,
            tenantId: tenantId.id,
          });
        }
      }
      console.log(`✅ Papéis de exemplo criados!`);
    } else {
      console.log(`ℹ️ Já existem ${existingRoles.length} papéis no banco`);
    }

    // Verifica se já existem etiquetas de projeto
    const existingProjectLabels = await db.select().from(projectLabels);
    if (existingProjectLabels.length === 0) {
      console.log("🌱 Criando etiquetas de projeto de exemplo...");
      const projectIds = await db.select({ id: projects.id }).from(projects);

      for (const labelData of sampleProjectLabels) {
        for (const projectId of projectIds) {
          await db.insert(projectLabels).values({
            ...labelData,
            projectId: projectId.id,
          });
        }
      }
      console.log(`✅ Etiquetas de projeto de exemplo criadas!`);
    } else {
      console.log(
        `ℹ️ Já existem ${existingProjectLabels.length} etiquetas de projeto no banco`
      );
    }
    console.log("🎉 Seed concluído com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao verificar dados de exemplo:", error);
    throw error;
  }
}
