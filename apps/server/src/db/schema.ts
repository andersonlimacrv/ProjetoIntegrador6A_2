import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
  boolean,
  integer,
  date,
  json,
  decimal,
  primaryKey,
} from "drizzle-orm/pg-core";
import { InferModel } from "drizzle-orm";
import { relations } from "drizzle-orm";

/* esqueminha */

// Tabelas principais
export const tenants = pgTable("tenants", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 100 }).unique().notNull(),
  description: text("description"),
  avatarUrl: varchar("avatar_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  avatarUrl: varchar("avatar_url", { length: 500 }),
  isActive: boolean("is_active").default(true).notNull(),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const user_tenants = pgTable(
  "user_tenants",
  {
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    tenantId: uuid("tenant_id")
      .references(() => tenants.id)
      .notNull(),
    status: varchar("status", { length: 20 }).default("active").notNull(), // active, inactive, pending
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.tenantId] }),
  })
);

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id")
    .references(() => tenants.id)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull(),
  description: text("description"),
  projectKey: varchar("project_key", { length: 10 }).notNull(),
  status: varchar("status", { length: 20 }).default("active").notNull(), // active, archived, completed
  ownerId: uuid("owner_id")
    .references(() => users.id)
    .notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const teams = pgTable("teams", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id")
    .references(() => tenants.id)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const user_teams = pgTable(
  "user_teams",
  {
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    teamId: uuid("team_id")
      .references(() => teams.id)
      .notNull(),
    role: varchar("role", { length: 20 }).default("member").notNull(), // leader, member
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.teamId] }),
  })
);

export const team_projects = pgTable(
  "team_projects",
  {
    teamId: uuid("team_id")
      .references(() => teams.id)
      .notNull(),
    projectId: uuid("project_id")
      .references(() => projects.id)
      .notNull(),
    assignedAt: timestamp("assigned_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.teamId, table.projectId] }),
  })
);

