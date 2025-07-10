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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  MessageSquare,
  Plus,
  Send,
  Edit,
  Trash,
  MoreHorizontal,
  User,
  FileText,
  CheckSquare,
  Target,
  Calendar,
  Clock,
  ThumbsUp,
  Reply,
  Filter,
  Search,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "@/components/common/UserAvatar";

interface Activity {
  id: string;
  type: "comment" | "status_change" | "assignment" | "creation" | "update";
  entityType: "task" | "story" | "epic" | "sprint" | "project";
  entityId: string;
  entityTitle: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content?: string;
  oldValue?: string;
  newValue?: string;
  createdAt: string;
  updatedAt?: string;
  likes: number;
  replies: Comment[];
}

interface Comment {
  id: string;
  content: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  createdAt: string;
  updatedAt?: string;
  likes: number;
  replies: Comment[];
}

interface ActivityFeedProps {
  entityId: string;
  entityType: "task" | "story" | "epic" | "sprint" | "project";
  entityTitle: string;
  activities: Activity[];
  loading: boolean;
  onAddComment: (content: string) => Promise<void>;
  onUpdateComment: (commentId: string, content: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
  onLikeActivity: (activityId: string) => Promise<void>;
  onReplyToComment: (commentId: string, content: string) => Promise<void>;
}

export function ActivityFeed({
  entityId,
  entityType,
  entityTitle,
  activities,
  loading,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  onLikeActivity,
  onReplyToComment,
}: ActivityFeedProps) {
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState<{
    id: string;
    content: string;
  } | null>(null);
  const [replyingTo, setReplyingTo] = useState<{
    id: string;
    userName: string;
  } | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    user: "",
  });

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    try {
      await onAddComment(newComment);
      setNewComment("");
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingComment) return;

    try {
      await onUpdateComment(editingComment.id, editingComment.content);
      setEditingComment(null);
    } catch (error) {
      console.error("Erro ao atualizar comentário:", error);
    }
  };

  const handleSubmitReply = async () => {
    if (!replyingTo || !replyContent.trim()) return;

    try {
      await onReplyToComment(replyingTo.id, replyContent);
      setReplyingTo(null);
      setReplyContent("");
    } catch (error) {
      console.error("Erro ao adicionar resposta:", error);
    }
  };

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "comment":
        return <MessageSquare className="w-4 h-4" />;
      case "status_change":
        return <CheckSquare className="w-4 h-4" />;
      case "assignment":
        return <User className="w-4 h-4" />;
      case "creation":
        return <Plus className="w-4 h-4" />;
      case "update":
        return <Edit className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: Activity["type"]) => {
    switch (type) {
      case "comment":
        return "text-blue-600";
      case "status_change":
        return "text-green-600";
      case "assignment":
        return "text-purple-600";
      case "creation":
        return "text-orange-600";
      case "update":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const getActivityLabel = (type: Activity["type"]) => {
    switch (type) {
      case "comment":
        return "Comentou";
      case "status_change":
        return "Alterou status";
      case "assignment":
        return "Atribuiu";
      case "creation":
        return "Criou";
      case "update":
        return "Atualizou";
      default:
        return "Ação";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "Agora mesmo";
    } else if (diffInHours < 24) {
      return `${diffInHours}h atrás`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `${diffInDays}d atrás`;
      } else {
        return date.toLocaleDateString("pt-BR");
      }
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredActivities = activities.filter((activity) => {
    if (
      filters.search &&
      !activity.content?.toLowerCase().includes(filters.search.toLowerCase())
    )
      return false;
    if (filters.type && activity.type !== filters.type) return false;
    if (filters.user && activity.userId !== filters.user) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Atividades e Comentários</h3>
          <p className="text-sm text-muted-foreground">
            Acompanhe as atividades de {entityTitle}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Buscar em comentários..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <select
                id="type"
                value={filters.type}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value })
                }
                className="w-full px-3 py-2 border border-input rounded-md"
              >
                <option value="">Todos os tipos</option>
                <option value="comment">Comentários</option>
                <option value="status_change">Mudanças de Status</option>
                <option value="assignment">Atribuições</option>
                <option value="creation">Criações</option>
                <option value="update">Atualizações</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="user">Usuário</Label>
              <select
                id="user"
                value={filters.user}
                onChange={(e) =>
                  setFilters({ ...filters, user: e.target.value })
                }
                className="w-full px-3 py-2 border border-input rounded-md"
              >
                <option value="">Todos os usuários</option>
                {/* TODO: Listar usuários disponíveis */}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Novo Comentário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-red-700">
              W.I´P - ESSA FEAT AINDA SERÁ IMPLEMENTADA.
            </h1>
            <MessageSquare className="h-5 w-5" />
            Novo Comentário
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Escreva seu comentário..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSubmitComment}
                disabled={!newComment.trim()}
              >
                <Send className="w-4 h-4 mr-2" />
                Enviar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feed de Atividades */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Carregando atividades...
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma atividade encontrada</p>
            <p className="text-sm">Seja o primeiro a comentar!</p>
          </div>
        ) : (
          filteredActivities.map((activity) => (
            <Card key={activity.id} className="border shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <UserAvatar
                    name={activity.userName}
                    avatarUrl={activity.userAvatar}
                    size="md"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{activity.userName}</span>
                      <div
                        className={`flex items-center gap-1 ${getActivityColor(
                          activity.type
                        )}`}
                      >
                        {getActivityIcon(activity.type)}
                        <span className="text-sm">
                          {getActivityLabel(activity.type)}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(activity.createdAt)}
                      </span>
                    </div>

                    {/* Conteúdo da atividade */}
                    {activity.content && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm">{activity.content}</p>
                      </div>
                    )}

                    {/* Mudanças de status */}
                    {activity.type === "status_change" &&
                      activity.oldValue &&
                      activity.newValue && (
                        <div className="flex items-center gap-2 text-sm">
                          <Badge variant="outline">{activity.oldValue}</Badge>
                          <span className="text-muted-foreground">→</span>
                          <Badge variant="outline">{activity.newValue}</Badge>
                        </div>
                      )}

                    {/* Ações */}
                    <div className="flex items-center gap-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onLikeActivity(activity.id)}
                      >
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        {activity.likes}
                      </Button>

                      {activity.type === "comment" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            setReplyingTo({
                              id: activity.id,
                              userName: activity.userName,
                            })
                          }
                        >
                          <Reply className="w-4 h-4 mr-1" />
                          Responder
                        </Button>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => {
                              if (activity.content) {
                                setEditingComment({
                                  id: activity.id,
                                  content: activity.content,
                                });
                              }
                            }}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDeleteComment(activity.id)}
                          >
                            <Trash className="w-4 h-4 mr-2" />
                            Deletar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Respostas */}
                    {activity.replies && activity.replies.length > 0 && (
                      <div className="ml-6 space-y-3">
                        <Separator />
                        {activity.replies.map((reply) => (
                          <div
                            key={reply.id}
                            className="flex items-start gap-2 ml-8"
                          >
                            <UserAvatar
                              name={reply.userName}
                              avatarUrl={reply.userAvatar}
                              size="sm"
                            />
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">
                                  {reply.userName}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(reply.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm mt-1">{reply.content}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 px-2"
                                >
                                  <ThumbsUp className="w-3 h-3 mr-1" />
                                  {reply.likes}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 px-2"
                                >
                                  <Reply className="w-3 h-3 mr-1" />
                                  Responder
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Formulário de resposta */}
                    {replyingTo && replyingTo.id === activity.id && (
                      <div className="ml-6 mt-3 space-y-2">
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-sm text-blue-600">
                            Respondendo a{" "}
                            <span className="font-medium">
                              {replyingTo.userName}
                            </span>
                          </p>
                          <Textarea
                            placeholder="Escreva sua resposta..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            rows={2}
                            className="mt-2"
                          />
                          <div className="flex gap-2 mt-2">
                            <Button
                              size="sm"
                              onClick={handleSubmitReply}
                              disabled={!replyContent.trim()}
                            >
                              <Send className="w-3 h-3 mr-1" />
                              Enviar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setReplyingTo(null)}
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal de Edição */}
      <Dialog
        open={!!editingComment}
        onOpenChange={() => setEditingComment(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Comentário</DialogTitle>
            <DialogDescription>
              Faça as alterações necessárias no comentário.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Textarea
              placeholder="Escreva seu comentário..."
              value={editingComment?.content || ""}
              onChange={(e) =>
                setEditingComment(
                  editingComment
                    ? { ...editingComment, content: e.target.value }
                    : null
                )
              }
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingComment(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
