import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Target,
  Eye,
  Pencil,
  Trash,
  FileText,
  Calendar,
  Users,
  BarChart3,
  Plus,
} from "lucide-react";
import { epicsApi } from "@/services/domains/epicsApi";
import { userStoriesApi } from "@/services/domains/userStoriesApi";
import type { Epic, UserStory } from "@packages/shared";
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

export function EpicsPage() {
  const [epics, setEpics] = useState<Epic[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEpic, setEditingEpic] = useState<Epic | null>(null);
  const [viewingEpic, setViewingEpic] = useState<Epic | null>(null);
  const [epicStories, setEpicStories] = useState<UserStory[]>([]);
  const [loadingStories, setLoadingStories] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    status: "",
    priority: "",
  });

  const { addToast } = useToast();

  const fetchEpics = async () => {
    try {
      setLoading(true);
      const response = await epicsApi.getAll();

      if (response.ok && response.data.success) {
        setEpics(response.data.data || []);
      } else {
        addToast({
          title: "Erro ao carregar épicos",
          description:
            response.data.message ||
            response.data.error ||
            "Ocorreu um erro ao buscar os épicos.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Erro ao buscar épicos:", error);
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

  const fetchEpicStories = async (epicId: string) => {
    setLoadingStories(true);
    try {
      const res = await userStoriesApi.getByEpic(epicId);
      if (res.success && res.data) {
        setEpicStories(res.data);
      }
    } catch (error) {
      console.error("Erro ao buscar histórias do épico:", error);
    } finally {
      setLoadingStories(false);
    }
  };

  useEffect(() => {
    fetchEpics();
  }, []);

  const handleDeleteEpic = async (epicId: string) => {
    if (confirm("Tem certeza que deseja deletar este épico?")) {
      const res = await epicsApi.delete(epicId);
      if (res.success) {
        setEpics((prev) => prev.filter((e) => e.id !== epicId));
      } else {
        console.error("Erro ao deletar épico:", res.error);
      }
    }
  };

  const handleEditEpic = (epic: Epic) => {
    setEditingEpic(epic);
    setEditForm({
      name: epic.name,
      description: epic.description || "",
      status: epic.status,
      priority: epic.priority,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingEpic) return;

    const res = await epicsApi.update(editingEpic.id, {
      name: editForm.name,
      description: editForm.description,
      status: editForm.status as any,
      priority: editForm.priority as any,
    });

    if (res.success && res.data) {
      setEpics((prev) =>
        prev.map((e) => (e.id === editingEpic.id ? res.data! : e))
      );
      setEditingEpic(null);
    } else {
      console.error("Erro ao atualizar épico:", res.error);
    }
  };

  const handleViewEpic = (epic: Epic) => {
    setViewingEpic(epic);
    fetchEpicStories(epic.id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-gray-100 text-gray-800";
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "REVIEW":
        return "bg-yellow-100 text-yellow-800";
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
      case "ACTIVE":
        return "Ativo";
      case "IN_PROGRESS":
        return "Em Progresso";
      case "REVIEW":
        return "Em Revisão";
      case "DONE":
        return "Concluído";
      case "CANCELLED":
        return "Cancelado";
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

  const getStoryStatusColor = (status: string) => {
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

  const getStoryStatusLabel = (status: string) => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Épicos</h1>
        <p className="text-muted-foreground">
          Gerencie os épicos do seu projeto.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Seus Épicos
          </CardTitle>
          <CardDescription>
            Visualize e gerencie todos os seus épicos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando...
            </div>
          ) : epics.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum épico encontrado
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {epics.map((epic) => (
                <Card key={epic.id} className="border shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      {epic.name}
                    </CardTitle>
                    <CardDescription className="text-xs space-y-1">
                      <div className="flex gap-2">
                        <Badge
                          className={`text-xs ${getStatusColor(epic.status)}`}
                        >
                          {getStatusLabel(epic.status)}
                        </Badge>
                        <Badge
                          className={`text-xs ${getPriorityColor(
                            epic.priority
                          )}`}
                        >
                          {getPriorityLabel(epic.priority)}
                        </Badge>
                      </div>
                    </CardDescription>
                    {epic.description && (
                      <CardDescription className="text-xs mt-2">
                        {epic.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewEpic(epic)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditEpic(epic)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteEpic(epic.id)}
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
      <Dialog open={!!viewingEpic} onOpenChange={() => setViewingEpic(null)}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {viewingEpic?.name}
            </DialogTitle>
            <DialogDescription>Detalhes completos do épico</DialogDescription>
          </DialogHeader>

          {viewingEpic && (
            <div className="space-y-6">
              {/* Informações Básicas */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Informações Gerais</h3>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(viewingEpic.status)}>
                      {getStatusLabel(viewingEpic.status)}
                    </Badge>
                    <Badge className={getPriorityColor(viewingEpic.priority)}>
                      {getPriorityLabel(viewingEpic.priority)}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">
                      ID:
                    </span>
                    <p className="font-mono text-xs">{viewingEpic.id}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">
                      Criado em:
                    </span>
                    <p>{formatDate(viewingEpic.createdAt)}</p>
                  </div>
                  {viewingEpic.updatedAt && (
                    <div>
                      <span className="font-medium text-muted-foreground">
                        Atualizado em:
                      </span>
                      <p>{formatDate(viewingEpic.updatedAt)}</p>
                    </div>
                  )}
                </div>

                {viewingEpic.description && (
                  <div>
                    <span className="font-medium text-muted-foreground">
                      Descrição:
                    </span>
                    <p className="mt-1 text-sm">{viewingEpic.description}</p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Estatísticas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Estatísticas</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <FileText className="h-6 w-6 mx-auto text-blue-600 mb-2" />
                    <p className="text-2xl font-bold text-blue-600">
                      {epicStories.length}
                    </p>
                    <p className="text-xs text-muted-foreground">Histórias</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <BarChart3 className="h-6 w-6 mx-auto text-green-600 mb-2" />
                    <p className="text-2xl font-bold text-green-600">
                      {epicStories.reduce(
                        (total, story) => total + (story.storyPoints || 0),
                        0
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Story Points
                    </p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <Calendar className="h-6 w-6 mx-auto text-purple-600 mb-2" />
                    <p className="text-2xl font-bold text-purple-600">0</p>
                    <p className="text-xs text-muted-foreground">Sprints</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Histórias do Épico */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Histórias do Épico</h3>
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar História
                  </Button>
                </div>

                {loadingStories ? (
                  <div className="text-center py-4 text-muted-foreground">
                    Carregando histórias...
                  </div>
                ) : epicStories.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma história criada ainda</p>
                    <p className="text-sm">
                      Clique em "Criar História" para começar
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {epicStories.map((story) => (
                      <Card key={story.id} className="border shadow-sm">
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center gap-2 text-sm">
                            <FileText className="h-3 w-3" />
                            {story.title}
                          </CardTitle>
                          <CardDescription className="text-xs space-y-1">
                            <div className="flex gap-2">
                              <Badge
                                className={`text-xs ${getStoryStatusColor(
                                  story.status
                                )}`}
                              >
                                {getStoryStatusLabel(story.status)}
                              </Badge>
                              {story.storyPoints && (
                                <Badge className="text-xs bg-blue-100 text-blue-800">
                                  {story.storyPoints} pts
                                </Badge>
                              )}
                            </div>
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          {story.description && (
                            <p className="text-xs text-muted-foreground mb-2">
                              {story.description}
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
                    <FileText className="w-4 h-4 mr-2" />
                    Criar História
                  </Button>
                  <Button size="sm" variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
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
            <Button variant="outline" onClick={() => setViewingEpic(null)}>
              Fechar
            </Button>
            {viewingEpic && (
              <Button
                onClick={() => {
                  setViewingEpic(null);
                  handleEditEpic(viewingEpic);
                }}
              >
                Editar Épico
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={!!editingEpic} onOpenChange={() => setEditingEpic(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Épico</DialogTitle>
            <DialogDescription>
              Faça as alterações necessárias no épico.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
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
                  <SelectItem value="ACTIVE">Ativo</SelectItem>
                  <SelectItem value="IN_PROGRESS">Em Progresso</SelectItem>
                  <SelectItem value="REVIEW">Em Revisão</SelectItem>
                  <SelectItem value="DONE">Concluído</SelectItem>
                  <SelectItem value="CANCELLED">Cancelado</SelectItem>
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingEpic(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