export const status_flows = pgTable("status_flows", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .references(() => projects.id)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  entityType: varchar("entity_type", { length: 20 }).notNull(), // task, story, epic
  isDefault: boolean("is_default").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const statuses = pgTable("statuses", {
  id: uuid("id").primaryKey().defaultRandom(),
  flowId: uuid("flow_id")
    .references(() => status_flows.id)
    .notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  color: varchar("color", { length: 7 }).notNull(), // hex color
  order: integer("order").notNull(),
  isFinal: boolean("is_final").default(false).notNull(),
  isInitial: boolean("is_initial").default(false).notNull(),
});

export const epics = pgTable("epics", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .references(() => projects.id)
    .notNull(),
  statusId: uuid("status_id")
    .references(() => statuses.id)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  priority: integer("priority").default(3).notNull(), // 1-5
  storyPoints: integer("story_points"),
  assigneeId: uuid("assignee_id").references(() => users.id),
  startDate: timestamp("start_date"),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const user_stories = pgTable("user_stories", {
  id: uuid("id").primaryKey().defaultRandom(),
  epicId: uuid("epic_id").references(() => epics.id),
  projectId: uuid("project_id")
    .references(() => projects.id)
    .notNull(),
  statusId: uuid("status_id")
    .references(() => statuses.id)
    .notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  acceptanceCriteria: text("acceptance_criteria"),
  storyPoints: integer("story_points"),
  priority: integer("priority").default(3).notNull(), // 1-5
  assigneeId: uuid("assignee_id").references(() => users.id),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  storyId: uuid("story_id").references(() => user_stories.id),
  projectId: uuid("project_id")
    .references(() => projects.id)
    .notNull(),
  statusId: uuid("status_id")
    .references(() => statuses.id)
    .notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  priority: integer("priority").default(3).notNull(), // 1-5
  estimatedHours: integer("estimated_hours"),
  actualHours: integer("actual_hours"),
  assigneeId: uuid("assignee_id").references(() => users.id),
  reporterId: uuid("reporter_id")
    .references(() => users.id)
    .notNull(),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const task_assignments = pgTable(
  "task_assignments",
  {
    taskId: uuid("task_id")
      .references(() => tasks.id)
      .notNull(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    assignedAt: timestamp("assigned_at").defaultNow().notNull(),
    unassignedAt: timestamp("unassigned_at"),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.taskId, table.userId] }),
  })
);

export const sprints = pgTable("sprints", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .references(() => projects.id)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  goal: text("goal"),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  status: varchar("status", { length: 20 }).default("planned").notNull(), // planned, active, completed, cancelled
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sprint_backlog_items = pgTable(
  "sprint_backlog_items",
  {
    sprintId: uuid("sprint_id")
      .references(() => sprints.id)
      .notNull(),
    storyId: uuid("story_id")
      .references(() => user_stories.id)
      .notNull(),
    order: integer("order").notNull(),
    addedAt: timestamp("added_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.sprintId, table.storyId] }),
  })
);

export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  entityType: varchar("entity_type", { length: 20 }).notNull(), // task, story, epic
  entityId: uuid("entity_id").notNull(),
  parentId: uuid("parent_id").references((): any => comments.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const activities = pgTable("activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  tenantId: uuid("tenant_id")
    .references(() => tenants.id)
    .notNull(),
  action: varchar("action", { length: 50 }).notNull(), // create, update, delete, assign
  entityType: varchar("entity_type", { length: 20 }).notNull(), // task, story, epic, project
  entityId: uuid("entity_id").notNull(),
  oldValues: json("old_values"),
  newValues: json("new_values"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  tokenHash: varchar("token_hash", { length: 255 }).notNull(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const project_settings = pgTable("project_settings", {
  projectId: uuid("project_id")
    .references(() => projects.id)
    .primaryKey(),
  sprintLengthDays: integer("sprint_length_days").default(14).notNull(),
  enableTimeTracking: boolean("enable_time_tracking").default(true).notNull(),
  defaultStoryPoints: varchar("default_story_points", { length: 50 }).default(
    "1,2,3,5,8,13"
  ),
  notificationSettings: json("notification_settings"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sprint_metrics = pgTable("sprint_metrics", {
  sprintId: uuid("sprint_id")
    .references(() => sprints.id)
    .primaryKey(),
  plannedPoints: integer("planned_points").default(0).notNull(),
  completedPoints: integer("completed_points").default(0).notNull(),
  totalTasks: integer("total_tasks").default(0).notNull(),
  completedTasks: integer("completed_tasks").default(0).notNull(),
  velocity: decimal("velocity", { precision: 5, scale: 2 }),
  calculatedAt: timestamp("calculated_at").defaultNow().notNull(),
});

export const roles = pgTable("roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id")
    .references(() => tenants.id)
    .notNull(),
  name: varchar("name", { length: 50 }).notNull(), // owner, admin, member, viewer
  displayName: varchar("display_name", { length: 100 }).notNull(),
  description: text("description"),
  isSystemRole: boolean("is_system_role").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const permissions = pgTable("permissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  roleId: uuid("role_id")
    .references(() => roles.id)
    .notNull(),
  resource: varchar("resource", { length: 50 }).notNull(), // project, task, story, epic, user
  action: varchar("action", { length: 50 }).notNull(), // create, read, update, delete, assign
  conditions: json("conditions"),
});

export const user_roles = pgTable(
  "user_roles",
  {
    userTenantId: uuid("user_tenant_id").notNull(), // Composite key reference
    roleId: uuid("role_id")
      .references(() => roles.id)
      .notNull(),
    projectId: uuid("project_id").references(() => projects.id),
    assignedAt: timestamp("assigned_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userTenantId, table.roleId] }),
  })
);

export const invitations = pgTable("invitations", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id")
    .references(() => tenants.id)
    .notNull(),
  invitedBy: uuid("invited_by")
    .references(() => users.id)
    .notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  roleId: uuid("role_id")
    .references(() => roles.id)
    .notNull(),
  token: varchar("token", { length: 255 }).unique().notNull(),
  status: varchar("status", { length: 20 }).default("pending").notNull(), // pending, accepted, expired, cancelled
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  acceptedAt: timestamp("accepted_at"),
});

export const project_labels = pgTable("project_labels", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .references(() => projects.id)
    .notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  color: varchar("color", { length: 7 }).notNull(), // hex color
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const task_labels = pgTable(
  "task_labels",
  {
    taskId: uuid("task_id")
      .references(() => tasks.id)
      .notNull(),
    labelId: uuid("label_id")
      .references(() => project_labels.id)
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.taskId, table.labelId] }),
  })
);

export const task_attachments = pgTable("task_attachments", {
  id: uuid("id").primaryKey().defaultRandom(),
  taskId: uuid("task_id")
    .references(() => tasks.id)
    .notNull(),
  uploadedBy: uuid("uploaded_by")
    .references(() => users.id)
    .notNull(),
  filename: varchar("filename", { length: 255 }).notNull(),
  filePath: varchar("file_path", { length: 500 }).notNull(),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  fileSize: integer("file_size").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const task_dependencies = pgTable("task_dependencies", {
  id: uuid("id").primaryKey().defaultRandom(),
  taskId: uuid("task_id")
    .references(() => tasks.id)
    .notNull(),
  dependsOnTaskId: uuid("depends_on_task_id")
    .references(() => tasks.id)
    .notNull(),
  dependencyType: varchar("dependency_type", { length: 20 }).notNull(), // blocks, depends_on
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relacionamentos
export const tenantsRelations = relations(tenants, ({ many }) => ({
  projects: many(projects),
  users: many(user_tenants),
  teams: many(teams),
  roles: many(roles),
  invitations: many(invitations),
  activities: many(activities),
}));

export const usersRelations = relations(users, ({ many }) => ({
  user_tenants: many(user_tenants),
  user_teams: many(user_teams),
  projects: many(projects),
  epics: many(epics),
  user_stories: many(user_stories),
  tasks: many(tasks),
  task_assignments: many(task_assignments),
  comments: many(comments),
  activities: many(activities),
  sessions: many(sessions),
  task_attachments: many(task_attachments),
  invitations: many(invitations),
}));

export const user_tenantsRelations = relations(
  user_tenants,
  ({ one, many }) => ({
    user: one(users, {
      fields: [user_tenants.userId],
      references: [users.id],
    }),
    tenant: one(tenants, {
      fields: [user_tenants.tenantId],
      references: [tenants.id],
    }),
    user_roles: many(user_roles),
  })
);

export const projectsRelations = relations(projects, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [projects.tenantId],
    references: [tenants.id],
  }),
  owner: one(users, {
    fields: [projects.ownerId],
    references: [users.id],
  }),
  epics: many(epics),
  user_stories: many(user_stories),
  tasks: many(tasks),
  sprints: many(sprints),
  status_flows: many(status_flows),
  project_settings: many(project_settings),
  team_projects: many(team_projects),
  project_labels: many(project_labels),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [teams.tenantId],
    references: [tenants.id],
  }),
  user_teams: many(user_teams),
  team_projects: many(team_projects),
}));

export const user_teamsRelations = relations(user_teams, ({ one }) => ({
  user: one(users, {
    fields: [user_teams.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [user_teams.teamId],
    references: [teams.id],
  }),
}));

export const team_projectsRelations = relations(team_projects, ({ one }) => ({
  team: one(teams, {
    fields: [team_projects.teamId],
    references: [teams.id],
  }),
  project: one(projects, {
    fields: [team_projects.projectId],
    references: [projects.id],
  }),
}));

export const status_flowsRelations = relations(
  status_flows,
  ({ one, many }) => ({
    project: one(projects, {
      fields: [status_flows.projectId],
      references: [projects.id],
    }),
    statuses: many(statuses),
  })
);

export const statusesRelations = relations(statuses, ({ one, many }) => ({
  flow: one(status_flows, {
    fields: [statuses.flowId],
    references: [status_flows.id],
  }),
  epics: many(epics),
  user_stories: many(user_stories),
  tasks: many(tasks),
}));

export const epicsRelations = relations(epics, ({ one, many }) => ({
  project: one(projects, {
    fields: [epics.projectId],
    references: [projects.id],
  }),
  status: one(statuses, {
    fields: [epics.statusId],
    references: [statuses.id],
  }),
  assignee: one(users, {
    fields: [epics.assigneeId],
    references: [users.id],
  }),
  user_stories: many(user_stories),
}));

export const user_storiesRelations = relations(
  user_stories,
  ({ one, many }) => ({
    epic: one(epics, {
      fields: [user_stories.epicId],
      references: [epics.id],
    }),
    project: one(projects, {
      fields: [user_stories.projectId],
      references: [projects.id],
    }),
    status: one(statuses, {
      fields: [user_stories.statusId],
      references: [statuses.id],
    }),
    assignee: one(users, {
      fields: [user_stories.assigneeId],
      references: [users.id],
    }),
    tasks: many(tasks),
    sprint_backlog_items: many(sprint_backlog_items),
  })
);

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  story: one(user_stories, {
    fields: [tasks.storyId],
    references: [user_stories.id],
  }),
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  status: one(statuses, {
    fields: [tasks.statusId],
    references: [statuses.id],
  }),
  assignee: one(users, {
    fields: [tasks.assigneeId],
    references: [users.id],
  }),
  reporter: one(users, {
    fields: [tasks.reporterId],
    references: [users.id],
  }),
  task_assignments: many(task_assignments),
  task_labels: many(task_labels),
  task_attachments: many(task_attachments),
  task_dependencies: many(task_dependencies),
  comments: many(comments),
}));

