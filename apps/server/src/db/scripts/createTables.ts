import { db_script as db } from "./connection";
import { sql } from "drizzle-orm";

/**
 * Cria os status padrão para todos os projetos existentes
 */
async function createDefaultStatuses() {
  try {
    console.log("🌱 Criando status padrão para projetos existentes...");

    // Buscar todos os projetos
    const projects = await db.execute(sql`SELECT id FROM projects`);

    if (projects.length === 0) {
      console.log(
        "ℹ️ Nenhum projeto encontrado. Status padrão serão criados quando projetos forem adicionados."
      );
      return;
    }

    // Para cada projeto, criar fluxo de status padrão se não existir
    for (const project of projects) {
      const projectId = project.id;

      // Verificar se já existe um fluxo padrão para este projeto
      const existingFlow = await db.execute(sql`
        SELECT id FROM status_flows 
        WHERE project_id = ${projectId} 
        AND entity_type = 'task' 
        AND is_default = true
      `);

      if (existingFlow.length === 0) {
        // Criar fluxo de status padrão
        const flowResult = await db.execute(sql`
          INSERT INTO status_flows (id, project_id, name, entity_type, is_default, created_at)
          VALUES (gen_random_uuid(), ${projectId}, 'Fluxo Kanban Padrão', 'task', true, CURRENT_TIMESTAMP)
          RETURNING id
        `);

        const flowId = flowResult[0].id;
        console.log(`✅ Fluxo de status criado para projeto ${projectId}`);

        // Criar status padrão para este fluxo
        const defaultStatuses = [
          {
            name: "TODO",
            color: "#6B7280",
            order: 1,
            isFinal: false,
            isInitial: true,
          },
          {
            name: "IN PROGRESS",
            color: "#3B82F6",
            order: 2,
            isFinal: false,
            isInitial: false,
          },
          {
            name: "REVIEW",
            color: "#F59E0B",
            order: 3,
            isFinal: false,
            isInitial: false,
          },
          {
            name: "DONE",
            color: "#10B981",
            order: 4,
            isFinal: true,
            isInitial: false,
          },
          {
            name: "CANCELLED",
            color: "#EF4444",
            order: 5,
            isFinal: true,
            isInitial: false,
          },
        ];

        for (const status of defaultStatuses) {
          await db.execute(sql`
            INSERT INTO statuses (id, flow_id, name, color, "order", is_final, is_initial)
            VALUES (
              gen_random_uuid(), 
              ${flowId}, 
              ${status.name}, 
              ${status.color}, 
              ${status.order}, 
              ${status.isFinal}, 
              ${status.isInitial}
            )
          `);
        }

        console.log(`✅ Status padrão criados para projeto ${projectId}`);
      } else {
        console.log(`ℹ️ Fluxo de status já existe para projeto ${projectId}`);
      }
    }

    console.log("✅ Status padrão criados com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao criar status padrão:", error);
    throw error;
  }
}

/**
 * Script para criar as tabelas do banco de dados baseado no novo diagrama ER
 */
