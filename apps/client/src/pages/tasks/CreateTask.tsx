import { useState, useEffect } from "react";
import { projectsApi } from "@/services/domains/projectsApi";
import { sprintsApi } from "@/services/domains/sprintsApi";
import { statusesApi } from "@/services/domains/statusesApi";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/contexts/toast-context";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import UserAvatar from "@/components/common/UserAvatar";
import { PRIORITY_LABELS } from "@/lib/constants";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { tasksApi } from "@/services/domains/tasksApi";

export default function CreateTask() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [sprints, setSprints] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [selectedSprint, setSelectedSprint] = useState<string>("all");
  const [projectMembers, setProjectMembers] = useState<any[]>([]);
  const [selectedAssignee, setSelectedAssignee] = useState<string>("all");
  const [statuses, setStatuses] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("1");
  const [dueDate, setDueDate] = useState("");
  const [statusId, setStatusId] = useState<string>("");

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user?.id) {
        setProjects([]);
        return;
      }
      const res = await projectsApi.getMyProjects(user.id);
      if (res.ok && res.data.success) {
        setProjects(Array.isArray(res.data.data) ? res.data.data : []);
      } else {
        setProjects([]);
        addToast({
          title: "Erro ao buscar projetos",
          description:
            res.data?.message || "Erro desconhecido ao buscar projetos",
          type: "error",
        });
      }
    };
    fetchProjects();
  }, [user]);

  useEffect(() => {
    // Buscar sprints do projeto selecionado
    const fetchSprints = async () => {
      if (selectedProject && selectedProject !== "all") {
        try {
          const res = await sprintsApi.getByProject(selectedProject);
          const arr = Array.isArray((res.data as any)?.data?.data)
            ? (res.data as any).data.data
            : [];
          setSprints(arr);
          if (arr.length === 1) {
            setSelectedSprint(arr[0].id);
          } else {
            setSelectedSprint("all");
          }
        } catch (err: any) {
          setSprints([]);
          setSelectedSprint("all");
          addToast({
            title: "Erro ao buscar sprints",
            description: err?.message || "Erro desconhecido ao buscar sprints",
            type: "error",
          });
        }
      } else {
        setSprints([]);
        setSelectedSprint("all");
      }
    };
    fetchSprints();
  }, [selectedProject]);

  useEffect(() => {
    // Buscar membros do projeto selecionado
    const fetchProjectMembers = async () => {
      if (selectedProject && selectedProject !== "all") {
        try {
          const res = await projectsApi.getMembers(selectedProject);
          if (res.ok && (res.data as any)?.success) {
            const members = (res.data as any)?.data || [];
            setProjectMembers(members);
          } else {
            setProjectMembers([]);
            addToast({
              title: "Erro ao buscar membros",
              description:
                res.data?.message || "Erro desconhecido ao buscar membros",
              type: "error",
            });
          }
        } catch (error: any) {
          setProjectMembers([]);
          addToast({
            title: "Erro ao buscar membros",
            description:
              error?.message || "Erro desconhecido ao buscar membros",
            type: "error",
          });
        }
      } else {
        setProjectMembers([]);
      }
    };
    fetchProjectMembers();
  }, [selectedProject]);

  useEffect(() => {
    // Buscar status do projeto selecionado
    const fetchStatuses = async () => {
      if (selectedProject && selectedProject !== "all") {
        try {
          const res = await statusesApi.getByProject(selectedProject);
          if (res.ok && res.data.success) {
            setStatuses(Array.isArray(res.data.data) ? res.data.data : []);
          } else {
            setStatuses([]);
            addToast({
              title: "Erro ao buscar status",
              description:
                res.data?.message || "Erro desconhecido ao buscar status",
              type: "error",
            });
          }
        } catch (error: any) {
          setStatuses([]);
          addToast({
            title: "Erro ao buscar status",
            description: error?.message || "Erro desconhecido ao buscar status",
            type: "error",
          });
        }
      } else {
        setStatuses([]);
      }
    };
    fetchStatuses();
  }, [selectedProject]);

  // Função para criar a task
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !user?.id ||
      selectedProject === "all" ||
      !title ||
      !priority ||
      statusId === "" ||
      (selectedSprint === "all" && sprints.length > 0)
    )
      return;
    const dto: any = {
      projectId: selectedProject,
      statusId,
      title,
      reporterId: user.id,
      priority: Number(priority),
    };
    if (description) dto.description = description;
    if (selectedSprint !== "all") dto.sprintId = selectedSprint;
    if (selectedAssignee !== "all") dto.assigneeId = selectedAssignee;
    if (dueDate) dto.dueDate = new Date(dueDate);
    try {
      const res = await tasksApi.create(dto);
      if (res.ok && res.data?.success) {
        addToast({
          title: "Tarefa criada com sucesso!",
          type: "success",
        });
        navigate("/dashboard/tasks");
      } else {
        addToast({
          title: "Erro ao criar tarefa",
          description:
            res.data?.message ||
            res.data?.error ||
            "Erro desconhecido ao criar tarefa",
          type: "error",
        });
      }
    } catch (err: any) {
      addToast({
        title: "Erro ao criar tarefa",
        description: err?.message || "Erro desconhecido ao criar tarefa",
        type: "error",
      });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full p-4 lg:p-16 4xl:p-32 max-w-7xl">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Criar Nova Tarefa</CardTitle>
          <CardDescription>
            Preencha os campos para cadastrar uma nova tarefa no projeto
            selecionado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Projeto */}
              <div>
                <Label htmlFor="projectId">Projeto</Label>
                <Select
                  value={selectedProject}
                  onValueChange={setSelectedProject}
                  required
                >
                  <SelectTrigger id="projectId" className="w-full">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Projetos</SelectLabel>
                      <SelectItem value="all">Selecione...</SelectItem>
                      {projects.map((p) => (
                        <SelectItem key={`project-${p.id}`} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              {/* Status */}
              <div>
                <Label htmlFor="statusId">Status</Label>
                <Select
                  value={statusId}
                  onValueChange={setStatusId}
                  required
                  disabled={selectedProject === "all" || statuses.length === 0}
                >
                  <SelectTrigger id="statusId" className="w-full">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      {statuses.map((s) => (
                        <SelectItem key={`status-${s.id}`} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              {/* Sprint */}
              <div>
                <Label htmlFor="sprintId">Sprint</Label>
                <Select
                  value={selectedSprint}
                  onValueChange={setSelectedSprint}
                  disabled={selectedProject === "all"}
                >
                  <SelectTrigger id="sprintId" className="w-full">
                    <SelectValue placeholder="Nenhuma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Sprints</SelectLabel>
                      <SelectItem value="all">Nenhuma</SelectItem>
                      {sprints.map((s) => (
                        <SelectItem key={`sprint-${s.id}`} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              {/* Prioridade */}
              <div>
                <Label htmlFor="priority">Prioridade</Label>
                <Select value={priority} onValueChange={setPriority} required>
                  <SelectTrigger id="priority" className="w-full">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Prioridade</SelectLabel>
                      {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                        <SelectItem key={`priority-${value}`} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              {/* Criado por (Reporter) */}
              <div>
                <Label htmlFor="reporterId">Criado por</Label>
                <Select value={user?.id || ""} disabled>
                  <SelectTrigger id="reporterId" className="w-full">
                    <SelectValue placeholder="Usuário atual" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Usuário</SelectLabel>
                      {user && (
                        <SelectItem value={user.id}>
                          <div className="flex items-center gap-2">
                            <UserAvatar
                              name={user.name}
                              avatarUrl={user.avatarUrl || ""}
                              size="sm"
                            />
                            <span>{user.name}</span>
                          </div>
                        </SelectItem>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              {/* Responsável */}
              <div>
                <Label htmlFor="assigneeId">Responsável</Label>
                <Select
                  value={selectedAssignee}
                  onValueChange={setSelectedAssignee}
                  disabled={
                    selectedProject === "all" || projectMembers.length === 0
                  }
                >
                  <SelectTrigger id="assigneeId" className="w-full">
                    <SelectValue placeholder="Nenhum" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Membros do Projeto</SelectLabel>
                      <SelectItem value="all">Nenhum</SelectItem>
                      {projectMembers.map((m) => (
                        <SelectItem key={`member-${m.id}`} value={m.id}>
                          <span className="flex items-center gap-2">
                            <UserAvatar
                              name={m.name}
                              avatarUrl={m.avatarUrl}
                              size="sm"
                            />
                            <span>{m.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Título */}
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            {/* Descrição */}
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            {/* Data de Vencimento */}
            <div>
              <Label htmlFor="dueDate">Data de Vencimento</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <CardFooter className="flex justify-end px-0">
              <Button type="submit" className="w-full md:w-auto">
                Criar Tarefa
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