export const task_assignmentsRelations = relations(
  task_assignments,
  ({ one }) => ({
    task: one(tasks, {
      fields: [task_assignments.taskId],
      references: [tasks.id],
    }),
    user: one(users, {
      fields: [task_assignments.userId],
      references: [users.id],
    }),
  })
);

export const sprintsRelations = relations(sprints, ({ one, many }) => ({
  project: one(projects, {
    fields: [sprints.projectId],
    references: [projects.id],
  }),
  sprint_backlog_items: many(sprint_backlog_items),
  sprint_metrics: many(sprint_metrics),
}));

export const sprint_backlog_itemsRelations = relations(
  sprint_backlog_items,
  ({ one }) => ({
    sprint: one(sprints, {
      fields: [sprint_backlog_items.sprintId],
      references: [sprints.id],
    }),
    story: one(user_stories, {
      fields: [sprint_backlog_items.storyId],
      references: [user_stories.id],
    }),
  })
);

export const commentsRelations = relations(comments, ({ one, many }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
  }),
  replies: many(comments),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  user: one(users, {
    fields: [activities.userId],
    references: [users.id],
  }),
  tenant: one(tenants, {
    fields: [activities.tenantId],
    references: [tenants.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const project_settingsRelations = relations(
  project_settings,
  ({ one }) => ({
    project: one(projects, {
      fields: [project_settings.projectId],
      references: [projects.id],
    }),
  })
);

export const sprint_metricsRelations = relations(sprint_metrics, ({ one }) => ({
  sprint: one(sprints, {
    fields: [sprint_metrics.sprintId],
    references: [sprints.id],
  }),
}));

export const rolesRelations = relations(roles, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [roles.tenantId],
    references: [tenants.id],
  }),
  permissions: many(permissions),
  user_roles: many(user_roles),
  invitations: many(invitations),
}));

