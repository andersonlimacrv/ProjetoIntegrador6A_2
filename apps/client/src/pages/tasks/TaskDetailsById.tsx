import { useEffect, useState } from "react";
import { tasksApi } from "@/services/domains/tasksApi";
import { projectsApi } from "@/services/domains/projectsApi";
import { sprintsApi } from "@/services/domains/sprintsApi";
import { teamsApi } from "@/services/domains/teamsApi";
import { statusesApi } from "@/services/domains/statusesApi";
import { useToast } from "@/contexts/toast-context";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import UserAvatar from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { PRIORITY_LABELS } from "@/lib/constants";

interface TaskDetailsByIdProps {
  taskId: string;
  onBack?: () => void;
}

export default function TaskDetailsById({
  taskId,
  onBack,
}: TaskDetailsByIdProps) {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<any>(null);
  const [project, setProject] = useState<any>(null);
  const [sprint, setSprint] = useState<any>(null);
  const [status, setStatus] = useState<any>(null);
  const [assignee, setAssignee] = useState<any>(null);
  const [reporter, setReporter] = useState<any>(null);
  const [teams, setTeams] = useState<any[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        // Buscar task
        const res = await tasksApi.getById(taskId);
        if (!res.ok || !res.data?.success) {
          addToast({ title: "Tarefa não encontrada", type: "error" });
          setLoading(false);
          return;
        }
        const t = res.data.data;
        setTask(t);
        // Buscar projeto
        const projRes = await projectsApi.getById(t.projectId);
        setProject(
          projRes.ok && projRes.data?.success ? projRes.data.data : null
        );
        // Buscar sprint
        if (t.sprintId) {
          const sprintRes = await sprintsApi.getById(t.sprintId);
          setSprint(
            sprintRes.ok && sprintRes.data?.success ? sprintRes.data.data : null
          );
        }
        // Buscar status
        if (t.statusId) {
          const statusRes = await statusesApi.getById(t.statusId);
          setStatus(
            statusRes.ok && statusRes.data?.success ? statusRes.data.data : null
          );
        }
        // Buscar responsável
        if (t.assigneeId) {
          const membersRes = await projectsApi.getMembers(t.projectId);
          let assignee = null;
          if (membersRes.ok && Array.isArray(membersRes.data?.data)) {
            assignee = membersRes.data.data.find((m) => m.id === t.assigneeId);
          }
          setAssignee(assignee);
        }
        // Buscar criador
        if (t.reporterId) {
          const membersRes = await projectsApi.getMembers(t.projectId);
          let reporter = null;
          if (membersRes.ok && Array.isArray(membersRes.data?.data)) {
            reporter = membersRes.data.data.find((m) => m.id === t.reporterId);
          }
          setReporter(reporter);
        }
        // Buscar times do projeto
        const teamsRes = await projectsApi.getTeams(t.projectId);
        setTeams(
          teamsRes.ok && teamsRes.data?.success ? teamsRes.data.data : []
        );
      } catch (err: any) {
        addToast({
          title: "Erro ao buscar detalhes da tarefa",
          description: err?.message,
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    if (taskId) fetchAll();
  }, [taskId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin w-10 h-10 text-muted-foreground mb-4" />
        <span className="text-muted-foreground">
          Carregando detalhes da tarefa...
        </span>
      </div>
    );
  }
  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <span className="text-destructive font-semibold">
          Tarefa não encontrada.
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full p-4 lg:p-16 4xl:p-32 max-w-7xl mx-auto">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <CardTitle className="text-2xl md:text-3xl flex items-center gap-2">
              {task.title}
              <Badge variant="secondary" className="ml-2">
                {status?.name || "Status"}
              </Badge>
              <Badge variant="outline" className="ml-2">
                Prioridade: {PRIORITY_LABELS[task.priority]}
              </Badge>
            </CardTitle>
            {onBack && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={onBack}>
                  Voltar
                </Button>
              </div>
            )}
          </div>
          <CardDescription className="mt-2">
            {task.description || (
              <span className="italic text-muted-foreground">
                Sem descrição
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="font-semibold text-muted-foreground mb-1">
                Projeto
              </div>
              {project ? (
                <div className="flex items-center gap-2">
                  <Badge variant="default">{project.name}</Badge>
                </div>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </div>
            <div>
              <div className="font-semibold text-muted-foreground mb-1">
                Sprint
              </div>
              {sprint ? (
                <Badge variant="secondary">{sprint.name}</Badge>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </div>
            <div>
              <div className="font-semibold text-muted-foreground mb-1">
                Responsável
              </div>
              {assignee ? (
                <div className="flex items-center gap-2">
                  <UserAvatar
                    name={assignee.name}
                    avatarUrl={assignee.avatarUrl || ""}
                    size="sm"
                  />
                  <span>{assignee.name}</span>
                </div>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </div>
            <div>
              <div className="font-semibold text-muted-foreground mb-1">
                Criado por
              </div>
              {reporter ? (
                <div className="flex items-center gap-2">
                  <UserAvatar
                    name={reporter.name}
                    avatarUrl={reporter.avatarUrl || ""}
                    size="sm"
                  />
                  <span>{reporter.name}</span>
                </div>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </div>
            <div>
              <div className="font-semibold text-muted-foreground mb-1">
                Data de Vencimento
              </div>
              {task.dueDate ? (
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </div>
            <div>
              <div className="font-semibold text-muted-foreground mb-1">
                Criada em
              </div>
              {task.createdAt ? (
                <span>{new Date(task.createdAt).toLocaleDateString()}</span>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </div>
            <div className="md:col-span-2">
              <div className="font-semibold text-muted-foreground mb-1">
                Times do Projeto
              </div>
              {teams.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {teams.map((team) => (
                    <Badge key={team.id} variant="outline">
                      {team.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <span className="text-muted-foreground">Nenhum time</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
