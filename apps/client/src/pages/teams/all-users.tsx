import { useEffect, useState } from "react";
import { usersApi } from "@/services/domains/usersApi";
import { teamsApi } from "@/services/domains/teamsApi";
import { useToast } from "@/contexts/toast-context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CheckCircle2, UserPlus2 } from "lucide-react";
import type { User, Team } from "@packages/shared";

export function AllUsersPage() {
  const { addToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [membersByTeam, setMembersByTeam] = useState<Record<string, string[]>>(
    {}
  );
  const [selectedTeams, setSelectedTeams] = useState<Record<string, string>>(
    {}
  ); // userId -> teamId
  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterTeam, setFilterTeam] = useState<string>("");

  // Exemplo de Select funcional para teste
  const [practices, setPractices] = useState(1);
  const handleStringToInt = (value: string) => {
    setPractices(parseInt(value));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const usersRes = await usersApi.getAll();
      const teamsRes = await teamsApi.getAll();
      let membersMap: Record<string, string[]> = {};
      if (teamsRes.ok && teamsRes.data.success) {
        setTeams(teamsRes.data.data || []);
        // Buscar membros de cada time
        await Promise.all(
          (teamsRes.data.data || []).map(async (team: Team) => {
            const res = await teamsApi.getMembers(team.id);
            if (res.ok && res.data.success) {
              membersMap[team.id] = (res.data.data || []).map(
                (m: any) => m.user?.id || m.id
              );
            } else {
              membersMap[team.id] = [];
            }
          })
        );
      }
      setMembersByTeam(membersMap);
      if (usersRes.ok && usersRes.data.success)
        setUsers(usersRes.data.data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Filtro de busca
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    if (!filterTeam) return matchSearch;
    // Se filtro de time, só mostra usuários que NÃO estão no time
    const members = membersByTeam[filterTeam] || [];
    return matchSearch && !members.includes(u.id);
  });

  const handleAddToTeam = async (userId: string, teamId: string) => {
    if (!teamId) return;
    setAddLoading(userId + teamId);
    try {
      const res = await teamsApi.addMember(teamId, userId);
      if (res.ok && res.data.success) {
        addToast({ title: "Usuário adicionado ao time", type: "success" });
        setMembersByTeam((prev) => ({
          ...prev,
          [teamId]: [...(prev[teamId] || []), userId],
        }));
      } else {
        addToast({
          title: "Erro ao adicionar",
          description: res.data.message || res.data.error || "",
          type: "error",
        });
      }
    } catch {
      addToast({ title: "Erro de conexão", type: "error" });
    }
    setAddLoading(null);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Todos os Usuários</CardTitle>
          <div className="flex flex-col md:flex-row gap-2 mt-4">
            <Input
              placeholder="Buscar por nome ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
            <Select value={filterTeam} onValueChange={setFilterTeam}>
              <SelectTrigger className="max-w-xs">
                Filtrar por time
              </SelectTrigger>
              <SelectContent>
                {teams.map((t) => (
                  <SelectItem key={t.id} value={String(t.id)}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Exemplo de Select funcional para teste */}
            <Select value={String(practices)} onValueChange={handleStringToInt}>
              <SelectTrigger className="w-[60px]">
                <SelectValue placeholder="0" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="6">6</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando usuários...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum usuário encontrado.
            </div>
          ) : (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-left">Nome</th>
                  <th className="py-2 px-4 text-left">Email</th>
                  <th className="py-2 px-4 text-left">Adicionar ao Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b hover:bg-muted/50">
                    <td className="py-2 px-4 flex items-center gap-2">
                      {u.name}
                      {teams.map((t) =>
                        (membersByTeam[t.id] || []).includes(u.id) ? (
                          <span
                            key={t.id}
                            title={`Já é membro de ${t.name}`}
                            className="text-green-600 flex items-center gap-1 text-xs"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            {t.name}
                          </span>
                        ) : null
                      )}
                    </td>
                    <td className="py-2 px-4">{u.email}</td>
                    <td className="py-2 px-4 flex gap-2 items-center">
                      <Select
                        value={selectedTeams[u.id] ?? ""}
                        onValueChange={(teamId) =>
                          setSelectedTeams((prev) => ({
                            ...prev,
                            [u.id]: teamId,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o time" />
                        </SelectTrigger>
                        <SelectContent>
                          {teams.map((t) => (
                            <SelectItem key={t.id} value={String(t.id)}>
                              {t.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        onClick={() => {
                          if (selectedTeams[u.id])
                            handleAddToTeam(u.id, selectedTeams[u.id]!);
                        }}
                        disabled={
                          !selectedTeams[u.id] ||
                          (selectedTeams[u.id] &&
                            selectedTeams[u.id] !== "" &&
                            (
                              membersByTeam[selectedTeams[u.id]!] || []
                            ).includes(u.id)) ||
                          addLoading === u.id + selectedTeams[u.id]
                        }
                        variant={
                          selectedTeams[u.id] &&
                          selectedTeams[u.id] !== "" &&
                          (membersByTeam[selectedTeams[u.id]!] || []).includes(
                            u.id
                          )
                            ? "outline"
                            : "default"
                        }
                      >
                        {selectedTeams[u.id] &&
                        selectedTeams[u.id] !== "" &&
                        (membersByTeam[selectedTeams[u.id]!] || []).includes(
                          u.id
                        ) ? (
                          <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle2 className="w-4 h-4" /> Adicionado
                          </span>
                        ) : addLoading === u.id + selectedTeams[u.id] ? (
                          "Adicionando..."
                        ) : (
                          <>
                            <UserPlus2 className="w-4 h-4" /> Adicionar
                          </>
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