export async function createTables() {
  try {
    console.log("🔄 Criando tabelas do banco de dados...");

    // Cria a tabela tenants
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS tenants (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        avatar_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Tabela 'tenants' criada com sucesso!");

    // Cria a tabela users
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        avatar_url VARCHAR(500),
        is_active BOOLEAN DEFAULT TRUE NOT NULL,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Tabela 'users' criada com sucesso!");

    // Cria a tabela user_tenants
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS user_tenants (
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        status VARCHAR(20) DEFAULT 'active' NOT NULL,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        PRIMARY KEY (user_id, tenant_id)
      );
    `);
    console.log("✅ Tabela 'user_tenants' criada com sucesso!");

    // Cria a tabela projects
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(100) NOT NULL,
        description TEXT,
        project_key VARCHAR(10) NOT NULL,
        status VARCHAR(20) DEFAULT 'active' NOT NULL,
        owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        start_date TIMESTAMP,
        end_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(tenant_id, slug)
      );
    `);
    console.log("✅ Tabela 'projects' criada com sucesso!");

    // Cria a tabela teams
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS teams (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Tabela 'teams' criada com sucesso!");

    // Cria a tabela user_teams
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS user_teams (
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
        role VARCHAR(20) DEFAULT 'member' NOT NULL,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        PRIMARY KEY (user_id, team_id)
      );
    `);
    console.log("✅ Tabela 'user_teams' criada com sucesso!");

    // Cria a tabela team_projects
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS team_projects (
        team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
        project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        PRIMARY KEY (team_id, project_id)
      );
    `);
    console.log("✅ Tabela 'team_projects' criada com sucesso!");

    // Cria a tabela status_flows
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS status_flows (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        entity_type VARCHAR(20) NOT NULL,
        is_default BOOLEAN DEFAULT FALSE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Tabela 'status_flows' criada com sucesso!");

    // Cria a tabela statuses
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS statuses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        flow_id UUID NOT NULL REFERENCES status_flows(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        color VARCHAR(7) NOT NULL,
        "order" INTEGER NOT NULL,
        is_final BOOLEAN DEFAULT FALSE NOT NULL,
        is_initial BOOLEAN DEFAULT FALSE NOT NULL
      );
    `);
    console.log("✅ Tabela 'statuses' criada com sucesso!");

    // Cria a tabela epics
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS epics (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        status_id UUID NOT NULL REFERENCES statuses(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        priority INTEGER DEFAULT 3 NOT NULL,
        story_points INTEGER,
        assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
        start_date TIMESTAMP,
        due_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Tabela 'epics' criada com sucesso!");

    // Cria a tabela user_stories
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS user_stories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        epic_id UUID REFERENCES epics(id) ON DELETE SET NULL,
        project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        status_id UUID NOT NULL REFERENCES statuses(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        acceptance_criteria TEXT,
        story_points INTEGER,
        priority INTEGER DEFAULT 3 NOT NULL,
        assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
        due_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Tabela 'user_stories' criada com sucesso!");

    // Cria a tabela sprints
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS sprints (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        goal TEXT,
        start_date DATE,
        end_date DATE,
        status VARCHAR(20) DEFAULT 'planned' NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Tabela 'sprints' criada com sucesso!");

    // Cria a tabela tasks
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS tasks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        story_id UUID REFERENCES user_stories(id) ON DELETE SET NULL,
        project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        sprint_id UUID REFERENCES sprints(id) ON DELETE SET NULL,
        status_id UUID NOT NULL REFERENCES statuses(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        priority INTEGER DEFAULT 3 NOT NULL,
        estimated_hours INTEGER,
        actual_hours INTEGER,
        assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
        reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        due_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Tabela 'tasks' criada com sucesso!");

    // Cria a tabela task_assignments
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS task_assignments (
        task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        unassigned_at TIMESTAMP,
        PRIMARY KEY (task_id, user_id)
      );
    `);
    console.log("✅ Tabela 'task_assignments' criada com sucesso!");

    // Cria a tabela sprint_backlog_items
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS sprint_backlog_items (
        sprint_id UUID NOT NULL REFERENCES sprints(id) ON DELETE CASCADE,
        story_id UUID NOT NULL REFERENCES user_stories(id) ON DELETE CASCADE,
        "order" INTEGER NOT NULL,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        PRIMARY KEY (sprint_id, story_id)
      );
    `);
    console.log("✅ Tabela 'sprint_backlog_items' criada com sucesso!");

    // Cria a tabela comments
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS comments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        content TEXT NOT NULL,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        entity_type VARCHAR(20) NOT NULL,
        entity_id UUID NOT NULL,
        parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Tabela 'comments' criada com sucesso!");

    // Cria a tabela activities
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS activities (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        action VARCHAR(50) NOT NULL,
        entity_type VARCHAR(20) NOT NULL,
        entity_id UUID NOT NULL,
        old_values JSONB,
        new_values JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Tabela 'activities' criada com sucesso!");

    // Cria a tabela sessions
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token_hash VARCHAR(255) NOT NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Tabela 'sessions' criada com sucesso!");

    // Cria a tabela project_settings
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS project_settings (
        project_id UUID PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
        sprint_length_days INTEGER DEFAULT 14,
        enable_time_tracking BOOLEAN DEFAULT TRUE,
        default_story_points VARCHAR(20) DEFAULT 'fibonacci',
        notification_settings JSONB DEFAULT '{}',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Tabela 'project_settings' criada com sucesso!");

    // Cria a tabela sprint_metrics
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS sprint_metrics (
        sprint_id UUID PRIMARY KEY REFERENCES sprints(id) ON DELETE CASCADE,
        planned_points INTEGER DEFAULT 0,
        completed_points INTEGER DEFAULT 0,
        total_tasks INTEGER DEFAULT 0,
        completed_tasks INTEGER DEFAULT 0,
        velocity DECIMAL(5,2),
        calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Tabela 'sprint_metrics' criada com sucesso!");

    // Cria a tabela roles
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS roles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        name VARCHAR(50) NOT NULL,
        display_name VARCHAR(100) NOT NULL,
        description TEXT,
        is_system_role BOOLEAN DEFAULT FALSE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Tabela 'roles' criada com sucesso!");

    // Cria a tabela permissions
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS permissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
        resource VARCHAR(50) NOT NULL,
        action VARCHAR(50) NOT NULL,
        conditions JSONB
      );
    `);
    console.log("✅ Tabela 'permissions' criada com sucesso!");

    // Cria a tabela user_roles (CORRIGIDA - sem composite key)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS user_roles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
        project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
        assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        UNIQUE(user_id, tenant_id, role_id, project_id)
      );
    `);
    console.log("✅ Tabela 'user_roles' criada com sucesso!");

    // Cria a tabela invitations
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS invitations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        invited_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        email VARCHAR(255) NOT NULL,
        role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
        token VARCHAR(255) UNIQUE NOT NULL,
        status VARCHAR(20) DEFAULT 'pending' NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        accepted_at TIMESTAMP
      );
    `);
    console.log("✅ Tabela 'invitations' criada com sucesso!");

    // Cria a tabela project_labels
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS project_labels (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        color VARCHAR(7) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Tabela 'project_labels' criada com sucesso!");

    // Cria a tabela task_labels
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS task_labels (
        task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
        label_id UUID NOT NULL REFERENCES project_labels(id) ON DELETE CASCADE,
        PRIMARY KEY (task_id, label_id)
      );
    `);
    console.log("✅ Tabela 'task_labels' criada com sucesso!");

    // Cria a tabela task_attachments
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS task_attachments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
        uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        filename VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        file_size INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Tabela 'task_attachments' criada com sucesso!");

    // Cria a tabela task_dependencies
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS task_dependencies (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
        depends_on_task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
        dependency_type VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CHECK (task_id != depends_on_task_id)
      );
    `);
    console.log("✅ Tabela 'task_dependencies' criada com sucesso!");

    // Criar status padrão para projetos existentes
    await createDefaultStatuses();
  } catch (error) {
    console.error("❌ Erro ao criar tabelas:", error);
    throw error;
  }
}

/**
 * Script para executar a criação das tabelas
 */
async function main() {
  try {
    await createTables();
    console.log("✅ Script de criação de tabelas executado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao executar script:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Executa o script
main();
