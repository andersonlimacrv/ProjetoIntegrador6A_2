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
import type { Sprint } from "@packages/shared";

export function AllSprintsPage() {
  const navigate = useNavigate();
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(true);
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
          description: response.data.message || response.data.error || "Ocorreu um erro ao buscar os sprints.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Erro ao buscar sprints:", error);
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

  const handleDeleteSprint = async (sprintId: string) => {
    if (confirm("Tem certeza que deseja deletar este sprint?")) {
      try {
        const res = await sprintsApi.delete(sprintId);
        if (res.success) {
          setSprints((prev) => prev.filter((sprint) => sprint.id !== sprintId));
          addToast({
            title: "Sprint deletado",
            description: "O sprint foi removido com sucesso.",
            type: "success",
          });
        } else {
          addToast({
            title: "Erro ao deletar sprint",
            description: res.error || "Ocorreu um erro ao deletar o sprint.",
            type: "error",
          });
        }
      } catch (error) {
        console.error("Erro ao deletar sprint:", error);
        addToast({
          title: "Erro de conexão",
          description: "Não foi possível conectar ao servidor.",
          type: "error",
        });
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PLANNING":
        return "bg-blue-100 text-blue-800";
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "COMPLETED":
        return "bg-purple-100 text-purple-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PLANNING":
        return "Planejamento";
      case "ACTIVE":
        return "Ativo";
      case "COMPLETED":
        return "Concluído";
      case "CANCELLED":
        return "Cancelado";
      default:
        return status;
    }
  };

  const getDaysRemaining = (sprint: Sprint) => {
    if (!sprint.endDate) return "Sem data de fim";

    const endDate = new Date(sprint.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Encerrado";
    if (diffDays === 0) return "Último dia";
    return `${diffDays} dias restantes`;
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
                      <Badge className={getStatusColor(sprint.status)}>
                        {getStatusLabel(sprint.status)}
                      </Badge>
                    </div>
                    <CardDescription>
                      {sprint.description || "Sem descrição"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Criado em {formatDate(sprint.createdAt)}</span>
                      </div>

                      {sprint.startDate && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>Início: {formatDate(sprint.startDate)}</span>
                        </div>
                      )}

                      {sprint.endDate && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{getDaysRemaining(sprint)}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                      <Button size="sm" variant="outline">
                        <Pencil className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteSprint(sprint.id)}
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
    </div>
  );
}
