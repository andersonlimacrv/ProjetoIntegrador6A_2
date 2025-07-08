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
import { Users, Plus, Eye, Pencil, Trash, Calendar } from "lucide-react";
import { teamsApi } from "@/services/domains/teamsApi";
import { useToast } from "@/contexts/toast-context";
import type { Team } from "@packages/shared";

export function AllTeamsPage() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await teamsApi.getAll();

      if (response.ok && response.data.success) {
        setTeams(response.data.data || []);
      } else {
        addToast({
          title: "Erro ao carregar equipes",
          description:
            response.data.message ||
            response.data.error ||
            "Ocorreu um erro ao buscar as equipes.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Erro ao buscar equipes:", error);
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
    fetchTeams();
  }, []);

  const handleDeleteTeam = async (teamId: string) => {
    if (confirm("Tem certeza que deseja deletar esta equipe?")) {
      try {
        const response = await teamsApi.delete(teamId);
        if (response.ok && response.data.success) {
          setTeams((prev) => prev.filter((team) => team.id !== teamId));
          addToast({
            title: "Equipe deletada",
            description: "A equipe foi removida com sucesso.",
            type: "success",
          });
        } else {
          addToast({
            title: "Erro ao deletar equipe",
            description:
              response.data.message ||
              response.data.error ||
              "Ocorreu um erro ao deletar a equipe.",
            type: "error",
          });
        }
      } catch (error) {
        console.error("Erro ao deletar equipe:", error);
        addToast({
          title: "Erro de conexão",
          description: "Não foi possível conectar ao servidor.",
          type: "error",
        });
      }
    }
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("pt-BR");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "archived":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Ativa";
      case "inactive":
        return "Inativa";
      case "archived":
        return "Arquivada";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Todas as Equipes
          </h1>
          <p className="text-muted-foreground">
            Visualize todas as equipes disponíveis.
          </p>
        </div>
        <Button onClick={() => navigate("/dashboard/teams/create")}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Equipe
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Equipes ({teams.length})
          </CardTitle>
          <CardDescription>
            Visualize e gerencie todas as equipes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando equipes...
            </div>
          ) : teams.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma equipe encontrada</p>
              <p className="text-sm">Crie sua primeira equipe para começar</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teams.map((team) => (
                <Card
                  key={team.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{team.name}</CardTitle>
                      <Badge className={getStatusColor(team.status)}>
                        {getStatusLabel(team.status)}
                      </Badge>
                    </div>
                    <CardDescription>
                      {team.description || "Sem descrição"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Criada em {formatDate(team.createdAt)}</span>
                      </div>
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
                        onClick={() => handleDeleteTeam(team.id)}
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