export const permissionsRelations = relations(permissions, ({ one }) => ({
  role: one(roles, {
    fields: [permissions.roleId],
    references: [roles.id],
  }),
}));

export const user_rolesRelations = relations(user_roles, ({ one }) => ({
  role: one(roles, {
    fields: [user_roles.roleId],
    references: [roles.id],
  }),
  project: one(projects, {
    fields: [user_roles.projectId],
    references: [projects.id],
  }),
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
  tenant: one(tenants, {
    fields: [invitations.tenantId],
    references: [tenants.id],
  }),
  invitedBy: one(users, {
    fields: [invitations.invitedBy],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [invitations.roleId],
    references: [roles.id],
  }),
}));

export const project_labelsRelations = relations(
  project_labels,
  ({ one, many }) => ({
    project: one(projects, {
      fields: [project_labels.projectId],
      references: [projects.id],
    }),
    task_labels: many(task_labels),
  })
);

export const task_labelsRelations = relations(task_labels, ({ one }) => ({
  task: one(tasks, {
    fields: [task_labels.taskId],
    references: [tasks.id],
  }),
  label: one(project_labels, {
    fields: [task_labels.labelId],
    references: [project_labels.id],
  }),
}));

export const task_attachmentsRelations = relations(
  task_attachments,
  ({ one }) => ({
    task: one(tasks, {
      fields: [task_attachments.taskId],
      references: [tasks.id],
    }),
    uploadedBy: one(users, {
      fields: [task_attachments.uploadedBy],
      references: [users.id],
    }),
  })
);

