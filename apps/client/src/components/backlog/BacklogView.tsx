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
import {
  GripVertical,
  Eye,
  Pencil,
  Trash,
  ArrowUp,
  ArrowDown,
  Filter,
  Search,
  SortAsc,
  SortDesc,
  Target,
  FileText,
  CheckSquare,
  Calendar,
  User,
  BarChart3,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface BacklogItem {
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
  order: number;
  epicId?: string;
  epicName?: string;
}

interface BacklogViewProps {
  title: string;
  items: BacklogItem[];
  loading: boolean;
  onUpdateItem: (itemId: string, data: Partial<BacklogItem>) => Promise<void>;
  onDeleteItem: (itemId: string) => Promise<void>;
  onViewItem: (item: BacklogItem) => void;
  onEditItem: (item: BacklogItem) => void;
  onCreateItem: (data: Partial<BacklogItem>) => Promise<void>;
  onReorderItems: (itemId: string, newOrder: number) => Promise<void>;
  itemType: "epic" | "story" | "task";
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
  getPriorityColor: (priority: string) => string;
  getPriorityLabel: (priority: string) => string;
}

export function BacklogView({
  title,
  items,
  loading,
  onUpdateItem,
  onDeleteItem,
  onViewItem,
  onEditItem,
  onCreateItem,
  onReorderItems,
  itemType,
  getStatusColor,
  getStatusLabel,
  getPriorityColor,
  getPriorityLabel,
}: BacklogViewProps) {
  const [sortedItems, setSortedItems] = useState<BacklogItem[]>([]);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
    assignee: "",
    epic: "",
  });
  const [sortBy, setSortBy] = useState<{
    field: keyof BacklogItem;
    direction: "asc" | "desc";
  }>({ field: "order", direction: "asc" });
  const [viewingItem, setViewingItem] = useState<BacklogItem | null>(null);
  const [editingItem, setEditingItem] = useState<BacklogItem | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    storyPoints: "",
    dueDate: "",
    order: "",
  });

  useEffect(() => {
    // Aplicar filtros e ordenação
    let filtered = items;

    // Aplicar filtros
    if (filters.search) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          item.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter((item) => item.status === filters.status);
    }

    if (filters.priority) {
      filtered = filtered.filter((item) => item.priority === filters.priority);
    }

    if (filters.assignee) {
      filtered = filtered.filter(
        (item) => item.assigneeId === filters.assignee
      );
    }

    if (filters.epic) {
      filtered = filtered.filter((item) => item.epicId === filters.epic);
    }

    // Aplicar ordenação
    filtered.sort((a, b) => {
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

    setSortedItems(filtered);
  }, [items, filters, sortBy]);

  const handleReorder = async (itemId: string, direction: "up" | "down") => {
    const currentIndex = sortedItems.findIndex((item) => item.id === itemId);
    if (currentIndex === -1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= sortedItems.length) return;

    const item = sortedItems[currentIndex];
    const targetItem = sortedItems[newIndex];

    // Trocar as ordens
    const newOrder = targetItem.order;
    const targetNewOrder = item.order;

    try {
      await onReorderItems(item.id, newOrder);
      await onReorderItems(targetItem.id, targetNewOrder);
    } catch (error) {
      console.error("Erro ao reordenar itens:", error);
    }
  };

  const handleEditItem = (item: BacklogItem) => {
    setEditingItem(item);
    setEditForm({
      title: item.title,
      description: item.description || "",
      status: item.status,
      priority: item.priority,
      storyPoints: item.storyPoints?.toString() || "",
      dueDate: item.dueDate
        ? new Date(item.dueDate).toISOString().split("T")[0]
        : "",
      order: item.order.toString(),
    });
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    try {
      await onUpdateItem(editingItem.id, {
        title: editForm.title,
        description: editForm.description,
        status: editForm.status as any,
        priority: editForm.priority as any,
        storyPoints: editForm.storyPoints
          ? parseInt(editForm.storyPoints)
          : undefined,
        dueDate: editForm.dueDate ? new Date(editForm.dueDate) : undefined,
        order: parseInt(editForm.order),
      });
      setEditingItem(null);
    } catch (error) {
      console.error("Erro ao atualizar item:", error);
    }
  };

  const getItemIcon = () => {
    switch (itemType) {
      case "epic":
        return <Target className="w-4 h-4" />;
      case "story":
        return <FileText className="w-4 h-4" />;
      case "task":
        return <CheckSquare className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
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

  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Carregando backlog...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground">
            Organize e priorize seus itens no backlog
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <SortAsc className="w-4 h-4 mr-2" />
            Ordenar
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>
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
                  placeholder="Buscar..."
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
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="DRAFT">Rascunho</SelectItem>
                  <SelectItem value="BACKLOG">Backlog</SelectItem>
                  <SelectItem value="READY">Pronto</SelectItem>
                  <SelectItem value="IN_PROGRESS">Em Progresso</SelectItem>
                  <SelectItem value="REVIEW">Em Revisão</SelectItem>
                  <SelectItem value="DONE">Concluído</SelectItem>
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
                  <SelectItem value="">Todas</SelectItem>
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
                  setSortBy({ ...sortBy, field: value as keyof BacklogItem })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="order">Ordem</SelectItem>
                  <SelectItem value="priority">Prioridade</SelectItem>
                  <SelectItem value="storyPoints">Story Points</SelectItem>
                  <SelectItem value="dueDate">Data Limite</SelectItem>
                  <SelectItem value="createdAt">Data de Criação</SelectItem>
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
                  <SelectItem value="">Todos</SelectItem>
                  {/* TODO: Listar usuários disponíveis */}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista do Backlog */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Itens do Backlog ({sortedItems.length})</span>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BarChart3 className="w-4 h-4" />
              <span>
                {sortedItems.reduce(
                  (total, item) => total + (item.storyPoints || 0),
                  0
                )}{" "}
                pts totais
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sortedItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-4xl mb-4">{getItemIcon()}</div>
              <p>Nenhum item encontrado</p>
              <p className="text-sm">Ajuste os filtros ou crie novos itens</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sortedItems.map((item, index) => (
                <Card
                  key={item.id}
                  className="border shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Controles de ordenação */}
                      <div className="flex flex-col gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => handleReorder(item.id, "up")}
                          disabled={index === 0}
                        >
                          <ArrowUp className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => handleReorder(item.id, "down")}
                          disabled={index === sortedItems.length - 1}
                        >
                          <ArrowDown className="w-3 h-3" />
                        </Button>
                      </div>

                      {/* Ícone de arrastar */}
                      <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />

                      {/* Informações principais */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getItemIcon()}
                          <h3 className="font-medium">{item.title}</h3>
                          <Badge className="text-xs">#{item.order}</Badge>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            className={`text-xs ${getStatusColor(item.status)}`}
                          >
                            {getStatusLabel(item.status)}
                          </Badge>
                          <Badge
                            className={`text-xs ${getPriorityColor(
                              item.priority
                            )}`}
                          >
                            {getPriorityLabel(item.priority)}
                          </Badge>
                          {item.storyPoints && (
                            <Badge className="text-xs bg-blue-100 text-blue-800">
                              {item.storyPoints} pts
                            </Badge>
                          )}
                          {item.epicName && (
                            <Badge className="text-xs bg-purple-100 text-purple-800">
                              {item.epicName}
                            </Badge>
                          )}
                        </div>

                        {item.description && (
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {item.description}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {item.assigneeName && (
                            <div className="flex items-center gap-1">
                              <Avatar className="w-4 h-4">
                                <AvatarImage src={item.assigneeAvatar} />
                                <AvatarFallback className="text-xs">
                                  {getInitials(item.assigneeName)}
                                </AvatarFallback>
                              </Avatar>
                              <span>{item.assigneeName}</span>
                            </div>
                          )}
                          {item.dueDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(item.dueDate)}</span>
                            </div>
                          )}
                          {item.estimatedHours && (
                            <div className="flex items-center gap-1">
                              <BarChart3 className="w-3 h-3" />
                              <span>{item.estimatedHours}h</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onViewItem(item)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditItem(item)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDeleteItem(item.id)}
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
      <Dialog open={!!viewingItem} onOpenChange={() => setViewingItem(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {getItemIcon()}
              {viewingItem?.title}
            </DialogTitle>
            <DialogDescription>Detalhes do item do backlog</DialogDescription>
          </DialogHeader>

          {viewingItem && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(viewingItem.status)}>
                  {getStatusLabel(viewingItem.status)}
                </Badge>
                <Badge className={getPriorityColor(viewingItem.priority)}>
                  {getPriorityLabel(viewingItem.priority)}
                </Badge>
                {viewingItem.storyPoints && (
                  <Badge className="bg-blue-100 text-blue-800">
                    {viewingItem.storyPoints} pts
                  </Badge>
                )}
                <Badge variant="outline">Ordem: #{viewingItem.order}</Badge>
              </div>

              {viewingItem.description && (
                <div>
                  <Label className="text-sm font-medium">Descrição</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {viewingItem.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-sm font-medium">Criado em</Label>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(viewingItem.createdAt)}
                  </p>
                </div>
                {viewingItem.dueDate && (
                  <div>
                    <Label className="text-sm font-medium">Data Limite</Label>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(viewingItem.dueDate)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingItem(null)}>
              Fechar
            </Button>
            {viewingItem && (
              <Button
                onClick={() => {
                  setViewingItem(null);
                  handleEditItem(viewingItem);
                }}
              >
                Editar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Item</DialogTitle>
            <DialogDescription>
              Faça as alterações necessárias no item.
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
                  <SelectItem value="DRAFT">Rascunho</SelectItem>
                  <SelectItem value="BACKLOG">Backlog</SelectItem>
                  <SelectItem value="READY">Pronto</SelectItem>
                  <SelectItem value="IN_PROGRESS">Em Progresso</SelectItem>
                  <SelectItem value="REVIEW">Em Revisão</SelectItem>
                  <SelectItem value="DONE">Concluído</SelectItem>
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
              <Label htmlFor="edit-order" className="text-right">
                Ordem
              </Label>
              <Input
                id="edit-order"
                type="number"
                value={editForm.order}
                onChange={(e) =>
                  setEditForm({ ...editForm, order: e.target.value })
                }
                className="col-span-3"
              />
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
            <Button variant="outline" onClick={() => setEditingItem(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
