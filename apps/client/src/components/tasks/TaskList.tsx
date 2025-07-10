import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Clock,
  User,
  MessageSquare,
  Paperclip,
  Tag,
  Eye,
  Pencil,
  Trash,
} from "lucide-react";
import UserAvatar from "@/components/common/UserAvatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import PriorityGauge from "./PriorityGauge";
import type { TaskListProps } from "./types";
import { Link } from "react-router-dom";

const TaskList = ({
  tasks,
  loading,
  projects,
  sprints,
  statuses,
  members,
  onView,
  onEdit,
  onDelete,
}: TaskListProps) => {
  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Carregando tarefas...
      </div>
    );
  }

  if (!tasks.length) {
    return (
      <div className="text-center py-8 text-muted-foreground/80 font-semibold">
        <p>Nenhuma tarefa encontrada</p>
        <p className="text-lg py-4 animate-pulse text-accent/60">
          Ajuste os filtros ou crie novas tarefas
          <span className=" inline-block text-2xl">💡</span>
        </p>
      </div>
    );
  }

  const formatDate = (date: string | Date) => {
    if (!date) return "";
    const d = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (d.toDateString() === today.toDateString()) {
      return "Hoje";
    } else if (d.toDateString() === tomorrow.toDateString()) {
      return "Amanhã";
    } else if (d < today) {
      return d.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      });
    } else {
      return d.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      });
    }
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    return project?.name || "Projeto";
  };

  const getSprintName = (sprintId: string) => {
    const sprint = sprints.find((s) => s.id === sprintId);
    return sprint?.name || "Sprint";
  };

  const getStatusName = (statusId: string) => {
    const status = statuses.find((s) => s.id === statusId);
    return status?.name || statusId || "Sem status";
  };

  const getAssigneeInfo = (assigneeId: string) => {
    const member = members.find((m) => m.id === assigneeId);
    return {
      name: member?.name || "Não atribuído",
      avatar: member?.avatarUrl || "",
      teams: member?.teams || [],
    };
  };

  const getReporterInfo = (reporterId: string) => {
    const member = members.find((m) => m.id === reporterId);
    return {
      name: member?.name || "Desconhecido",
      avatar: member?.avatarUrl || "",
    };
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {tasks.map((task) => {
          const assignee = task.assigneeId
            ? getAssigneeInfo(task.assigneeId)
            : null;
          const reporter = getReporterInfo(task.reporterId);

          return (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardContent>
                <div className="flex items-center gap-1 px-2">
                  <div className="flex flex-col border-dotted border-accent/30">
                    {/* Título e Sprint */}
                    <div className="flex flex-col gap-4 flex-1 p-2 -mt-4">
                      <h3 className="font-semibold  text-accent text-lg ">
                        {task.title}
                      </h3>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="font-medium">Projeto:</span>
                          <span>{getProjectName(task.projectId)}</span>
                        </div>
                        {task.sprintId && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="font-medium">Sprint:</span>
                            <Badge variant="outline">
                              {getSprintName(task.sprintId)}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Status e Prioridade */}
                    <div className="flex flex-col items-center gap-2">
                      <PriorityGauge
                        priority={task.priority}
                        size="sm"
                        showLabel={true}
                      />
                    </div>
                  </div>
                  {/* Descrição */}
                  <div className="h-full px-4 flex-1 flex flex-col">
                    <div className="bg-muted-foreground/10 border border-accent/30 rounded-sm pr-2">
                      <p className="text-xs font-medium text-muted/80 mx-auto p-2">
                        Descrição:
                      </p>
                      <textarea
                        className="w-full h-20 my-1 text-xs p-2 muted-foreground bg-transparent border-none resize-none focus:outline-none"
                        value={task.description || "Sem descrição"}
                        readOnly
                      />
                    </div>
                  </div>
                  {/* Responsável, Criador e Datas */}

                  <div className="flex flex-col mx-2 lg:mx-4 2xl:mx-12">
                    {/* Responsável */}
                    {assignee ? (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-600">
                          Responsável:
                        </p>
                        <div className="flex items-center gap-2">
                          <UserAvatar
                            name={assignee.name}
                            avatarUrl={assignee.avatar}
                            size="sm"
                          />
                          <div>
                            <p className="text-sm font-medium">
                              {assignee.name}
                            </p>
                            {assignee.teams && assignee.teams.length > 0 && (
                              <div className="space-y-1 mt-1">
                                {assignee.teams.map(
                                  (team: any, index: number) => (
                                    <div
                                      key={index}
                                      className="flex items-center gap-1"
                                    >
                                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                      <span className="text-xs text-gray-600">
                                        {team.name} ({team.role})
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-600">
                          Responsável:
                        </p>
                        <div className="text-sm text-gray-500 italic">
                          Não atribuído
                        </div>
                      </div>
                    )}

                    {/* Criador */}
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-600">
                        Criado por:
                      </p>
                      <div className="flex items-center gap-2">
                        <UserAvatar
                          name={reporter.name}
                          avatarUrl={reporter.avatar}
                          size="sm"
                        />
                        <span className="text-sm font-medium">
                          {reporter.name}
                        </span>
                      </div>
                    </div>

                    {/* Datas */}
                    <div className="space-y-1 flex flex-col py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          📅 Criado:
                        </span>
                        <span className="text-xs text-gray-600">
                          {formatDate(task.createdAt)}
                        </span>
                      </div>
                      {task.dueDate && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            ⏰ Vencimento:
                          </span>
                          <span
                            className={`text-xs ${
                              new Date(task.dueDate) < new Date()
                                ? "text-red-600 font-medium"
                                : "text-gray-600"
                            }`}
                          >
                            {formatDate(task.dueDate)}
                          </span>
                        </div>
                      )}
                      {task.updatedAt && task.updatedAt !== task.createdAt && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            🔄 Atualizado:
                          </span>
                          <span className="text-xs text-gray-600">
                            {formatDate(task.updatedAt)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex flex-col items-center gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button asChild variant="ghost" size="icon">
                            <Link to={`/dashboard/task/${task.id}`}>
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Ver detalhes</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {onEdit && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEdit(task)}
                            className="w-8 h-8 p-0"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Editar tarefa</TooltipContent>
                      </Tooltip>
                    )}

                    {onDelete && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onDelete(task.id)}
                            className="w-8 h-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Deletar tarefa</TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  {/* Metadados */}
                  <div className="flex flex-col gap-2 py-2">
                    {/* Horas */}
                    <div className="space-y-1">
                      {task.estimatedHours && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {task.estimatedHours}h estimadas
                          </span>
                        </div>
                      )}
                      {task.actualHours && task.actualHours > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            ✅ {task.actualHours}h realizadas
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Progresso */}
                    {task.estimatedHours && task.actualHours && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>Progresso</span>
                          <span>
                            {Math.round(
                              (task.actualHours / task.estimatedHours) * 100
                            )}
                            %
                          </span>
                        </div>
                        <Progress
                          value={(task.actualHours / task.estimatedHours) * 100}
                          className="h-1.5"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </TooltipProvider>
  );
};

export default TaskList;