export const task_dependenciesRelations = relations(
  task_dependencies,
  ({ one }) => ({
    task: one(tasks, {
      fields: [task_dependencies.taskId],
      references: [tasks.id],
    }),
    dependsOnTask: one(tasks, {
      fields: [task_dependencies.dependsOnTaskId],
      references: [tasks.id],
    }),
  })
);

// Tipos TypeScript
export type Tenant = InferModel<typeof tenants>;
export type NewTenant = InferModel<typeof tenants, "insert">;

export type User = InferModel<typeof users>;
export type NewUser = InferModel<typeof users, "insert">;

export type UserTenant = InferModel<typeof user_tenants>;
export type NewUserTenant = InferModel<typeof user_tenants, "insert">;

export type Project = InferModel<typeof projects>;
export type NewProject = InferModel<typeof projects, "insert">;

export type Team = InferModel<typeof teams>;
export type NewTeam = InferModel<typeof teams, "insert">;

export type UserTeam = InferModel<typeof user_teams>;
export type NewUserTeam = InferModel<typeof user_teams, "insert">;

export type TeamProject = InferModel<typeof team_projects>;
export type NewTeamProject = InferModel<typeof team_projects, "insert">;

export type StatusFlow = InferModel<typeof status_flows>;
export type NewStatusFlow = InferModel<typeof status_flows, "insert">;

export type Status = InferModel<typeof statuses>;
export type NewStatus = InferModel<typeof statuses, "insert">;

export type Epic = InferModel<typeof epics>;
export type NewEpic = InferModel<typeof epics, "insert">;

export type UserStory = InferModel<typeof user_stories>;
export type NewUserStory = InferModel<typeof user_stories, "insert">;

export type Task = InferModel<typeof tasks>;
export type NewTask = InferModel<typeof tasks, "insert">;

export type TaskAssignment = InferModel<typeof task_assignments>;
export type NewTaskAssignment = InferModel<typeof task_assignments, "insert">;

export type Sprint = InferModel<typeof sprints>;
export type NewSprint = InferModel<typeof sprints, "insert">;

export type SprintBacklogItem = InferModel<typeof sprint_backlog_items>;
export type NewSprintBacklogItem = InferModel<
  typeof sprint_backlog_items,
  "insert"
>;

export type Comment = InferModel<typeof comments>;
export type NewComment = InferModel<typeof comments, "insert">;

export type Activity = InferModel<typeof activities>;
export type NewActivity = InferModel<typeof activities, "insert">;

export type Session = InferModel<typeof sessions>;
export type NewSession = InferModel<typeof sessions, "insert">;

export type ProjectSetting = InferModel<typeof project_settings>;
export type NewProjectSetting = InferModel<typeof project_settings, "insert">;

export type SprintMetric = InferModel<typeof sprint_metrics>;
export type NewSprintMetric = InferModel<typeof sprint_metrics, "insert">;

export type Role = InferModel<typeof roles>;
export type NewRole = InferModel<typeof roles, "insert">;

export type Permission = InferModel<typeof permissions>;
export type NewPermission = InferModel<typeof permissions, "insert">;

export type UserRole = InferModel<typeof user_roles>;
export type NewUserRole = InferModel<typeof user_roles, "insert">;

export type Invitation = InferModel<typeof invitations>;
export type NewInvitation = InferModel<typeof invitations, "insert">;

export type ProjectLabel = InferModel<typeof project_labels>;
export type NewProjectLabel = InferModel<typeof project_labels, "insert">;

export type TaskLabel = InferModel<typeof task_labels>;
export type NewTaskLabel = InferModel<typeof task_labels, "insert">;

export type TaskAttachment = InferModel<typeof task_attachments>;
export type NewTaskAttachment = InferModel<typeof task_attachments, "insert">;

export type TaskDependency = InferModel<typeof task_dependencies>;
export type NewTaskDependency = InferModel<typeof task_dependencies, "insert">;
