import { useState, useEffect } from "react";
import { tasksApi } from "@/services/domains/tasksApi";
import { projectsApi } from "@/services/domains/projectsApi";
import { sprintsApi } from "@/services/domains/sprintsApi";
import { statusesApi } from "@/services/domains/statusesApi";
import TaskList from "@/components/tasks/TaskList";
import KanbanBoard from "@/components/tasks/KanbanBoard";
import TaskFilters from "@/components/tasks/TaskFilters";
import TaskStats from "@/components/tasks/TaskStats";
import TeamLegend from "@/components/tasks/TeamLegend";
import TeamMembers from "@/components/tasks/TeamMembers";
import { useToast } from "@/contexts/toast-context";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { List, Grid3X3, Eye } from "lucide-react";
import { Link } from "react-router-dom";

import type {
  TaskFilters as TaskFiltersType,
  TaskStats as TaskStatsType,
  ViewMode,
} from "@/components/tasks/types";

export function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [filters, setFilters] = useState<TaskFiltersType>({
    search: "",
    status: "",
    priority: "",
    assignee: "",
  });
  const [projects, setProjects] = useState<any[]>([]);
  const [sprints, setSprints] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [selectedSprint, setSelectedSprint] = useState<string>("all");
  const { user } = useAuth();
  const [statuses, setStatuses] = useState<any[]>([]);
  const [projectMembers, setProjectMembers] = useState<any[]>([]);

  const { addToast } = useToast();

  useEffect(() => {
    // Buscar projetos do usuário autenticado
    const fetchProjects = async () => {
      if (!user?.id) {
        setProjects([]);
        return;
      }
      const res = await projectsApi.getMyProjects(user.id);
      if (res.ok && res.data.success) {
        setProjects(Array.isArray(res.data.data) ? res.data.data : []);
      } else {
        setProjects([]);
      }
    };
    fetchProjects();
  }, [user]);

  useEffect(() => {
    // Buscar membros do projeto selecionado
    const fetchProjectMembers = async () => {
      if (selectedProject && selectedProject !== "all") {
        try {
          const res = await projectsApi.getMembers(selectedProject);
          if (res.ok && (res.data as any)?.success) {
            const members = (res.data as any)?.data || [];
            setProjectMembers(members);
          } else {
            setProjectMembers([]);
          }
        } catch (error) {
          setProjectMembers([]);
        }
      } else {
        setProjectMembers([]);
      }
    };
    fetchProjectMembers();
  }, [selectedProject]);

  useEffect(() => {
    // Buscar sprints do projeto selecionado
    const fetchSprints = async () => {
      if (selectedProject && selectedProject !== "all") {
        try {
          const res = await sprintsApi.getByProject(selectedProject);
          if (
            res.ok &&
            (res.data as any)?.success &&
            (res.data as any)?.data &&
            ((res.data as any).data as any)?.success
          ) {
            setSprints(
              Array.isArray(((res.data as any).data as any)?.data)
                ? ((res.data as any).data as any).data
                : []
            );
          } else {
            setSprints([]);
          }
        } catch (error) {
          setSprints([]);
        }
      } else {
        setSprints([]);
      }
    };
    fetchSprints();
  }, [selectedProject]);

  useEffect(() => {
    // Buscar status do projeto selecionado
    const fetchStatuses = async () => {
      if (selectedProject && selectedProject !== "all") {
        try {
          const res = await statusesApi.getByProject(selectedProject);
          if (res.ok && res.data.success) {
            setStatuses(Array.isArray(res.data.data) ? res.data.data : []);
          } else {
            setStatuses([]);
          }
        } catch (error) {
          setStatuses([]);
        }
      } else {
        setStatuses([]);
      }
    };
    fetchStatuses();
  }, [selectedProject]);

  // Atualizar fetchTasks para considerar filtros de projeto/sprint
  const fetchTasks = async () => {
    try {
      setLoading(true);
      let response;

      // Lógica simplificada: sempre buscar todas as tarefas e filtrar localmente
      response = await tasksApi.getAll();

      if (response.ok && response.data.success) {
        let data = response.data.data || [];

        // Filtrar por projeto se selecionado
        if (selectedProject && selectedProject !== "all") {
          data = data.filter((t: any) => t.projectId === selectedProject);
        }

        // Filtrar por sprint se selecionado
        if (selectedSprint && selectedSprint !== "all") {
          data = data.filter((t: any) => t.sprintId === selectedSprint);
        }

        setTasks(data);
      } else {
        setTasks([]);
        addToast({
          title: "Erro ao carregar tarefas",
          description:
            response.data?.message ||
            response.data?.error ||
            "Erro desconhecido",
          type: "error",
        });
      }
    } catch (error: any) {
      setTasks([]);
      addToast({
        title: "Erro ao carregar tarefas",
        description: String(error?.message || "Erro desconhecido"),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, [selectedProject, selectedSprint]);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      (task.description &&
        task.description.toLowerCase().includes(filters.search.toLowerCase()));

    const matchesStatus =
      !filters.status ||
      filters.status === "all" ||
      task.statusId === filters.status;
    const matchesPriority =
      !filters.priority ||
      filters.priority === "all" ||
      String(task.priority) === filters.priority;
    const matchesAssignee =
      !filters.assignee ||
      filters.assignee === "all" ||
      task.assigneeId === filters.assignee;
    const matchesProject =
      !selectedProject ||
      selectedProject === "all" ||
      task.projectId === selectedProject;
    const matchesSprint =
      !selectedSprint ||
      selectedSprint === "all" ||
      task.sprintId === selectedSprint;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesAssignee &&
      matchesProject &&
      matchesSprint
    );
  });

  // Calcular stats dinâmicos
  const statusCounts: Record<string, number> = {};
  statuses.forEach((status) => {
    statusCounts[status.name] = tasks.filter(
      (t) => t.statusId === status.name
    ).length;
  });
  const stats: TaskStatsType = {
    total: tasks.length,
    totalEstimatedHours: tasks.reduce(
      (sum, t) => sum + (t.estimatedHours || 0),
      0
    ),
    totalActualHours: tasks.reduce((sum, t) => sum + (t.actualHours || 0), 0),
    statusCounts,
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tarefas</h1>
          <p className="text-muted-foreground">
            Gerencie todas as tarefas do projeto.
          </p>
        </div>

        {/* Estatísticas */}
        <TaskStats stats={stats} statuses={statuses} />

        {/* Filtros */}
        <TaskFilters
          projects={projects}
          sprints={sprints}
          filters={filters}
          setFilters={setFilters}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          selectedSprint={selectedSprint}
          setSelectedSprint={setSelectedSprint}
        />

        {/* Toggle de Visualização */}
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4 mr-2" />
            Lista
          </Button>
          <Button
            variant={viewMode === "kanban" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("kanban")}
          >
            <Grid3X3 className="w-4 h-4 mr-2" />
            Kanban
          </Button>
          {selectedProject !== "all" && projectMembers.length > 0 && (
            <div className="flex items-center gap-x-2">
              <TeamLegend members={projectMembers} direction="vertical" />
              <TeamMembers members={projectMembers} />
            </div>
          )}
        </div>

        {/* Visualização de Tarefas */}
        {viewMode === "list" ? (
          <div className="flex flex-col space-y-3">
            <TaskList
              tasks={filteredTasks}
              loading={loading}
              projects={projects}
              sprints={sprints}
              members={projectMembers}
              statuses={statuses}
              onEdit={() => {}}
              onDelete={() => {}}
            />
            {filteredTasks.length === 0 && !loading && <></>}
          </div>
        ) : (
          <KanbanBoard
            tasks={filteredTasks}
            statuses={statuses}
            loading={loading}
            projects={projects}
            sprints={sprints}
            onEdit={() => {}}
            onDelete={() => {}}
            onCreateTask={() => {}}
          />
        )}
      </div>
    </>
  );
}
