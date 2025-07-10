import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/contexts/toast-context";
import { projectsApi } from "@/services/domains/projectsApi";
import { teamsApi } from "@/services/domains/teamsApi";
import { sprintsApi } from "@/services/domains/sprintsApi";
import { Plus, Calendar, Users, FolderOpen } from "lucide-react";
import type { Project, Team, User, Sprint } from "@packages/shared";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SprintForm } from "@/components/forms/SprintForm";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const { addToast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<Record<string, User[]>>({});
  const [membersLoading, setMembersLoading] = useState<string | null>(null);

  // Estados para sprints
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [sprintsLoading, setSprintsLoading] = useState(false);
  const [openSprintDialog, setOpenSprintDialog] = useState(false);

  // Buscar detalhes do projeto, times associados e sprints
  const fetchData = async () => {
    setLoading(true);
    try {
      const [projectRes, teamsRes, allTeamsRes, sprintsRes] = await Promise.all(
        [
          projectsApi.getById(id!),
          projectsApi.getTeams(id!),
          teamsApi.getAll(),
          sprintsApi.getByProject(id!),
        ]
      );

      if (projectRes.ok && projectRes.data.success)
        setProject(projectRes.data.data || null);

      if (teamsRes.ok && teamsRes.data.success)
        setTeams((teamsRes.data.data || []).map((item: any) => item.team));

      if (allTeamsRes.ok && allTeamsRes.data.success)
        setAllTeams(allTeamsRes.data.data || []);

      // Corrigir processamento dos dados de sprints
      if (sprintsRes.ok && sprintsRes.data.success) {
        // Verificar se a resposta tem estrutura aninhada
        const sprintsData =
          sprintsRes.data.data?.data || sprintsRes.data.data || [];
        setSprints(Array.isArray(sprintsData) ? sprintsData : []);
      } else {
        setSprints([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Buscar membros de todos os times associados
  const fetchTeamMembers = async (teamIds: string[]) => {
    const membersObj: Record<string, User[]> = {};
    await Promise.all(
      teamIds.map(async (teamId) => {
        setMembersLoading(teamId);
        const res = await teamsApi.getMembers(teamId);
        if (res.ok && res.data.success) {
          membersObj[teamId] = (res.data.data || []).map(
            (item: any) => item.user
          );
        } else {
          membersObj[teamId] = [];
        }
        setMembersLoading(null);
      })
    );
    setTeamMembers(membersObj);
  };

  // Buscar sprints do projeto
  const fetchProjectSprints = async () => {
    setSprintsLoading(true);
    try {
      const sprintsRes = await sprintsApi.getByProject(id!);
      if (sprintsRes.ok && sprintsRes.data.success) {
        // Verificar se a resposta tem estrutura aninhada
        const sprintsData =
          sprintsRes.data.data?.data || sprintsRes.data.data || [];
        setSprints(Array.isArray(sprintsData) ? sprintsData : []);
      } else {
        setSprints([]);
        addToast({ title: "Erro ao buscar sprints", type: "error" });
      }
    } catch (error) {
      setSprints([]);
      addToast({ title: "Erro ao carregar sprints", type: "error" });
    }
    setSprintsLoading(false);
  };

  useEffect(() => {
    if (id) fetchData();
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    if (teams.length > 0) {
      const validTeams = teams.filter((t) => !!t.id && !!t.name);
      fetchTeamMembers(validTeams.map((t) => t.id));
    } else {
      setTeamMembers({});
    }
    // eslint-disable-next-line
  }, [teams]);

  // Adicionar time ao projeto
  const handleAddTeam = async () => {
    if (!selectedTeamId) return;
    setAddLoading(true);
    const res = await projectsApi.addTeam(id!, selectedTeamId);
    if (res.ok && res.data.success) {
      addToast({ title: "Time adicionado ao projeto", type: "success" });
      setSelectedTeamId("");
      fetchData();
    } else {
      addToast({
        title: "Erro ao adicionar time",
        description: res.data?.message || res.data?.error || "",
        type: "error",
      });
    }
    setAddLoading(false);
  };

  // Remover time do projeto
  const handleRemoveTeam = async (teamId: string) => {
    setRemoveLoading(teamId);
    const res = await projectsApi.removeTeam(id!, teamId);
    if (res.ok && res.data.success) {
      addToast({ title: "Time removido do projeto", type: "success" });
      fetchData();
    } else {
      addToast({
        title: "Erro ao remover time",
        description:
          res.data?.message ||
          res.data?.error ||
          "Erro ao remover time do projeto.",
        type: "error",
      });
    }
    setRemoveLoading(null);
  };

  // Criar sprint
  const handleSprintCreated = () => {
    setOpenSprintDialog(false);
    fetchProjectSprints();
    addToast({ title: "Sprint criado com sucesso KKK", type: "success" });
  };

  // Filtrar times disponíveis para adicionar (não associados ainda)
  const availableTeams = allTeams.filter(
    (t) => !teams.some((at) => at.id === t.id)
  );

  const validTeams = teams.filter((team) => !!team.id && !!team.name);

  return (
    <div className="flex flex-col gap-4 px-4">
      {/* DASHBOARD HEADER */}
      <Card className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex flex-col 2xl:flex-row gap-2 2xl:gap-8 w-full 2xl:px-6 7xl:px-16 justify-center items-center">
          <h1 className="text-3xl font-bold capitalize text-primary">
            {project?.name || "Projeto"}
          </h1>
          <p className="text-muted-foreground text-base">
            {project?.description || "Sem descrição."}
          </p>
          <div className="flex flex-wrap gap-2 items-center">
            <StatusBadge status={project?.status || "inactive"} />
            {project?.projectKey && (
              <Badge variant="outline">Key: {project.projectKey}</Badge>
            )}
            {project?.startDate && (
              <Badge variant="outline">
                Início: {new Date(project.startDate).toLocaleDateString()}
              </Badge>
            )}
            {project?.endDate && (
              <Badge variant="outline">
                Fim: {new Date(project.endDate).toLocaleDateString()}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex gap-2 w-full justify-center items-center">
          <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
            <SelectTrigger className="">
              <SelectValue placeholder="Adicionar time ao projeto" />
            </SelectTrigger>
            <SelectContent>
              {availableTeams.length === 0 ? (
                <div className="px-4 py-2 text-muted-foreground text-sm">
                  Nenhum time disponível
                </div>
              ) : (
                availableTeams.map((team) => (
                  <SelectItem
                    key={team.id}
                    value={team.id}
                    className="truncate"
                  >
                    {team.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={handleAddTeam}
            disabled={!selectedTeamId || addLoading}
            className="rounded-full border hover:shadow-primary/20 p-0 bg-accent cursor-pointer"
          >
            {addLoading ? (
              <span className="animate-spin">
                <Plus className="size-6" />
              </span>
            ) : (
              <Plus className="size-6" />
            )}
          </Button>
        </div>
      </Card>

      {/* TABS PARA TIMES E SPRINTS */}
      <Tabs defaultValue="teams" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="teams">Times ({validTeams.length})</TabsTrigger>
          <TabsTrigger value="sprints">Sprints ({sprints.length})</TabsTrigger>
        </TabsList>

        {/* TAB TIMES */}
        <TabsContent value="teams" className="space-y-4">
          <div className="flex flex-col gap-4 mb-6">
            <h2 className="text-xl font-semibold px-1 flex justify-start items-center space-x-2">
              <Users className="text-accent w-4 h-4" />
              Times associados
              <span className="text-xs bg-muted px-2 mx-1 rounded-full">
                {teams.length}
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {validTeams.length === 0 ? (
                <Card className="col-span-full text-center py-8">
                  <CardContent>
                    <span className="text-muted-foreground">
                      Nenhum time associado.
                    </span>
                  </CardContent>
                </Card>
              ) : (
                validTeams.map((team) => (
                  <Card key={team.id} className="flex flex-col h-full">
                    <CardHeader className="flex-row items-center">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10 ml-auto"
                        onClick={() => team.id && handleRemoveTeam(team.id)}
                        disabled={removeLoading === team.id || !team.id}
                        aria-label={`Remover ${team.name}`}
                      >
                        {removeLoading === team.id ? (
                          <span className="animate-spin">⏳</span>
                        ) : (
                          <span className="font-bold text-2xl" aria-hidden>
                            ✕
                          </span>
                        )}
                      </Button>
                      <CardTitle className="truncate text-lg flex-1">
                        {team.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col gap-2">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="secondary">
                          ID: {team.id ? team.id.slice(0, 8) : "-"}
                        </Badge>
                        {team.tenantId && (
                          <Badge variant="outline">
                            Tenant: {team.tenantId.slice(0, 8)}
                          </Badge>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-sm mb-1">
                          Membros do time
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {membersLoading === team.id ? (
                            <span className="text-muted-foreground text-xs">
                              Carregando...
                            </span>
                          ) : (
                            (() => {
                              const members = teamMembers[team.id] ?? [];
                              return members.length ? (
                                members.map((user) => (
                                  <Badge
                                    variant="secondary"
                                    key={user.id || Math.random()}
                                    className="flex items-center px-1"
                                  >
                                    <Avatar className="size-7">
                                      {user.avatarUrl ? (
                                        <AvatarImage
                                          src={user.avatarUrl}
                                          alt={user.name || "Usuário"}
                                        />
                                      ) : (
                                        <AvatarFallback className="size-7">
                                          {user.name?.[0] || "U"}
                                        </AvatarFallback>
                                      )}
                                    </Avatar>
                                    <span className="text-xs font-medium truncate max-w-[80px] px-2">
                                      {user.name || "Usuário"}
                                    </span>
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-muted-foreground text-xs">
                                  Nenhum membro.
                                </span>
                              );
                            })()
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-center items-center flex-wrap gap-2 pt-2 border-t mt-2">
                      <Badge variant="outline">
                        <Calendar className="w-4 h-4 px-2" />
                        Criado em
                        <span className="text-xs font-light italic ">
                          {team.createdAt
                            ? new Date(team.createdAt).toLocaleDateString()
                            : "-"}
                        </span>
                      </Badge>
                      <Badge variant="outline">
                        <Calendar className="w-4 h-4 px-2" />
                        Atualizado
                        <span className="text-xs font-light italic">
                          {team.updatedAt
                            ? new Date(team.updatedAt).toLocaleDateString()
                            : "-"}
                        </span>
                      </Badge>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </div>
        </TabsContent>

        {/* TAB SPRINTS */}
        <TabsContent value="sprints" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FolderOpen className="text-accent w-5 h-5" />
              Sprints do Projeto
            </h2>
            <Button onClick={() => setOpenSprintDialog(true)} className="gap-2">
              <Plus className="w-4 h-4" /> Novo Sprint
            </Button>
          </div>

          {sprintsLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando sprints...
            </div>
          ) : sprints.length === 0 ? (
            <Card className="text-center py-8">
              <CardContent>
                <span className="text-muted-foreground">
                  Nenhum sprint cadastrado neste projeto.
                </span>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sprints.map((sprint) => (
                <Card key={sprint.id} className="flex flex-col h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="truncate text-lg">
                      {sprint.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col gap-2">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge variant="secondary">Status: {sprint.status}</Badge>
                      <Badge variant="outline">
                        <Calendar className="w-4 h-4 mr-1 inline" />
                        {new Date(sprint.startDate).toLocaleDateString()} -{" "}
                        {new Date(sprint.endDate).toLocaleDateString()}
                      </Badge>
                    </div>
                    {sprint.goal && (
                      <div className="text-sm text-muted-foreground">
                        Meta: {sprint.goal}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Link to={`/dashboard/sprints/${sprint.id}`}>
                      <Button size="sm" variant="outline">
                        Ver detalhes
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog para criar sprint */}
      <Dialog open={openSprintDialog} onOpenChange={setOpenSprintDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Sprint</DialogTitle>
          </DialogHeader>
          {id && <SprintForm projectId={id} onSuccess={handleSprintCreated} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
