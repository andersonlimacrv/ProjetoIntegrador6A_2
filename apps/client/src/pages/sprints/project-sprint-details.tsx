import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { sprintsApi } from "@/services/domains/sprintsApi";
import { useToast } from "@/contexts/toast-context";
import type { Sprint, UserStory, Task } from "@packages/shared";

export function ProjectSprintDetailsPage() {
  const { sprintId } = useParams();
  const { addToast } = useToast();
  const [sprint, setSprint] = useState<Sprint | null>(null);
  const [userStories, setUserStories] = useState<UserStory[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      // Sprint
      const res = await sprintsApi.getById(sprintId!);
      if (res.ok && res.data.success) {
        setSprint(res.data.data || null);
      } else {
        addToast({ title: "Erro ao buscar sprint", type: "error" });
      }
      // User Stories
      const usRes = await sprintsApi.getUserStories(sprintId!);
      if (usRes.ok && usRes.data.success) {
        setUserStories(Array.isArray(usRes.data.data) ? usRes.data.data : []);
      } else {
        setUserStories([]);
      }
      // Tasks
      const tRes = await sprintsApi.getTasks(sprintId!);
      if (tRes.ok && tRes.data.success) {
        setTasks(Array.isArray(tRes.data.data) ? tRes.data.data : []);
      } else {
        setTasks([]);
      }
      // Metrics
      const mRes = await sprintsApi.getMetrics(sprintId!);
      if (mRes.ok && mRes.data.success) {
        setMetrics(
          mRes.data.data && typeof mRes.data.data === "object"
            ? mRes.data.data
            : {}
        );
      } else {
        setMetrics({});
      }
      setLoading(false);
    };
    if (sprintId) fetchAll();
    // eslint-disable-next-line
  }, [sprintId]);

  if (loading) {
    return (
      <div className="text-center text-muted-foreground py-12">
        Carregando...
      </div>
    );
  }
  if (!sprint) {
    return (
      <div className="text-center text-muted-foreground py-12">
        Sprint não encontrado.
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-2 sm:px-6 flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="truncate text-lg">{sprint.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge variant="secondary">Status: {sprint.status}</Badge>
            <Badge variant="outline">
              Início: {new Date(sprint.startDate).toLocaleDateString()}
            </Badge>
            <Badge variant="outline">
              Fim: {new Date(sprint.endDate).toLocaleDateString()}
            </Badge>
          </div>
          {sprint.goal && (
            <div className="text-sm text-muted-foreground">
              Meta: {sprint.goal}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Backlog (User Stories) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Backlog do Sprint</CardTitle>
        </CardHeader>
        <CardContent>
          {userStories.length === 0 ? (
            <span className="text-muted-foreground text-sm">
              Nenhuma user story vinculada.
            </span>
          ) : (
            <ul className="list-disc pl-4">
              {userStories.map((us) => (
                <li key={us.id} className="mb-1">
                  <span className="font-medium">{us.title}</span>{" "}
                  <span className="text-xs text-muted-foreground">
                    ({us.statusId})
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Tarefas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tarefas do Sprint</CardTitle>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <span className="text-muted-foreground text-sm">
              Nenhuma tarefa vinculada.
            </span>
          ) : (
            <ul className="list-disc pl-4">
              {tasks.map((task) => (
                <li key={task.id} className="mb-1">
                  <span className="font-medium">{task.title}</span>{" "}
                  <span className="text-xs text-muted-foreground">
                    ({task.statusId})
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Métricas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Métricas do Sprint</CardTitle>
        </CardHeader>
        <CardContent>
          {metrics && Object.keys(metrics).length > 0 ? (
            <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
              {JSON.stringify(metrics, null, 2)}
            </pre>
          ) : (
            <span className="text-muted-foreground text-sm">
              Nenhuma métrica disponível.
            </span>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
