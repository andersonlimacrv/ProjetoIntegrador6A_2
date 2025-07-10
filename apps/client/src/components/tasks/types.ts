import type { Task, Project, Status, Sprint } from "@packages/shared";

export interface TaskWithDetails extends Task {
  assigneeName?: string;
  assigneeAvatar?: string;
  reporterName?: string;
  reporterAvatar?: string;
  storyTitle?: string;
  epicName?: string;
  projectName?: string;
}

// Tipos para filtros de tarefas
export interface TaskFilters {
  search: string;
  status: string;
  priority: string;
  assignee: string;
}

// Tipos para ordenação
export interface TaskSort {
  field: keyof Task;
  direction: "asc" | "desc";
}

// Tipos para estatísticas de tarefas
export interface TaskStats {
  total: number;
  totalEstimatedHours: number;
  totalActualHours: number;
  statusCounts: Record<string, number>;
}

// Tipos para props dos componentes
export interface TaskListProps {
  tasks: TaskWithDetails[];
  loading: boolean;
  projects: Project[];
  sprints: Sprint[];
  statuses: Status[];
  members: any[];
  onView?: (task: TaskWithDetails) => void;
  onEdit?: (task: TaskWithDetails) => void;
  onDelete?: (taskId: string) => void;
}

export interface KanbanBoardProps {
  tasks: TaskWithDetails[];
  statuses: Status[];
  loading: boolean;
  onView?: (task: TaskWithDetails) => void;
  onEdit?: (task: TaskWithDetails) => void;
  onDelete?: (taskId: string) => void;
  onCreateTask?: (statusId: string) => void;
  projects: Project[];
  sprints: Sprint[];
}

export interface TaskFiltersProps {
  projects: Project[];
  sprints: Sprint[];
  filters: TaskFilters;
  setFilters: (filters: TaskFilters) => void;
  selectedProject: string;
  setSelectedProject: (project: string) => void;
  selectedSprint: string;
  setSelectedSprint: (sprint: string) => void;
}

export interface TaskStatsProps {
  stats: TaskStats;
  statuses: Status[];
}

// Tipos para ações de tarefas
export type TaskAction = "view" | "edit" | "delete" | "create";

// Tipos para modos de visualização
export type ViewMode = "list" | "kanban";

// Tipos para estados de carregamento
export interface LoadingState {
  tasks: boolean;
  projects: boolean;
  sprints: boolean;
  statuses: boolean;
}
