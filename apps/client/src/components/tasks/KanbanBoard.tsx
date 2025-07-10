import { useState, useEffect } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil, Plus } from "lucide-react";
import UserAvatar from "@/components/common/UserAvatar";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import type { Task } from "@packages/shared";
import type { Status } from "@packages/shared";

interface Project {
  id: string;
  name: string;
}

interface Sprint {
  id: string;
  name: string;
}

interface KanbanBoardProps {
  tasks: Task[];
  statuses: Status[];
  loading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onCreateTask: (statusId: string) => void;
  projects: Project[];
  sprints: Sprint[];
}

const KanbanBoard = ({
  tasks,
  statuses,
  loading,
  onEdit,
  onDelete,
  onCreateTask,
  projects,
  sprints,
}: KanbanBoardProps) => {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [tasksByStatus, setTasksByStatus] = useState<Record<string, Task[]>>(
    {}
  );

  // Atualizar tarefas por status quando tasks ou statuses mudarem
  useEffect(() => {
    const grouped = statuses.reduce((acc, status) => {
      acc[status.name] = tasks.filter((task) => task.statusId === status.name);
      return acc;
    }, {} as Record<string, Task[]>);
    setTasksByStatus(grouped);
  }, [tasks, statuses]);

  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Carregando quadro Kanban...
      </div>
    );
  }

  if (!statuses.length) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <CardTitle>Nenhum status encontrado </CardTitle>
        <p className="text-lg py-4 animate-pulse text-accent/60">
          Escolha o projeto para visualizar o quadro Kanban
          <span className=" inline-block text-2xl">💡</span>
        </p>
      </div>
    );
  }

  const getStatusColor = (statusName: string) => {
    const colors: Record<string, string> = {
      TODO: "bg-gray-100 border-gray-300",
      IN_PROGRESS: "bg-blue-100 border-blue-300",
      IN_REVIEW: "bg-yellow-100 border-yellow-300",
      DONE: "bg-green-100 border-green-300",
      BLOCKED: "bg-red-100 border-red-300",
    };
    return colors[statusName] || "bg-gray-100 border-gray-300";
  };

  const getPriorityColor = (priority: number) => {
    const colors: Record<number, string> = {
      1: "bg-green-500",
      2: "bg-yellow-500",
      3: "bg-orange-500",
      4: "bg-red-500",
      5: "bg-purple-500",
    };
    return colors[priority] || "bg-gray-500";
  };

  const getPriorityLabel = (priority: number) => {
    const labels: Record<number, string> = {
      1: "Baixa",
      2: "Média",
      3: "Alta",
      4: "Crítica",
      5: "Urgente",
    };
    return labels[priority] || "N/A";
  };

  const formatDate = (date: string | Date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("pt-BR");
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, statusId: string) => {
    e.preventDefault();
    if (draggedTask && draggedTask.statusId !== statusId) {
      // Aqui você implementaria a lógica para atualizar o status da tarefa
      console.log(`Movendo tarefa ${draggedTask.id} para status ${statusId}`);
    }
    setDraggedTask(null);
  };

  return (
    <TooltipProvider>
      <div className="flex gap-4 overflow-x-auto pb-4 min-h-[600px]">
        {statuses.map((status) => {
          const statusTasks = tasksByStatus[status.name] || [];
          const statusColor = getStatusColor(status.name);

          return (
            <div
              key={status.name}
              className={`flex-shrink-0 w-80 ${statusColor} rounded-lg border-2 p-4 min-h-[400px] flex flex-col`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status.name)}
            >
              {/* Cabeçalho da coluna */}
              <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-800 text-sm truncate">
                    {status.name}
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {statusTasks.length}
                  </Badge>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onCreateTask(status.name)}
                      className="h-6 w-6 p-0 flex-shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Nova tarefa em {status.name}</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Lista de tarefas */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {statusTasks.map((task) => (
                  <Card
                    key={task.id}
                    className="cursor-pointer hover:shadow-md transition-shadow bg-white border-gray-200"
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                  >
                    <CardContent className="p-3">
                      {/* Cabeçalho da tarefa */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div
                            className={`w-2 h-2 rounded-full flex-shrink-0 ${getPriorityColor(
                              task.priority
                            )}`}
                            title={getPriorityLabel(task.priority)}
                          />
                          <h4 className="font-medium text-sm truncate">
                            {task.title}
                          </h4>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button asChild size="sm" variant="ghost" className="h-6 w-6 p-0">
                                <Link to={`/dashboard/task/${task.id}`}>
                                  <Eye className="w-3 h-3" />
                                </Link>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Visualizar tarefa</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onEdit(task)}
                                className="h-6 w-6 p-0"
                              >
                                <Pencil className="w-3 h-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Editar tarefa</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>

                      {/* Descrição */}
                      {task.description && (
                        <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                          {task.description}
                        </p>
                      )}

                      {/* Metadados */}
                      <div className="space-y-2">
                        {/* Projeto e Sprint */}
                        <div className="flex flex-wrap gap-1">
                          {task.projectId && (
                            <Badge variant="outline" className="text-xs">
                              {projects.find((p) => p.id === task.projectId)
                                ?.name || "Projeto"}
                            </Badge>
                          )}
                          {task.sprintId && (
                            <Badge variant="outline" className="text-xs">
                              {sprints.find((s) => s.id === task.sprintId)
                                ?.name || "Sprint"}
                            </Badge>
                          )}
                        </div>

                        {/* Responsável */}
                        {task.assigneeId && (
                          <div className="flex items-center gap-2">
                            <UserAvatar name={task.assigneeId} size="sm" />
                            <span className="text-xs text-gray-600 truncate">
                              {task.assigneeId}
                            </span>
                          </div>
                        )}

                        {/* Horas e Data */}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-2">
                            {task.estimatedHours && (
                              <span>⏱️ {task.estimatedHours}h</span>
                            )}
                            {task.actualHours && (
                              <span>✅ {task.actualHours}h</span>
                            )}
                          </div>
                          {task.dueDate && (
                            <span
                              className={`text-xs ${
                                new Date(task.dueDate) < new Date()
                                  ? "text-red-500 font-medium"
                                  : ""
                              }`}
                            >
                              📅 {formatDate(task.dueDate)}
                            </span>
                          )}
                        </div>

                        {/* Progresso */}
                        {task.estimatedHours && task.actualHours && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Progresso</span>
                              <span>
                                {Math.round(
                                  (task.actualHours / task.estimatedHours) * 100
                                )}
                                %
                              </span>
                            </div>
                            <Progress
                              value={
                                (task.actualHours / task.estimatedHours) * 100
                              }
                              className="h-1"
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Estado vazio */}
                {statusTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-sm">Nenhuma tarefa</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onCreateTask(status.name)}
                      className="mt-2"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Nova tarefa
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </TooltipProvider>
  );
};

export default KanbanBoard;
