import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckSquare,
  Eye,
  Pencil,
  Trash,
  Plus,
  Filter,
  Search,
  Calendar,
  Clock,
  User,
  FileText,
  Target,
  BarChart3,
  AlertCircle,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  StopCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { tasksApi } from "@/services/domains/tasksApi";
import type { Task } from "@packages/shared";
import { useToast } from "@/contexts/toast-context";

interface TaskWithDetails extends Task {
  assigneeName?: string;
  assigneeAvatar?: string;
  reporterName?: string;
  reporterAvatar?: string;
  storyTitle?: string;
  epicName?: string;
  projectName?: string;
}

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [creatingTask, setCreatingTask] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
    assignee: "",
  });
  const [sortBy, setSortBy] = useState({
    field: "createdAt" as keyof Task,
    direction: "desc" as "asc" | "desc",
  });
  const [createForm, setCreateForm] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    assigneeId: "",
    reporterId: "",
    storyId: "",
    projectId: "",
    estimatedHours: "",
    dueDate: "",
    labels: "",
  });
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    estimatedHours: "",
    actualHours: "",
  });

  const { addToast } = useToast();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksApi.getAll();

      if (response.ok && response.data.success) {
        setTasks(response.data.data || []);
      } else {
        addToast({
          title: "Erro ao carregar tarefas",
          description:
            response.data.message ||
            response.data.error ||
            "Ocorreu um erro ao buscar as tarefas.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
      addToast({
        title: "Erro de conexão",
        description:
          "Não foi possível conectar ao servidor. Verifique sua conexão.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDeleteTask = async (taskId: string) => {
    if (confirm("Tem certeza que deseja deletar esta tarefa?")) {
      const res = await tasksApi.delete(taskId);
      if (res.success) {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
      } else {
        console.error("Erro ao deletar tarefa:", res.error);
      }
    }
  };

  const handleEditTask = (task: TaskWithDetails) => {
    setEditingTask(task);
    setEditForm({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      assigneeId: task.assigneeId || "",
      reporterId: task.reporterId || "",
      storyId: task.storyId || "",
      estimatedHours: task.estimatedHours?.toString() || "",
      actualHours: task.actualHours?.toString() || "",
      dueDate: task.dueDate
        ? new Date(task.dueDate).toISOString().split("T")[0]
        : "",
      labels: task.labels?.join(", ") || "",
    });
  };

  const handleSaveEdit = async () => {
    if (!editingTask) return;

    const res = await tasksApi.update(editingTask.id, {
      title: editForm.title,
      description: editForm.description,
      status: editForm.status as any,
      priority: editForm.priority as any,
      assigneeId: editForm.assigneeId || undefined,
      reporterId: editForm.reporterId || undefined,
      storyId: editForm.storyId || undefined,
      estimatedHours: editForm.estimatedHours
        ? parseFloat(editForm.estimatedHours)
        : undefined,
      actualHours: editForm.actualHours
        ? parseFloat(editForm.actualHours)
        : undefined,
      dueDate: editForm.dueDate ? new Date(editForm.dueDate) : undefined,
      labels: editForm.labels
        ? editForm.labels.split(",").map((l) => l.trim())
        : undefined,
    });

    if (res.success && res.data) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTask.id ? { ...res.data!, ...editingTask } : t
        )
      );
      setEditingTask(null);
    } else {
      console.error("Erro ao atualizar tarefa:", res.error);
    }
  };

  const handleCreateTask = async () => {
    const res = await tasksApi.create({
      title: createForm.title,
      description: createForm.description,
      status: createForm.status as any,
      priority: createForm.priority as any,
      assigneeId: createForm.assigneeId || undefined,
      reporterId: createForm.reporterId || undefined,
      storyId: createForm.storyId || undefined,
      projectId: createForm.projectId,
      estimatedHours: createForm.estimatedHours
        ? parseFloat(createForm.estimatedHours)
        : undefined,
      dueDate: createForm.dueDate ? new Date(createForm.dueDate) : undefined,
      labels: createForm.labels
        ? createForm.labels.split(",").map((l) => l.trim())
        : undefined,
    });

    if (res.success && res.data) {
      setTasks((prev) => [
        ...prev,
        {
          ...res.data!,
          assigneeName: "João Silva",
          reporterName: "Maria Santos",
        },
      ]);
      setCreatingTask(false);
      setCreateForm({
        title: "",
        description: "",
        status: "",
        priority: "",
        assigneeId: "",
        reporterId: "",
        storyId: "",
        projectId: "",
        estimatedHours: "",
        dueDate: "",
        labels: "",
      });
    } else {
      console.error("Erro ao criar tarefa:", res.error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "TODO":
        return "bg-gray-100 text-gray-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "REVIEW":
        return "bg-yellow-100 text-yellow-800";
      case "DONE":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "TODO":
        return "A Fazer";
      case "IN_PROGRESS":
        return "Em Progresso";
      case "REVIEW":
        return "Em Revisão";
      case "DONE":
        return "Concluída";
      case "CANCELLED":
        return "Cancelada";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "TODO":
        return <AlertCircle className="w-4 h-4" />;
      case "IN_PROGRESS":
        return <Play className="w-4 h-4" />;
      case "REVIEW":
        return <Pause className="w-4 h-4" />;
      case "DONE":
        return <CheckCircle className="w-4 h-4" />;
      case "CANCELLED":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "LOW":
        return "bg-green-100 text-green-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "HIGH":
        return "bg-orange-100 text-orange-800";
      case "CRITICAL":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "LOW":
        return "Baixa";
      case "MEDIUM":
        return "Média";
      case "HIGH":
        return "Alta";
      case "CRITICAL":
        return "Crítica";
      default:
        return priority;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      (task.description &&
        task.description.toLowerCase().includes(filters.search.toLowerCase()));

    const matchesStatus =
      !filters.status ||
      filters.status === "all" ||
      task.status === filters.status;
    const matchesPriority =
      !filters.priority ||
      filters.priority === "all" ||
      task.priority === filters.priority;
    const matchesAssignee =
      !filters.assignee ||
      filters.assignee === "all" ||
      task.assigneeId === filters.assignee;

    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const aValue = a[sortBy.field];
    const bValue = b[sortBy.field];

    if (aValue === undefined && bValue === undefined) return 0;
    if (aValue === undefined) return 1;
    if (bValue === undefined) return -1;

    let comparison = 0;
    if (typeof aValue === "string" && typeof bValue === "string") {
      comparison = aValue.localeCompare(bValue);
    } else if (typeof aValue === "number" && typeof bValue === "number") {
      comparison = aValue - bValue;
    } else if (aValue instanceof Date && bValue instanceof Date) {
      comparison = aValue.getTime() - bValue.getTime();
    }

    return sortBy.direction === "asc" ? comparison : -comparison;
  });

  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "TODO").length,
    inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    review: tasks.filter((t) => t.status === "REVIEW").length,
    done: tasks.filter((t) => t.status === "DONE").length,
    cancelled: tasks.filter((t) => t.status === "CANCELLED").length,
    totalEstimatedHours: tasks.reduce(
      (sum, t) => sum + (t.estimatedHours || 0),
      0
    ),
    totalActualHours: tasks.reduce((sum, t) => sum + (t.actualHours || 0), 0),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tarefas</h1>
        <p className="text-muted-foreground">
          Gerencie todas as tarefas do projeto.
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <CheckSquare className="h-6 w-6 mx-auto text-blue-600 mb-2" />
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <AlertCircle className="h-6 w-6 mx-auto text-gray-600 mb-2" />
              <p className="text-2xl font-bold">{stats.todo}</p>
              <p className="text-xs text-muted-foreground">A Fazer</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Play className="h-6 w-6 mx-auto text-blue-600 mb-2" />
              <p className="text-2xl font-bold">{stats.inProgress}</p>
              <p className="text-xs text-muted-foreground">Em Progresso</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Pause className="h-6 w-6 mx-auto text-yellow-600 mb-2" />
              <p className="text-2xl font-bold">{stats.review}</p>
              <p className="text-xs text-muted-foreground">Em Revisão</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <CheckCircle className="h-6 w-6 mx-auto text-green-600 mb-2" />
              <p className="text-2xl font-bold">{stats.done}</p>
              <p className="text-xs text-muted-foreground">Concluídas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <XCircle className="h-6 w-6 mx-auto text-red-600 mb-2" />
              <p className="text-2xl font-bold">{stats.cancelled}</p>
              <p className="text-xs text-muted-foreground">Canceladas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Clock className="h-6 w-6 mx-auto text-purple-600 mb-2" />
              <p className="text-2xl font-bold">{stats.totalEstimatedHours}</p>
              <p className="text-xs text-muted-foreground">Horas Estimadas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <BarChart3 className="h-6 w-6 mx-auto text-orange-600 mb-2" />
              <p className="text-2xl font-bold">{stats.totalActualHours}</p>
              <p className="text-xs text-muted-foreground">Horas Reais</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros e Ordenação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Buscar tarefas..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters({ ...filters, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="TODO">A Fazer</SelectItem>
                  <SelectItem value="IN_PROGRESS">Em Progresso</SelectItem>
                  <SelectItem value="REVIEW">Em Revisão</SelectItem>
                  <SelectItem value="DONE">Concluída</SelectItem>
                  <SelectItem value="CANCELLED">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade</Label>
              <Select
                value={filters.priority}
                onValueChange={(value) =>
                  setFilters({ ...filters, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="LOW">Baixa</SelectItem>
                  <SelectItem value="MEDIUM">Média</SelectItem>
                  <SelectItem value="HIGH">Alta</SelectItem>
                  <SelectItem value="CRITICAL">Crítica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sort-field">Ordenar por</Label>
              <Select
                value={sortBy.field}
                onValueChange={(value) =>
                  setSortBy({
                    ...sortBy,
                    field: value as keyof TaskWithDetails,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Data de Criação</SelectItem>
                  <SelectItem value="dueDate">Data Limite</SelectItem>
                  <SelectItem value="priority">Prioridade</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="title">Título</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sort-direction">Direção</Label>
              <Select
                value={sortBy.direction}
                onValueChange={(value) =>
                  setSortBy({ ...sortBy, direction: value as "asc" | "desc" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Crescente</SelectItem>
                  <SelectItem value="desc">Decrescente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignee">Responsável</Label>
              <Select
                value={filters.assignee}
                onValueChange={(value) =>
                  setFilters({ ...filters, assignee: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {/* TODO: Listar usuários disponíveis */}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Tarefas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Tarefas ({sortedTasks.length})
            </CardTitle>
            <Button onClick={() => setCreatingTask(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Tarefa
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando tarefas...
            </div>
          ) : sortedTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma tarefa encontrada</p>
              <p className="text-sm">Ajuste os filtros ou crie novas tarefas</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedTasks.map((task) => (
                <Card
                  key={task.id}
                  className="border shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Status e Ícones */}
                      <div className="flex flex-col items-center gap-2">
                        <Badge className={`${getStatusColor(task.status)}`}>
                          {getStatusIcon(task.status)}
                        </Badge>
                        <Badge
                          className={`text-xs ${getPriorityColor(
                            task.priority
                          )}`}
                        >
                          {getPriorityLabel(task.priority)}
                        </Badge>
                      </div>

                      {/* Informações principais */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{task.title}</h3>
                          {task.labels && task.labels.length > 0 && (
                            <div className="flex gap-1">
                              {task.labels.slice(0, 2).map((label, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {label}
                                </Badge>
                              ))}
                              {task.labels.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{task.labels.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>

                        {task.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {task.description}
                          </p>
                        )}

                        {/* Metadados */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {task.assigneeName && (
                            <div className="flex items-center gap-1">
                              <Avatar className="w-4 h-4">
                                <AvatarImage src={task.assigneeAvatar} />
                                <AvatarFallback className="text-xs">
                                  {getInitials(task.assigneeName)}
                                </AvatarFallback>
                              </Avatar>
                              <span>{task.assigneeName}</span>
                            </div>
                          )}
                          {task.storyTitle && (
                            <div className="flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              <span>{task.storyTitle}</span>
                            </div>
                          )}
                          {task.epicName && (
                            <div className="flex items-center gap-1">
                              <Target className="w-3 h-3" />
                              <span>{task.epicName}</span>
                            </div>
                          )}
                          {task.estimatedHours && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{task.estimatedHours}h</span>
                            </div>
                          )}
                          {task.dueDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(task.dueDate)}</span>
                            </div>
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

                      {/* Ações */}
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setViewingTask(task)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditTask(task)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Visualização */}
      <Dialog open={!!viewingTask} onOpenChange={() => setViewingTask(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              {viewingTask?.title}
            </DialogTitle>
            <DialogDescription>Detalhes completos da tarefa</DialogDescription>
          </DialogHeader>

          {viewingTask && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(viewingTask.status)}>
                  {getStatusIcon(viewingTask.status)}
                  <span className="ml-1">
                    {getStatusLabel(viewingTask.status)}
                  </span>
                </Badge>
                <Badge className={getPriorityColor(viewingTask.priority)}>
                  {getPriorityLabel(viewingTask.priority)}
                </Badge>
              </div>

              {viewingTask.description && (
                <div>
                  <Label className="text-sm font-medium">Descrição</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {viewingTask.description}
                  </p>
                </div>
              )}

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-sm font-medium">Responsável</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={viewingTask.assigneeAvatar} />
                      <AvatarFallback className="text-xs">
                        {getInitials(viewingTask.assigneeName || "")}
                      </AvatarFallback>
                    </Avatar>
                    <span>{viewingTask.assigneeName || "Não atribuído"}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Reporter</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={viewingTask.reporterAvatar} />
                      <AvatarFallback className="text-xs">
                        {getInitials(viewingTask.reporterName || "")}
                      </AvatarFallback>
                    </Avatar>
                    <span>{viewingTask.reporterName || "Não definido"}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">História</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {viewingTask.storyTitle || "Não associada"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Épico</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {viewingTask.epicName || "Não associado"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Horas Estimadas</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {viewingTask.estimatedHours || 0}h
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Horas Reais</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {viewingTask.actualHours || 0}h
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Data Limite</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {viewingTask.dueDate
                      ? formatDate(viewingTask.dueDate)
                      : "Não definida"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Criado em</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatDate(viewingTask.createdAt)}
                  </p>
                </div>
              </div>

              {viewingTask.labels && viewingTask.labels.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Labels</Label>
                  <div className="flex gap-1 mt-1">
                    {viewingTask.labels.map((label, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {label}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingTask(null)}>
              Fechar
            </Button>
            {viewingTask && (
              <Button
                onClick={() => {
                  setViewingTask(null);
                  handleEditTask(viewingTask);
                }}
              >
                Editar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Tarefa</DialogTitle>
            <DialogDescription>
              Faça as alterações necessárias na tarefa.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">
                Título
              </Label>
              <Input
                id="edit-title"
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Descrição
              </Label>
              <Textarea
                id="edit-description"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                className="col-span-3"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">
                Status
              </Label>
              <Select
                value={editForm.status}
                onValueChange={(value) =>
                  setEditForm({ ...editForm, status: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODO">A Fazer</SelectItem>
                  <SelectItem value="IN_PROGRESS">Em Progresso</SelectItem>
                  <SelectItem value="REVIEW">Em Revisão</SelectItem>
                  <SelectItem value="DONE">Concluída</SelectItem>
                  <SelectItem value="CANCELLED">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-priority" className="text-right">
                Prioridade
              </Label>
              <Select
                value={editForm.priority}
                onValueChange={(value) =>
                  setEditForm({ ...editForm, priority: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Baixa</SelectItem>
                  <SelectItem value="MEDIUM">Média</SelectItem>
                  <SelectItem value="HIGH">Alta</SelectItem>
                  <SelectItem value="CRITICAL">Crítica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-estimatedHours" className="text-right">
                Horas Estimadas
              </Label>
              <Input
                id="edit-estimatedHours"
                type="number"
                step="0.5"
                value={editForm.estimatedHours}
                onChange={(e) =>
                  setEditForm({ ...editForm, estimatedHours: e.target.value })
                }
                className="col-span-3"
                placeholder="Ex: 8"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-actualHours" className="text-right">
                Horas Reais
              </Label>
              <Input
                id="edit-actualHours"
                type="number"
                step="0.5"
                value={editForm.actualHours}
                onChange={(e) =>
                  setEditForm({ ...editForm, actualHours: e.target.value })
                }
                className="col-span-3"
                placeholder="Ex: 6"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-dueDate" className="text-right">
                Data Limite
              </Label>
              <Input
                id="edit-dueDate"
                type="date"
                value={editForm.dueDate}
                onChange={(e) =>
                  setEditForm({ ...editForm, dueDate: e.target.value })
                }
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-labels" className="text-right">
                Labels
              </Label>
              <Input
                id="edit-labels"
                value={editForm.labels}
                onChange={(e) =>
                  setEditForm({ ...editForm, labels: e.target.value })
                }
                className="col-span-3"
                placeholder="Ex: bug, frontend, urgente"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTask(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Criação */}
      <Dialog open={creatingTask} onOpenChange={setCreatingTask}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nova Tarefa</DialogTitle>
            <DialogDescription>
              Crie uma nova tarefa para o projeto.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="create-title" className="text-right">
                Título
              </Label>
              <Input
                id="create-title"
                value={createForm.title}
                onChange={(e) =>
                  setCreateForm({ ...createForm, title: e.target.value })
                }
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="create-description" className="text-right">
                Descrição
              </Label>
              <Textarea
                id="create-description"
                value={createForm.description}
                onChange={(e) =>
                  setCreateForm({ ...createForm, description: e.target.value })
                }
                className="col-span-3"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="create-status" className="text-right">
                Status
              </Label>
              <Select
                value={createForm.status}
                onValueChange={(value) =>
                  setCreateForm({ ...createForm, status: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODO">A Fazer</SelectItem>
                  <SelectItem value="IN_PROGRESS">Em Progresso</SelectItem>
                  <SelectItem value="REVIEW">Em Revisão</SelectItem>
                  <SelectItem value="DONE">Concluída</SelectItem>
                  <SelectItem value="CANCELLED">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="create-priority" className="text-right">
                Prioridade
              </Label>
              <Select
                value={createForm.priority}
                onValueChange={(value) =>
                  setCreateForm({ ...createForm, priority: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Baixa</SelectItem>
                  <SelectItem value="MEDIUM">Média</SelectItem>
                  <SelectItem value="HIGH">Alta</SelectItem>
                  <SelectItem value="CRITICAL">Crítica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="create-estimatedHours" className="text-right">
                Horas Estimadas
              </Label>
              <Input
                id="create-estimatedHours"
                type="number"
                step="0.5"
                value={createForm.estimatedHours}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    estimatedHours: e.target.value,
                  })
                }
                className="col-span-3"
                placeholder="Ex: 8"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="create-dueDate" className="text-right">
                Data Limite
              </Label>
              <Input
                id="create-dueDate"
                type="date"
                value={createForm.dueDate}
                onChange={(e) =>
                  setCreateForm({ ...createForm, dueDate: e.target.value })
                }
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="create-labels" className="text-right">
                Labels
              </Label>
              <Input
                id="create-labels"
                value={createForm.labels}
                onChange={(e) =>
                  setCreateForm({ ...createForm, labels: e.target.value })
                }
                className="col-span-3"
                placeholder="Ex: bug, frontend, urgente"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreatingTask(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreateTask}
              disabled={!createForm.title || !createForm.status}
            >
              Criar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
