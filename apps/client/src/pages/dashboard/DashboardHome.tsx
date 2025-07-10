import DashboardStats from "./DashboardStats";
import DashboardHeatmap from "./DashboardHeatmap";
import DashboardRecentProjects from "./DashboardRecentProjects";
import DashboardActivities from "./DashboardActivities";
import { useEffect, useState } from "react";
import { projectsApi } from "@/services/domains/projectsApi";
import { teamsApi } from "@/services/domains/teamsApi";
import { sprintsApi } from "@/services/domains/sprintsApi";
import { tasksApi } from "@/services/domains/tasksApi";
import { activitiesApi } from "@/services/domains/activitiesApi";
import { useAuth } from "@/contexts/auth-context";

function getDateKey(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toISOString().slice(0, 10);
}

export function DashboardHome() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [sprints, setSprints] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [projectTeams, setProjectTeams] = useState<Record<string, any[]>>({});

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [projectsRes, teamsRes, sprintsRes, tasksRes, activitiesRes] =
          await Promise.all([
            user?.id
              ? projectsApi.getMyProjects(user.id)
              : projectsApi.getAll(),
            teamsApi.getAll(),
            sprintsApi.getAll(),
            tasksApi.getAll(),
            activitiesApi.getAll(),
          ]);
        const projectsList =
          projectsRes.ok && Array.isArray(projectsRes.data?.data)
            ? projectsRes.data.data
            : [];
        setProjects(projectsList);
        setTeams(
          teamsRes.ok && Array.isArray(teamsRes.data?.data)
            ? teamsRes.data.data
            : []
        );
        setSprints(
          sprintsRes.ok && Array.isArray(sprintsRes.data?.data)
            ? sprintsRes.data.data
            : []
        );
        setTasks(
          tasksRes.ok && Array.isArray(tasksRes.data?.data)
            ? tasksRes.data.data
            : []
        );
        setActivities(
          activitiesRes.ok && Array.isArray(activitiesRes.data?.data)
            ? activitiesRes.data.data
            : []
        );
        // Buscar equipes de cada projeto para TeamLegend
        const teamsByProject: Record<string, any[]> = {};
        for (const project of projectsList) {
          const teamsRes = await projectsApi.getTeams(project.id);
          teamsByProject[project.id] =
            teamsRes.ok && Array.isArray(teamsRes.data?.data)
              ? teamsRes.data.data
              : [];
        }
        setProjectTeams(teamsByProject);
      } catch (e) {
        setProjects([]);
        setTeams([]);
        setSprints([]);
        setTasks([]);
        setActivities([]);
        setProjectTeams({});
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  // Contagens
  const activeProjects = projects.filter((p) => p.status !== "archived").length;
  const archivedProjects = projects.filter(
    (p) => p.status === "archived"
  ).length;
  const activeSprints = sprints.filter((s) => !s.endedAt).length;
  const pendingTasks = tasks.filter((t) => t.status !== "DONE").length;
  const doneTasks = tasks.filter((t) => t.status === "DONE").length;
  const overdueTasks = tasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "DONE"
  ).length;
  const uniqueMembers = [
    ...new Set(teams.flatMap((t) => t.members?.map((m: any) => m.id) || [])),
  ].length;
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  // Heatmap de datas das tasks criadas/concluídas
  const dateMap: Record<string, { created: number; done: number }> = {};
  tasks.forEach((task) => {
    const createdKey = getDateKey(task.createdAt);
    if (createdKey) {
      dateMap[createdKey] = dateMap[createdKey] || { created: 0, done: 0 };
      dateMap[createdKey].created++;
    }
    if (task.status === "DONE" && task.updatedAt) {
      const doneKey = getDateKey(task.updatedAt);
      if (doneKey) {
        dateMap[doneKey] = dateMap[doneKey] || { created: 0, done: 0 };
        dateMap[doneKey].done++;
      }
    }
  });
  // Últimos 30 dias
  const today = new Date();
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (29 - i));
    return d.toISOString().slice(0, 10);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao seu painel de controle. Gerencie seus projetos, equipes e
          sprints.
        </p>
      </div>
      <DashboardStats
        loading={loading}
        activeProjects={activeProjects}
        archivedProjects={archivedProjects}
        teams={teams}
        uniqueMembers={uniqueMembers}
        activeSprints={activeSprints}
        sprints={sprints}
        pendingTasks={pendingTasks}
        tasks={tasks}
        doneTasks={doneTasks}
        overdueTasks={overdueTasks}
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <DashboardHeatmap days={days} dateMap={dateMap} />
          <DashboardRecentProjects
            loading={loading}
            recentProjects={recentProjects}
            projectTeams={projectTeams}
          />
        </div>
        <DashboardActivities loading={loading} activities={activities} />
      </div>
    </div>
  );
}
