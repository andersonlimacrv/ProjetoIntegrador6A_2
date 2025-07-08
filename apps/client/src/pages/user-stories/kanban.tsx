import { useState, useEffect } from "react";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { userStoriesApi } from "@/services/domains/userStoriesApi";
import type { UserStory } from "@packages/shared";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FileText,
  Eye,
  Pencil,
  Trash,
  Filter,
  Search,
  BarChart3,
  Target,
  Calendar,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface KanbanItem {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  assigneeId?: string;
  assigneeName?: string;
  assigneeAvatar?: string;
  storyPoints?: number;
  estimatedHours?: number;
  actualHours?: number;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface KanbanColumn {
  id: string;
  title: string;
  status: string;
  color: string;
  items: KanbanItem[];
}

export function UserStoriesKanbanPage() {
  const [userStories, setUserStories] = useState<UserStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredStories, setFilteredStories] = useState<UserStory[]>([]);
  const [viewingStory, setViewingStory] = useState<UserStory | null>(null);
  const [editingStory, setEditingStory] = useState<UserStory | null>(null);
  const [filters, setFilters] = useState({
    search: "",
    priority: "",
    assignee: "",
    epic: "",
  });
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    storyPoints: "",
    dueDate: "",
  });

  // Colunas do Kanban para histórias de usuário
  const kanbanColumns: KanbanColumn[] = [
    {
      id: "backlog",
      title: "Backlog",
      status: "BACKLOG",
      color: "#3b82f6",
      items: [],
    },
    {
      id: "ready",
      title: "Pronta",
      status: "READY",
      color: "#10b981",
      items: [],
    },
    {
      id: "in-progress",
      title: "Em Progresso",
      status: "IN_PROGRESS",
      color: "#f59e0b",
      items: [],
    },
    {
      id: "review",
      title: "Em Revisão",
      status: "REVIEW",
      color: "#8b5cf6",
      items: [],
    },
    {
      id: "done",
      title: "Concluída",
      status: "DONE",
      color: "#059669",
      items: [],
    },
  ];

  const fetchUserStories = () => {
    setLoading(true);
    userStoriesApi.getAll().then((res) => {
      if (res.success && res.data) {
        setUserStories(res.data);
        setFilteredStories(res.data);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchUserStories();
  }, []);

  useEffect(() => {
    // Aplicar filtros
    let filtered = userStories;

    if (filters.search) {
      filtered = filtered.filter(
        (story) =>
          story.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          story.description
            ?.toLowerCase()
            .includes(filters.search.toLowerCase())
      );
    }

    if (filters.priority) {
      filtered = filtered.filter(
        (story) => story.priority === filters.priority
      );
    }

    if (filters.assignee) {
      filtered = filtered.filter(
        (story) => story.assigneeId === filters.assignee
      );
    }

    if (filters.epic) {
      filtered = filtered.filter((story) => story.epicId === filters.epic);
    }

    setFilteredStories(filtered);
  }, [userStories, filters]);

  const handleUpdateStatus = async (storyId: string, newStatus: string) => {
    try {
      const res = await userStoriesApi.update(storyId, {
        status: newStatus as any,
      });
      if (res.success && res.data) {
        setUserStories((prev) =>
          prev.map((story) => (story.id === storyId ? res.data! : story))
        );
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const handleUpdateStory = async (
    storyId: string,
    data: Partial<KanbanItem>
  ) => {
    try {
      const res = await userStoriesApi.update(storyId, data as any);
      if (res.success && res.data) {
        setUserStories((prev) =>
          prev.map((story) => (story.id === storyId ? res.data! : story))
        );
      }
    } catch (error) {
      console.error("Erro ao atualizar história:", error);
    }
  };

  const handleDeleteStory = async (storyId: string) => {
    if (confirm("Tem certeza que deseja deletar esta história?")) {
      try {
        const res = await userStoriesApi.delete(storyId);
        if (res.success) {
          setUserStories((prev) =>
            prev.filter((story) => story.id !== storyId)
          );
        }
      } catch (error) {
        console.error("Erro ao deletar história:", error);
      }
    }
  };

  const handleCreateStory = async (data: Partial<KanbanItem>) => {
    try {
      const res = await userStoriesApi.create(data as any);
      if (res.success && res.data) {
        setUserStories((prev) => [...prev, res.data!]);
      }
    } catch (error) {
      console.error("Erro ao criar história:", error);
    }
  };

  const handleViewStory = (story: UserStory) => {
    setViewingStory(story);
  };

  const handleEditStory = (story: UserStory) => {
    setEditingStory(story);
    setEditForm({
      title: story.title,
      description: story.description || "",
      status: story.status,
      priority: story.priority,
      storyPoints: story.storyPoints?.toString() || "",
      dueDate: story.dueDate
        ? new Date(story.dueDate).toISOString().split("T")[0]
        : "",
    });
  };

  const handleSaveEdit = async () => {
    if (!editingStory) return;

    try {
      const res = await userStoriesApi.update(editingStory.id, {
        title: editForm.title,
        description: editForm.description,
        status: editForm.status as any,
        priority: editForm.priority as any,
        storyPoints: editForm.storyPoints
          ? parseInt(editForm.storyPoints)
          : undefined,
        dueDate: editForm.dueDate ? new Date(editForm.dueDate) : undefined,
      });

      if (res.success && res.data) {
        setUserStories((prev) =>
          prev.map((story) =>
            story.id === editingStory.id ? res.data! : story
          )
        );
        setEditingStory(null);
      }
    } catch (error) {
      console.error("Erro ao atualizar história:", error);
    }
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
        return "bg-purple-100 text-purple-800";
      case "DONE":
        return "bg-emerald-100 text-emerald-800";
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  // Converter UserStory para KanbanItem
  const kanbanItems: KanbanItem[] = filteredStories.map((story) => ({
    id: story.id,
    title: story.title,
    description: story.description,
    status: story.status,
    priority: story.priority,
    assigneeId: story.assigneeId,
    assigneeName: story.assigneeId, // TODO: Buscar nome do usuário
    assigneeAvatar: undefined,
    storyPoints: story.storyPoints,
    estimatedHours: undefined,
    actualHours: undefined,
    dueDate: story.dueDate,
    createdAt: story.createdAt,
    updatedAt: story.updatedAt,
  }));

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
          <CardDescription>
            Filtre as histórias de usuário para visualizar no quadro Kanban
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Buscar por título ou descrição..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
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
                  <SelectValue placeholder="Todas as prioridades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  <SelectItem value="LOW">Baixa</SelectItem>
                  <SelectItem value="MEDIUM">Média</SelectItem>
                  <SelectItem value="HIGH">Alta</SelectItem>
                  <SelectItem value="CRITICAL">Crítica</SelectItem>
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
                  <SelectValue placeholder="Todos os responsáveis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  {/* TODO: Listar usuários disponíveis */}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="epic">Épico</Label>
              <Select
                value={filters.epic}
                onValueChange={(value) =>
                  setFilters({ ...filters, epic: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os épicos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  {/* TODO: Listar épicos disponíveis */}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {kanbanColumns.map((column) => {
          const count = filteredStories.filter(
            (story) => story.status === column.status
          ).length;
          const totalPoints = filteredStories
            .filter((story) => story.status === column.status)
            .reduce((sum, story) => sum + (story.storyPoints || 0), 0);

          return (
            <Card key={column.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{column.title}</p>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-xs text-muted-foreground">
                      {totalPoints} pts
                    </p>
                  </div>
                  <div
                    className={`w-3 h-3 rounded-full`}
                    style={{ backgroundColor: column.color }}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quadro Kanban */}
      <KanbanBoard
        title="Quadro Kanban - Histórias de Usuário"
        items={kanbanItems}
        loading={loading}
        onUpdateItemStatus={handleUpdateStatus}
        onUpdateItem={handleUpdateStory}
        onDeleteItem={handleDeleteStory}
        onViewItem={handleViewStory}
        onEditItem={handleEditStory}
        onCreateItem={handleCreateStory}
        itemType="story"
        columns={kanbanColumns}
        getStatusColor={getStatusColor}
        getStatusLabel={getStatusLabel}
        getPriorityColor={getPriorityColor}
        getPriorityLabel={getPriorityLabel}
      />

      {/* Modal de Visualização */}
      <Dialog open={!!viewingStory} onOpenChange={() => setViewingStory(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {viewingStory?.title}
            </DialogTitle>
            <DialogDescription>
              Detalhes da história de usuário
            </DialogDescription>
          </DialogHeader>

          {viewingStory && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
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

              {viewingStory.description && (
                <div>
                  <Label className="text-sm font-medium">Descrição</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {viewingStory.description}
                  </p>
                </div>
              )}

              {viewingStory.acceptanceCriteria && (
                <div>
                  <Label className="text-sm font-medium">
                    Critérios de Aceitação
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {viewingStory.acceptanceCriteria}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-sm font-medium">Criado em</Label>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(viewingStory.createdAt)}
                  </p>
                </div>
                {viewingStory.dueDate && (
                  <div>
                    <Label className="text-sm font-medium">Data Limite</Label>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(viewingStory.dueDate)}
                    </p>
                  </div>
                )}
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
                Editar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={!!editingStory} onOpenChange={() => setEditingStory(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar História</DialogTitle>
            <DialogDescription>
              Faça as alterações necessárias na história.
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
                  {kanbanColumns.map((column) => (
                    <SelectItem key={column.status} value={column.status}>
                      {column.title}
                    </SelectItem>
                  ))}
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
              <Label htmlFor="edit-storyPoints" className="text-right">
                Story Points
              </Label>
              <Input
                id="edit-storyPoints"
                type="number"
                value={editForm.storyPoints}
                onChange={(e) =>
                  setEditForm({ ...editForm, storyPoints: e.target.value })
                }
                className="col-span-3"
                placeholder="Ex: 5"
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
