import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/contexts/toast-context";
import { teamsApi } from "@/services/domains/teamsApi";
import { usersApi } from "@/services/domains/usersApi";
import { useAuth } from "@/contexts/auth-context";
import { DEFAULT_ROLES } from "@packages/shared/constants/roles";
import type { User, Team } from "@packages/shared";

export function TeamMembersPage() {
  const { id: teamId } = useParams();
  const { addToast } = useToast();
  const { tenant } = useAuth();
  const [members, setMembers] = useState<any[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState("member");
  const [editRoleUserId, setEditRoleUserId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState("member");
  const [editLoading, setEditLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  // Resetar selects ao abrir modal de adicionar membro
  useEffect(() => {
    if (addDialogOpen) {
      setSelectedUserId("");
      setSelectedRole("member");
    }
  }, [addDialogOpen, users.length]);

  useEffect(() => {
    console.log("Dialog aberto:", addDialogOpen);
  }, [addDialogOpen]);

  // Logs para depuração
  useEffect(() => {
    console.log("users:", users);
    console.log("selectedUserId:", selectedUserId);
  }, [users, selectedUserId]);

  // Buscar membros e equipe
  const fetchMembers = async () => {
    if (!teamId) return;
    setLoading(true);
    try {
      const [teamRes, membersRes] = await Promise.all([
        teamsApi.getById(teamId),
        teamsApi.getMembers(teamId),
      ]);
      if (teamRes.ok && teamRes.data.success && teamRes.data.data)
        setTeam(teamRes.data.data);
      if (membersRes.ok && membersRes.data.success)
        setMembers(membersRes.data.data || []);
      else setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  // Buscar todos usuários para adicionar
  const fetchUsers = async () => {
    if (!tenant?.id) return;
    // Por enquanto, busca todos usuários do sistema
    const res = await usersApi.getAll();
    if (res.ok && res.data.success) setUsers(res.data.data || []);
    // Futuro: usar usersApi.getByTenant(tenant.id)
  };

  useEffect(() => {
    fetchMembers();
    fetchUsers();
    // eslint-disable-next-line
  }, [teamId, tenant?.id]);

  // Adicionar membro
  const handleAddMember = async () => {
    if (!selectedUserId || !teamId) return;
    console.log("Adicionando membro para o teamId:", teamId);
    setAddLoading(true);
    try {
      // Adiciona o membro
      const res = await teamsApi.addMember(teamId!, selectedUserId);
      // Se o papel não for 'member', atualiza o papel
      if (res.ok && res.data.success) {
        if (selectedRole !== "member") {
          await teamsApi.updateMember(teamId!, selectedUserId, {
            role: selectedRole,
          });
        }
        addToast({ title: "Membro adicionado", type: "success" });
        setAddDialogOpen(false);
        fetchMembers();
      } else {
        addToast({
          title: "Erro ao adicionar membro",
          description: res.data.message || res.data.error || "",
          type: "error",
        });
      }
    } catch {
      addToast({ title: "Erro de conexão", type: "error" });
    }
    setAddLoading(false);
  };

  // Editar role
  const handleEditRole = async () => {
    if (!editRoleUserId) return;
    setEditLoading(true);
    try {
      const res = await teamsApi.updateMember(teamId!, editRoleUserId, {
        role: editRole,
      });
      if (res.ok && res.data.success) {
        addToast({ title: "Papel atualizado", type: "success" });
        setEditRoleUserId(null);
        fetchMembers();
      } else {
        addToast({
          title: "Erro ao atualizar papel",
          description: res.data.message || res.data.error || "",
          type: "error",
        });
      }
    } catch {
      addToast({ title: "Erro de conexão", type: "error" });
    } finally {
      setEditLoading(false);
    }
  };

  // Remover membro
  const handleRemoveMember = async (userId: string) => {
    try {
      const res = await teamsApi.removeMember(teamId!, userId);
      if (res.ok && res.data.success) {
        addToast({ title: "Membro removido", type: "success" });
        setRemoveDialogOpen(null);
        fetchMembers();
      } else {
        addToast({
          title: "Erro ao remover membro",
          description: res.data.message || res.data.error || "",
          type: "error",
        });
      }
    } catch {
      addToast({ title: "Erro de conexão", type: "error" });
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>
            Membros da Equipe {team ? `- ${team.name}` : ""}
          </CardTitle>
          <CardDescription>
            Gerencie os membros, papéis e permissões da equipe.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Button onClick={() => setAddDialogOpen(true)}>
              Adicionar Membro
            </Button>
          </div>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando membros...
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum membro encontrado para esta equipe.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4 text-left">Nome</th>
                    <th className="py-2 px-4 text-left">Email</th>
                    <th className="py-2 px-4 text-left">Papel</th>
                    <th className="py-2 px-4 text-left">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m) => (
                    <tr key={m.user.id} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-4">{m.user.name}</td>
                      <td className="py-2 px-4">{m.user.email}</td>
                      <td className="py-2 px-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditRoleUserId(m.user.id);
                            setEditRole(m.member.role || "member");
                          }}
                          disabled={editLoading}
                        >
                          {DEFAULT_ROLES.find((r) => r.name === m.member.role)
                            ?.displayName || m.member.role}
                        </Button>
                      </td>
                      <td className="py-2 px-4 flex gap-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setRemoveDialogOpen(m.user.id)}
                          disabled={editLoading}
                        >
                          Remover
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Adicionar Membro */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Membro</DialogTitle>
            <DialogDescription>
              Selecione o usuário e o papel para adicionar à equipe.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Usuário</label>
              <Select
                value={selectedUserId}
                onValueChange={(value) => {
                  console.log("Selecionado:", value);
                  setSelectedUserId(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um usuário:" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Usuários</SelectLabel>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={String(u.id)}>
                      {u.name} ({u.email})
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block mb-1">Papel</label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>Selecione um papel</SelectTrigger>
                <SelectContent>
                  {DEFAULT_ROLES.map((r) => (
                    <SelectItem key={r.name} value={r.name}>
                      {r.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleAddMember}
                disabled={
                  addLoading || !selectedUserId || !selectedRole || !teamId
                }
              >
                {addLoading ? "Adicionando..." : "Adicionar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Editar Papel */}
      <Dialog
        open={!!editRoleUserId}
        onOpenChange={(open) => !open && setEditRoleUserId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Papel</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={editRole} onValueChange={setEditRole}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um papel" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Papéis</SelectLabel>
                {DEFAULT_ROLES.map((r) => (
                  <SelectItem key={r.name} value={r.name}>
                    {r.displayName}
                  </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditRoleUserId(null)}>
                Cancelar
              </Button>
              <Button
                onClick={handleEditRole}
                disabled={editLoading || !editRole}
              >
                {editLoading ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Remover Membro */}
      <ConfirmDialog
        open={!!removeDialogOpen}
        onOpenChange={(open) => !open && setRemoveDialogOpen(null)}
        title="Remover Membro"
        description="Tem certeza que deseja remover este membro da equipe?"
        confirmText="Remover"
        cancelText="Cancelar"
        variant="destructive"
        onConfirm={() => handleRemoveMember(removeDialogOpen!)}
      />
    </div>
  );
}
