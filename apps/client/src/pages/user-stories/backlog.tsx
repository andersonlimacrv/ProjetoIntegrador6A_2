import { useState, useEffect } from "react";
import { BacklogView } from "@/components/backlog/BacklogView";
import { userStoriesApi } from "@/services/domains/userStoriesApi";
import type { UserStory } from "@packages/shared";

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

export function BacklogPage() {
  const [userStories, setUserStories] = useState<UserStory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserStories = () => {
    setLoading(true);
    userStoriesApi.getAll().then((res) => {
      if (res.success && res.data) {
        // Adicionar ordem baseada na data de criação
        const storiesWithOrder = res.data.map((story, index) => ({
          ...story,
          order: index + 1,
        }));
        setUserStories(storiesWithOrder);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchUserStories();
  }, []);

  const handleUpdateStory = async (
    storyId: string,
    data: Partial<BacklogItem>
  ) => {
    try {
      const res = await userStoriesApi.update(storyId, data as any);
      if (res.success && res.data) {
        setUserStories((prev) =>
          prev.map((story) =>
            story.id === storyId ? { ...res.data!, order: story.order } : story
          )
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

  const handleViewStory = (story: UserStory) => {
    // TODO: Implementar visualização detalhada
    console.log("Visualizar história:", story);
  };

  const handleEditStory = (story: UserStory) => {
    // TODO: Implementar edição
    console.log("Editar história:", story);
  };

  const handleCreateStory = async (data: Partial<BacklogItem>) => {
    try {
      const res = await userStoriesApi.create(data as any);
      if (res.success && res.data) {
        const newStory = { ...res.data, order: userStories.length + 1 };
        setUserStories((prev) => [...prev, newStory]);
      }
    } catch (error) {
      console.error("Erro ao criar história:", error);
    }
  };

  const handleReorderItems = async (itemId: string, newOrder: number) => {
    try {
      const res = await userStoriesApi.update(itemId, {
        order: newOrder,
      } as any);
      if (res.success && res.data) {
        setUserStories((prev) =>
          prev.map((story) =>
            story.id === itemId ? { ...story, order: newOrder } : story
          )
        );
      }
    } catch (error) {
      console.error("Erro ao reordenar item:", error);
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

  // Converter UserStory para BacklogItem
  const backlogItems: BacklogItem[] = userStories.map((story) => ({
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
    order: story.order || 1,
    epicId: story.epicId,
    epicName: story.epicId, // TODO: Buscar nome do épico
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Backlog Organizado
        </h1>
        <p className="text-muted-foreground">
          Visualize, organize e priorize as histórias de usuário do backlog.
        </p>
      </div>

      <BacklogView
        title="Backlog de Histórias de Usuário"
        items={backlogItems}
        loading={loading}
        onUpdateItem={handleUpdateStory}
        onDeleteItem={handleDeleteStory}
        onViewItem={handleViewStory}
        onEditItem={handleEditStory}
        onCreateItem={handleCreateStory}
        onReorderItems={handleReorderItems}
        itemType="story"
        getStatusColor={getStatusColor}
        getStatusLabel={getStatusLabel}
        getPriorityColor={getPriorityColor}
        getPriorityLabel={getPriorityLabel}
      />
    </div>
  );
}
