import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Eye, Pencil, Trash, Clock } from "lucide-react";
import { sprintsApi } from "@/services/domains/sprintsApi";
import { useToast } from "@/contexts/toast-context";
import { StatusBadge } from "@/components/ui/status-badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { Sprint } from "@packages/shared";

export function AllSprintsPage() {
  const navigate = useNavigate();
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [sprintToDelete, setSprintToDelete] = useState<Sprint | null>(null);
  const { addToast } = useToast();

  const fetchSprints = async () => {
    try {
      setLoading(true);
      const response = await sprintsApi.getAll();

      if (response.ok && response.data.success) {
        setSprints(response.data.data || []);
      } else {
        addToast({
          title: "Erro ao carregar sprints",
          description:
            response.data.message ||
            response.data.error ||
            "Ocorreu um erro ao buscar os sprints.",
          type: "error",
        });
      }
    } catch (error) {
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
    fetchSprints();
  }, []);

  const handleDeleteSprint = async () => {
    if (!sprintToDelete) return;

    try {
      setDeleteLoading(true);
      const response = await sprintsApi.delete(sprintToDelete.id);

      if (response.ok && response.data.success) {
        setSprints((prev) =>
          prev.filter((sprint) => sprint.id !== sprintToDelete.id)
        );
        addToast({
          title: "Sprint deletado",
          description: "O sprint foi removido com sucesso.",
          type: "success",
        });
      } else {
        addToast({
          title: "Erro ao deletar sprint",
          description:
            response.data.message ||
            response.data.error ||
            "Ocorreu um erro ao deletar o sprint.",
          type: "error",
        });
      }
    } catch (error) {
      addToast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor.",
        type: "error",
      });
    } finally {
      setDeleteLoading(false);
      setSprintToDelete(null);
    }
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("pt-BR");
  };

  const getSprintStatus = (sprint: Sprint) => {
    const now = new Date();
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);

    if (now < startDate) return "pending";
    if (now >= startDate && now <= endDate) return "running";
    if (now > endDate) return "completed";
    return sprint.status;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Todos os Sprints
          </h1>
          <p className="text-muted-foreground">
            Visualize todos os sprints disponíveis.
          </p>
        </div>
        <Button onClick={() => navigate("/dashboard/sprints/create")}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Sprint
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Sprints ({sprints.length})
          </CardTitle>
          <CardDescription>
            Visualize e gerencie todos os sprints
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando sprints...
            </div>
          ) : sprints.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum sprint encontrado</p>
              <p className="text-sm">Crie seu primeiro sprint para começar</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sprints.map((sprint) => (
                <Card
                  key={sprint.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{sprint.name}</CardTitle>
                      <StatusBadge status={getSprintStatus(sprint)} />
                    </div>
                    <CardDescription>
                      {sprint.description || "Sem descrição"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>Início: {formatDate(sprint.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>Fim: {formatDate(sprint.endDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Criado em {formatDate(sprint.createdAt)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-4">
                      <Button size="sm" variant="outline" className="w-full">
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                      <Button size="sm" variant="outline" className="w-full">
                        <Pencil className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => setSprintToDelete(sprint)}
                      >
                        <Trash className="w-4 h-4 mr-1" />
                        Deletar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmDialog
        open={!!sprintToDelete}
        onOpenChange={(open) => !open && setSprintToDelete(null)}
        title="Deletar Sprint"
        description={`Tem certeza que deseja deletar o sprint "${sprintToDelete?.name}"? Esta ação não pode ser desfeita.`}
        confirmText="Deletar"
        cancelText="Cancelar"
        variant="destructive"
        onConfirm={handleDeleteSprint}
        loading={deleteLoading}
      />
    </div>
  );
}
