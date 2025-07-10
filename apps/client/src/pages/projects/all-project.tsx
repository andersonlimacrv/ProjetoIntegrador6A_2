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
import { Map, Plus, Calendar } from "lucide-react";
import { projectsApi } from "@/services/domains/projectsApi";
import { useToast } from "@/contexts/toast-context";
import { StatusBadge } from "@/components/ui/status-badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EntityCard } from "@/components/ui/entity-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Project, UpdateProjectDTO } from "@packages/shared";
import { Link } from "react-router-dom";

export function AllProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [editForm, setEditForm] = useState<UpdateProjectDTO>({
    name: "",
    description: "",
    status: "active",
  });
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

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      setDeleteLoading(true);
      console.log(
        "🗑️ Frontend - Iniciando exclusão do projeto:",
        projectToDelete.id
      );

      const response = await projectsApi.delete(projectToDelete.id);

      console.log("📡 Frontend - Resposta da API:", {
        status: response.status,
        ok: response.ok,
        data: response.data,
      });

      if (response.ok && response.data.success) {
        console.log(
          "✅ Frontend - Projeto deletado com sucesso, atualizando lista"
        );
        setProjects((prev) =>
          prev.filter((project) => project.id !== projectToDelete.id)
        );
        addToast({
          title: "Projeto deletado",
          description: "O projeto foi removido com sucesso.",
          type: "success",
        });
      } else {
        console.error("❌ Frontend - Erro na resposta da API:", {
          status: response.status,
          data: response.data,
        });

        const errorMessage =
          response.data?.message ||
          response.data?.error ||
          `Erro ${response.status}: ${response.data.message}`;

        addToast({
          title: "Erro ao deletar projeto",
          description: errorMessage,
          type: "error",
        });
      }
    } catch (error) {
      console.error("💥 Frontend - Erro na requisição:", error);
      addToast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor.",
        type: "error",
      });
    } finally {
      setDeleteLoading(false);
      setProjectToDelete(null);
    }
  };

  const handleEditProject = async () => {
    if (!projectToEdit) return;

    try {
      setEditLoading(true);
      const response = await projectsApi.update(projectToEdit.id, editForm);

      if (response.ok && response.data.success) {
        setProjects((prev) =>
          prev.map((project) =>
            project.id === projectToEdit.id
              ? { ...project, ...editForm }
              : project
          )
        );
        addToast({
          title: "Projeto atualizado",
          description: "O projeto foi atualizado com sucesso.",
          type: "success",
        });
        setProjectToEdit(null);
      } else {
        addToast({
          title: "Erro ao atualizar projeto",
          description:
            response.data.message ||
            response.data.error ||
            "Ocorreu um erro ao atualizar o projeto.",
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
      setEditLoading(false);
    }
  };

  const openEditModal = (project: Project) => {
    setProjectToEdit(project);
    setEditForm({
      name: project.name,
      description: project.description || "",
      status: project.status,
    });
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("pt-BR");
  };

  const renderProjectCard = (project: Project) => (
    <EntityCard
      key={project.id}
      title={project.name}
      description={project.description || "Sem descrição"}
      status={<StatusBadge size="sm" status={project.status} />}
      onView={() => navigate(`/dashboard/projects/${project.id}`)}
      onEdit={() => openEditModal(project)}
      onDelete={() => setProjectToDelete(project)}
    >
      <div className="space-y-2 flex justify-center items-end">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Criado em {formatDate(project.createdAt)}</span>
        </div>

        {project.startDate && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Início: {formatDate(project.startDate)}</span>
          </div>
        )}

        {project.endDate && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Fim: {formatDate(project.endDate)}</span>
          </div>
        )}
      </div>
    </EntityCard>
  );

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
        <Link to="/dashboard/projects/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Projeto
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5" />
            Projetos{" "}
            <p className="text-muted-foreground">
              <span className="text-accent">{projects.length} </span>
            </p>
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
              {projects.map(renderProjectCard)}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmDialog
        open={!!projectToDelete}
        onOpenChange={(open) => !open && setProjectToDelete(null)}
        title="Deletar Projeto"
        description={`Tem certeza que deseja deletar o projeto "${projectToDelete?.name}"? Esta ação não pode ser desfeita.`}
        confirmText="Deletar"
        cancelText="Cancelar"
        variant="destructive"
        onConfirm={handleDeleteProject}
        loading={deleteLoading}
      />

      {/* Modal de Edição */}
      <Dialog
        open={!!projectToEdit}
        onOpenChange={(open) => !open && setProjectToEdit(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Projeto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Projeto</Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Nome do projeto"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Descrição do projeto"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={editForm.status}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    status: e.target.value as any,
                  }))
                }
                className="w-full p-2 border border-input rounded-md bg-background"
              >
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
                <option value="archived">Arquivado</option>
              </select>
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleEditProject}
                disabled={editLoading}
                className="flex-1"
              >
                {editLoading ? "Salvando..." : "Salvar"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setProjectToEdit(null)}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
