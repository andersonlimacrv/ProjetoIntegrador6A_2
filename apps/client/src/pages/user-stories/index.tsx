import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileText,
  Eye,
  Pencil,
  Trash,
  Calendar,
  Users,
  BarChart3,
  CheckCircle,
  Clock,
  Target,
  CheckSquare,
  Plus,
} from "lucide-react";
import { userStoriesApi } from "@/services/domains/userStoriesApi";
import { tasksApi } from "@/services/domains/tasksApi";
import type { UserStory, Task } from "@packages/shared";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/contexts/toast-context";

export function UserStoriesPage() {
  const [userStories, setUserStories] = useState<UserStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStory, setEditingStory] = useState<UserStory | null>(null);
  const [viewingStory, setViewingStory] = useState<UserStory | null>(null);
  const [storyTasks, setStoryTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    acceptanceCriteria: "",
    status: "",
    priority: "",
    storyPoints: "",
  });

  const { addToast } = useToast();

  const fetchUserStories = async () => {
    try {
      setLoading(true);
      const response = await userStoriesApi.getAll();

      if (response.ok && response.data.success) {
        setUserStories(response.data.data || []);
      } else {
        addToast({
          title: "Erro ao carregar histórias de usuário",
          description: response.data.message || response.data.error || "Ocorreu um erro ao buscar as histórias de usuário.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Erro ao buscar histórias de usuário:", error);
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

  const fetchStoryTasks = async (storyId: string) => {
    setLoadingTasks(true);
    try {
      const res = await userStoriesApi.getTasks(storyId);
      if (res.success && res.data) {
        setStoryTasks(res.data);
      }
    } catch (error) {
      console.error("Erro ao buscar tarefas da história:", error);
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    fetchUserStories();
  }, []);

  const handleDeleteStory = async (storyId: string) => {
    if (confirm("Tem certeza que deseja deletar esta história de usuário?")) {
      const res = await userStoriesApi.delete(storyId);
      if (res.success) {
        setUserStories((prev) => prev.filter((s) => s.id !== storyId));
      } else {
        console.error("Erro ao deletar história de usuário:", res.error);
      }
    }
  };

  const handleEditStory = (story: UserStory) => {
    setEditingStory(story);
    setEditForm({
      title: story.title,
      description: story.description || "",
      acceptanceCriteria: story.acceptanceCriteria || "",
      status: story.status,
      priority: story.priority,
      storyPoints: story.storyPoints?.toString() || "",
    });
  };

  const handleSaveEdit = async () => {
    if (!editingStory) return;

    const res = await userStoriesApi.update(editingStory.id, {
      title: editForm.title,
      description: editForm.description,
      acceptanceCriteria: editForm.acceptanceCriteria,
      status: editForm.status as any,
      priority: editForm.priority as any,
      storyPoints: editForm.storyPoints ? parseInt(editForm.storyPoints) : null,
    });

    if (res.success && res.data) {
      setUserStories((prev) =>
        prev.map((s) => (s.id === editingStory.id ? res.data! : s))
      );
      setEditingStory(null);
    } else {
      console.error("Erro ao atualizar história de usuário:", res.error);
    }
  };

  const handleViewStory = (story: UserStory) => {
    setViewingStory(story);
    fetchStoryTasks(story.id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-gray-100 text-gray-800";
      case "BACKLOG":
        return "bg-blue-100 text-blue-800";
      case "READY":
        return "bg-green-100 text-green-800";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800";
      case "REVIEW":
        return "bg-orange-100 text-orange-800";
      case "DONE":
        return "bg-purple-100 text-purple-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "Rascunho";
      case "BACKLOG":
        return "Backlog";
      case "READY":
        return "Pronta";
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

  const getTaskStatusColor = (status: string) => {
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

  const getTaskStatusLabel = (status: string) => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Histórias de Usuário
        </h1>
        <p className="text-muted-foreground">
          Gerencie as histórias de usuário do seu projeto.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Suas Histórias de Usuário
          </CardTitle>
          <CardDescription>
            Visualize e gerencie todas as suas histórias de usuário
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando...
            </div>
          ) : userStories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma história de usuário encontrada
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userStories.map((story) => (
                <Card key={story.id} className="border shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {story.title}
                    </CardTitle>
                    <CardDescription className="text-xs space-y-1">
                      <div className="flex gap-2">
                        <Badge
                          className={`text-xs ${getStatusColor(story.status)}`}
                        >
                          {getStatusLabel(story.status)}
                        </Badge>
                        <Badge
                          className={`text-xs ${getPriorityColor(
                            story.priority
                          )}`}
                        >
                          {getPriorityLabel(story.priority)}
                        </Badge>
                      </div>
                      {story.storyPoints && (
                        <div className="flex items-center gap-1 text-xs">
                          <BarChart3 className="w-3 h-3" />
                          <span>{story.storyPoints} pontos</span>
                        </div>
                      )}
                    </CardDescription>
                    {story.description && (
                      <CardDescription className="text-xs mt-2">
                        {story.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewStory(story)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditStory(story)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteStory(story.id)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Visualização Detalhada */}
      <Dialog open={!!viewingStory} onOpenChange={() => setViewingStory(null)}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {viewingStory?.title}
            </DialogTitle>
            <DialogDescription>
              Detalhes completos da história de usuário
            </DialogDescription>
          </DialogHeader>

          {viewingStory && (
            <div className="space-y-6">
              {/* Informações Básicas */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Informações Gerais</h3>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(viewingStory.status)}>
                      {getStatusLabel(viewingStory.status)}
                    </Badge>
                    <Badge className={getPriorityColor(viewingStory.priority)}>
                      {getPriorityLabel(viewingStory.priority)}
                    </Badge>
                    {viewingStory.storyPoints && (
                      <Badge className="bg-blue-100 text-blue-800">
                        {viewingStory.storyPoints} pts
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">
                      ID:
                    </span>
                    <p className="font-mono text-xs">{viewingStory.id}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">
                      Criado em:
                    </span>
                    <p>{formatDate(viewingStory.createdAt)}</p>
                  </div>
                  {viewingStory.updatedAt && (
                    <div>
                      <span className="font-medium text-muted-foreground">
                        Atualizado em:
                      </span>
                      <p>{formatDate(viewingStory.updatedAt)}</p>
                    </div>
                  )}
                </div>

                {viewingStory.description && (
                  <div>
                    <span className="font-medium text-muted-foreground">
                      Descrição:
                    </span>
                    <p className="mt-1 text-sm">{viewingStory.description}</p>
                  </div>
                )}

                {viewingStory.acceptanceCriteria && (
                  <div>
                    <span className="font-medium text-muted-foreground">
                      Critérios de Aceitação:
                    </span>
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm whitespace-pre-wrap">
                        {viewingStory.acceptanceCriteria}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Estatísticas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Estatísticas</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <CheckSquare className="h-6 w-6 mx-auto text-blue-600 mb-2" />
                    <p className="text-2xl font-bold text-blue-600">
                      {storyTasks.length}
                    </p>
                    <p className="text-xs text-muted-foreground">Tarefas</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <BarChart3 className="h-6 w-6 mx-auto text-green-600 mb-2" />
                    <p className="text-2xl font-bold text-green-600">
                      {storyTasks.reduce(
                        (total, task) => total + (task.estimatedHours || 0),
                        0
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Horas Estimadas
                    </p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <Clock className="h-6 w-6 mx-auto text-purple-600 mb-2" />
                    <p className="text-2xl font-bold text-purple-600">
                      {storyTasks.reduce(
                        (total, task) => total + (task.actualHours || 0),
                        0
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">Horas Reais</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <Users className="h-6 w-6 mx-auto text-orange-600 mb-2" />
                    <p className="text-2xl font-bold text-orange-600">0</p>
                    <p className="text-xs text-muted-foreground">
                      Responsáveis
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Tarefas da História */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Tarefas da História</h3>
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Tarefa
                  </Button>
                </div>

                {loadingTasks ? (
                  <div className="text-center py-4 text-muted-foreground">
                    Carregando tarefas...
                  </div>
                ) : storyTasks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma tarefa criada ainda</p>
                    <p className="text-sm">
                      Clique em "Criar Tarefa" para começar
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {storyTasks.map((task) => (
                      <Card key={task.id} className="border shadow-sm">
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center gap-2 text-sm">
                            <CheckSquare className="h-3 w-3" />
                            {task.title}
                          </CardTitle>
                          <CardDescription className="text-xs space-y-1">
                            <div className="flex gap-2">
                              <Badge
                                className={`text-xs ${getTaskStatusColor(
                                  task.status
                                )}`}
                              >
                                {getTaskStatusLabel(task.status)}
                              </Badge>
                              {task.estimatedHours && (
                                <Badge className="text-xs bg-blue-100 text-blue-800">
                                  {task.estimatedHours}h
                                </Badge>
                              )}
                            </div>
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          {task.description && (
                            <p className="text-xs text-muted-foreground mb-2">
                              {task.description}
                            </p>
                          )}
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 px-2"
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 px-2"
                            >
                              <Pencil className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 px-2"
                            >
                              <Trash className="w-3 h-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              {/* Ações Rápidas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Ações Rápidas</h3>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline">
                    <CheckSquare className="w-4 h-4 mr-2" />
                    Criar Tarefa
                  </Button>
                  <Button size="sm" variant="outline">
                    <Target className="w-4 h-4 mr-2" />
                    Associar Épico
                  </Button>
                  <Button size="sm" variant="outline">
                    <Clock className="w-4 h-4 mr-2" />
                    Planejar Sprint
                  </Button>
                  <Button size="sm" variant="outline">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Ver Métricas
                  </Button>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingStory(null)}>
              Fechar
            </Button>
            {viewingStory && (
              <Button
                onClick={() => {
                  setViewingStory(null);
                  handleEditStory(viewingStory);
                }}
              >
                Editar História
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={!!editingStory} onOpenChange={() => setEditingStory(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar História de Usuário</DialogTitle>
            <DialogDescription>
              Faça as alterações necessárias na história de usuário.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Título
              </Label>
              <Input
                id="title"
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Descrição
              </Label>
              <Textarea
                id="description"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                className="col-span-3"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="acceptanceCriteria" className="text-right">
                Critérios
              </Label>
              <Textarea
                id="acceptanceCriteria"
                value={editForm.acceptanceCriteria}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    acceptanceCriteria: e.target.value,
                  })
                }
                className="col-span-3"
                rows={3}
                placeholder="Critérios de aceitação..."
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
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
                  <SelectItem value="DRAFT">Rascunho</SelectItem>
                  <SelectItem value="BACKLOG">Backlog</SelectItem>
                  <SelectItem value="READY">Pronta</SelectItem>
                  <SelectItem value="IN_PROGRESS">Em Progresso</SelectItem>
                  <SelectItem value="REVIEW">Em Revisão</SelectItem>
                  <SelectItem value="DONE">Concluída</SelectItem>
                  <SelectItem value="CANCELLED">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
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
              <Label htmlFor="storyPoints" className="text-right">
                Pontos
              </Label>
              <Input
                id="storyPoints"
                type="number"
                min="1"
                max="21"
                value={editForm.storyPoints}
                onChange={(e) =>
                  setEditForm({ ...editForm, storyPoints: e.target.value })
                }
                className="col-span-3"
                placeholder="1-21"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingStory(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
