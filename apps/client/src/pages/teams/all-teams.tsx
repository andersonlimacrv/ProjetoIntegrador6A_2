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
import { Users, Plus, Calendar } from "lucide-react";
import { teamsApi } from "@/services/domains/teamsApi";
import { useToast } from "@/contexts/toast-context";
import { StatusBadge } from "@/components/ui/status-badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EntityCard } from "@/components/ui/entity-card";
import type { Team } from "@packages/shared";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function AllTeamsPage() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  const [teamToEdit, setTeamToEdit] = useState<Team | null>(null);
  const [editForm, setEditForm] = useState({ name: "", description: "" });
  const [editLoading, setEditLoading] = useState(false);
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

  const handleDeleteTeam = async () => {
    if (!teamToDelete) return;

    try {
      setDeleteLoading(true);
      const response = await teamsApi.delete(teamToDelete.id);

      if (response.ok && response.data.success) {
        setTeams((prev) => prev.filter((team) => team.id !== teamToDelete.id));
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
      addToast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor.",
        type: "error",
      });
    } finally {
      setDeleteLoading(false);
      setTeamToDelete(null);
    }
  };

  const openEditModal = (team: Team) => {
    setTeamToEdit(team);
    setEditForm({
      name: team.name,
      description: team.description || "",
    });
  };

  const handleEditTeam = async () => {
    if (!teamToEdit) return;
    try {
      setEditLoading(true);
      const response = await teamsApi.update(teamToEdit.id, editForm);
      if (response.ok && response.data.success) {
        setTeams((prev) =>
          prev.map((team) =>
            team.id === teamToEdit.id ? { ...team, ...editForm } : team
          )
        );
        addToast({
          title: "Equipe atualizada",
          description: "A equipe foi atualizada com sucesso.",
          type: "success",
        });
        setTeamToEdit(null);
      } else {
        addToast({
          title: "Erro ao atualizar equipe",
          description:
            response.data.message ||
            response.data.error ||
            "Ocorreu um erro ao atualizar a equipe.",
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

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("pt-BR");
  };

  const renderTeamCard = (team: Team) => (
    <EntityCard
      key={team.id}
      title={team.name}
      description={team.description || "Sem descrição"}
      onView={() => navigate(`/dashboard/teams/${team.id}/members`)}
      onEdit={() => openEditModal(team)}
      onDelete={() => setTeamToDelete(team)}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Criada em {formatDate(team.createdAt)}</span>
        </div>
      </div>
    </EntityCard>
  );

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
            Equipes <span className="text-accent">{teams.length}</span>
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
              {teams.map(renderTeamCard)}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmDialog
        open={!!teamToDelete}
        onOpenChange={(open) => !open && setTeamToDelete(null)}
        title="Deletar Equipe"
        description={`Tem certeza que deseja deletar a equipe "${teamToDelete?.name}"? Esta ação não pode ser desfeita.`}
        confirmText="Deletar"
        cancelText="Cancelar"
        variant="destructive"
        onConfirm={handleDeleteTeam}
        loading={deleteLoading}
      />

      <Dialog
        open={!!teamToEdit}
        onOpenChange={(open) => !open && setTeamToEdit(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Equipe</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Equipe</Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Nome da equipe"
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
                placeholder="Descrição da equipe"
                rows={3}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleEditTeam}
                disabled={editLoading}
                className="flex-1"
              >
                {editLoading ? "Salvando..." : "Salvar"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setTeamToEdit(null)}
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
