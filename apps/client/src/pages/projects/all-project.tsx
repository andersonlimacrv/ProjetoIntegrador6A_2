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
import { Map, Plus, Eye, Pencil, Trash, Calendar, Users } from "lucide-react";
import { projectsApi } from "@/services/domains/projectsApi";
import { useToast } from "@/contexts/toast-context";
import type { Project } from "@packages/shared";

export function AllProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsApi.getAll();

      if (response.ok && response.data.success) {
        setProjects(response.data.data || []);
      } else {
        addToast({
          title: "Erro ao carregar projetos",
          description:
            response.data.message ||
            response.data.error ||
            "Ocorreu um erro ao buscar os projetos.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Erro ao buscar projetos:", error);
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
    fetchProjects();
  }, []);

  const handleDeleteProject = async (projectId: string) => {
    if (confirm("Tem certeza que deseja deletar este projeto?")) {
      try {
        const response = await projectsApi.delete(projectId);
        if (response.ok && response.data.success) {
          setProjects((prev) =>
            prev.filter((project) => project.id !== projectId)
          );
          addToast({
            title: "Projeto deletado",
            description: "O projeto foi removido com sucesso.",
            type: "success",
          });
        } else {
          addToast({
            title: "Erro ao deletar projeto",
            description:
              response.data.message ||
              response.data.error ||
              "Ocorreu um erro ao deletar o projeto.",
            type: "error",
          });
        }
      } catch (error) {
        console.error("Erro ao deletar projeto:", error);
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
        return "Ativo";
      case "inactive":
        return "Inativo";
      case "archived":
        return "Arquivado";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Todos os Projetos
          </h1>
          <p className="text-muted-foreground">
            Visualize todos os projetos disponíveis.
          </p>
        </div>
        <Button onClick={() => navigate("/dashboard/projects/create")}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Projeto
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5" />
            Projetos ({projects.length})
          </CardTitle>
          <CardDescription>
            Visualize e gerencie todos os projetos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando projetos...
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Map className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum projeto encontrado</p>
              <p className="text-sm">Crie seu primeiro projeto para começar</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <Badge className={getStatusColor(project.status)}>
                        {getStatusLabel(project.status)}
                      </Badge>
                    </div>
                    <CardDescription>
                      {project.description || "Sem descrição"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Criado em {formatDate(project.createdAt)}</span>
                      </div>

                      {project.startDate && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>Início: {formatDate(project.startDate)}</span>
                        </div>
                      )}

                      {project.endDate && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>Fim: {formatDate(project.endDate)}</span>
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
                        onClick={() => handleDeleteProject(project.id)}
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
