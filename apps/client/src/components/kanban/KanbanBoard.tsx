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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Eye,
  Pencil,
  Trash,
  User,
  Calendar,
  Target,
  FileText,
  CheckSquare,
  Clock,
  BarChart3,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserAvatar from "@/components/common/UserAvatar";

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

interface KanbanBoardProps {
  title: string;
  items: KanbanItem[];
  loading: boolean;
  onUpdateItemStatus: (itemId: string, newStatus: string) => Promise<void>;
  onUpdateItem: (itemId: string, data: Partial<KanbanItem>) => Promise<void>;
  onDeleteItem: (itemId: string) => Promise<void>;
  onViewItem: (item: KanbanItem) => void;
  onEditItem: (item: KanbanItem) => void;
  onCreateItem: (data: Partial<KanbanItem>) => Promise<void>;
  itemType: "epic" | "story" | "task";
  columns: KanbanColumn[];
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
  getPriorityColor: (priority: string) => string;
  getPriorityLabel: (priority: string) => string;
}

export function KanbanBoard({
  title,
  items,
  loading,
  onUpdateItemStatus,
  onUpdateItem,
  onDeleteItem,
  onViewItem,
  onEditItem,
  onCreateItem,
  itemType,
  columns,
  getStatusColor,
  getStatusLabel,
  getPriorityColor,
  getPriorityLabel,
}: KanbanBoardProps) {
  const [kanbanColumns, setKanbanColumns] = useState<KanbanColumn[]>([]);
  const [draggedItem, setDraggedItem] = useState<KanbanItem | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    assigneeId: "",
    storyPoints: "",
    estimatedHours: "",
    dueDate: "",
  });

  useEffect(() => {
    // Organizar itens por colunas
    const organizedColumns = columns.map((column) => ({
      ...column,
      items: items.filter((item) => item.status === column.status),
    }));
    setKanbanColumns(organizedColumns);
  }, [items, columns]);

  const handleDragStart = (e: React.DragEvent, item: KanbanItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.status === targetStatus) return;

    try {
      await onUpdateItemStatus(draggedItem.id, targetStatus);
      setDraggedItem(null);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const handleCreateItem = async () => {
    if (!createForm.title || !createForm.status) return;

    try {
      await onCreateItem({
        title: createForm.title,
        description: createForm.description,
        status: createForm.status,
        priority: createForm.priority,
        assigneeId: createForm.assigneeId || undefined,
        storyPoints: createForm.storyPoints
          ? parseInt(createForm.storyPoints)
          : undefined,
        estimatedHours: createForm.estimatedHours
          ? parseFloat(createForm.estimatedHours)
          : undefined,
        dueDate: createForm.dueDate || undefined,
      });
      setShowCreateDialog(false);
      setCreateForm({
        title: "",
        description: "",
        status: "",
        priority: "",
        assigneeId: "",
        storyPoints: "",
        estimatedHours: "",
        dueDate: "",
      });
    } catch (error) {
      console.error("Erro ao criar item:", error);
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
        Carregando quadro Kanban...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground">
            Visualize e organize seus itens por status
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Criar{" "}
          {itemType === "epic"
            ? "Épico"
            : itemType === "story"
            ? "História"
            : "Tarefa"}
        </Button>
      </div>

      {/* Quadro Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {kanbanColumns.map((column) => (
          <div
            key={column.id}
            className="space-y-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.status)}
          >
            {/* Cabeçalho da coluna */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${column.color}`} />
                <h3 className="font-semibold">{column.title}</h3>
                <Badge variant="secondary" className="text-xs">
                  {column.items.length}
                </Badge>
              </div>
            </div>

            {/* Itens da coluna */}
            <div className="space-y-3 min-h-[200px]">
              {column.items.map((item) => (
                <Card
                  key={item.id}
                  className="cursor-pointer hover:shadow-md transition-shadow border-l-4"
                  style={{ borderLeftColor: column.color }}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  onClick={() => onViewItem(item)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      {getItemIcon()}
                      {item.title}
                    </CardTitle>
                    <CardDescription className="text-xs space-y-1">
                      <div className="flex gap-2">
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
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {item.description && (
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {item.assigneeName && (
                          <div className="flex items-center gap-2">
                            <UserAvatar
                              name={item.assigneeName}
                              avatarUrl={item.assigneeAvatar}
                              size="sm"
                            />
                            <span className="text-xs text-gray-600">
                              {item.assigneeName}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditItem(item);
                          }}
                        >
                          <Pencil className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteItem(item.id);
                          }}
                        >
                          <Trash className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Informações adicionais */}
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      {item.estimatedHours && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{item.estimatedHours}h</span>
                        </div>
                      )}
                      {item.dueDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(item.dueDate)}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal de criação */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Criar{" "}
              {itemType === "epic"
                ? "Épico"
                : itemType === "story"
                ? "História"
                : "Tarefa"}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações para criar um novo item.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Título
              </Label>
              <Input
                id="title"
                value={createForm.title}
                onChange={(e) =>
                  setCreateForm({ ...createForm, title: e.target.value })
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
                value={createForm.description}
                onChange={(e) =>
                  setCreateForm({ ...createForm, description: e.target.value })
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
                value={createForm.status}
                onValueChange={(value) =>
                  setCreateForm({ ...createForm, status: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((column) => (
                    <SelectItem key={column.status} value={column.status}>
                      {column.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
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

            {itemType === "story" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="storyPoints" className="text-right">
                  Story Points
                </Label>
                <Input
                  id="storyPoints"
                  type="number"
                  value={createForm.storyPoints}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      storyPoints: e.target.value,
                    })
                  }
                  className="col-span-3"
                  placeholder="Ex: 5"
                />
              </div>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="estimatedHours" className="text-right">
                Horas Estimadas
              </Label>
              <Input
                id="estimatedHours"
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
              <Label htmlFor="dueDate" className="text-right">
                Data Limite
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={createForm.dueDate}
                onChange={(e) =>
                  setCreateForm({ ...createForm, dueDate: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateItem}
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
