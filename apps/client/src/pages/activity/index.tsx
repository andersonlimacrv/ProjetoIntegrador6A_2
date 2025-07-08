import { useState, useEffect } from "react";
import { ActivityFeed } from "@/components/activity/ActivityFeed";
import { activitiesApi } from "@/services/domains/activitiesApi";
import type { Activity } from "@packages/shared";

export function ActivityPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = () => {
    setLoading(true);
    activitiesApi.getAll().then((res) => {
      if (res.success && res.data) {
        setActivities(res.data);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleAddComment = async (content: string) => {
    try {
      const res = await activitiesApi.create({
        type: "comment",
        entityType: "project",
        entityId: "current",
        content,
      });
      if (res.success && res.data) {
        setActivities((prev) => [res.data!, ...prev]);
      }
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
    }
  };

  const handleUpdateComment = async (commentId: string, content: string) => {
    try {
      const res = await activitiesApi.update(commentId, { content });
      if (res.success && res.data) {
        setActivities((prev) =>
          prev.map((activity) =>
            activity.id === commentId ? res.data! : activity
          )
        );
      }
    } catch (error) {
      console.error("Erro ao atualizar comentário:", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const res = await activitiesApi.delete(commentId);
      if (res.success) {
        setActivities((prev) =>
          prev.filter((activity) => activity.id !== commentId)
        );
      }
    } catch (error) {
      console.error("Erro ao deletar comentário:", error);
    }
  };

  const handleLikeActivity = async (activityId: string) => {
    // TODO: Implementar like de atividade
    console.log("Like activity:", activityId);
  };

  const handleReplyToComment = async (commentId: string, content: string) => {
    try {
      const res = await activitiesApi.create({
        type: "comment",
        entityType: "activity",
        entityId: commentId,
        content,
      });
      if (res.success && res.data) {
        setActivities((prev) => [res.data!, ...prev]);
      }
    } catch (error) {
      console.error("Erro ao adicionar resposta:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Atividades</h1>
        <p className="text-muted-foreground">
          Acompanhe todas as atividades e comentários do projeto.
        </p>
      </div>

      <ActivityFeed
        entityId="current"
        entityType="project"
        entityTitle="Projeto Atual"
        activities={activities}
        loading={loading}
        onAddComment={handleAddComment}
        onUpdateComment={handleUpdateComment}
        onDeleteComment={handleDeleteComment}
        onLikeActivity={handleLikeActivity}
        onReplyToComment={handleReplyToComment}
      />
    </div>
  );
}
