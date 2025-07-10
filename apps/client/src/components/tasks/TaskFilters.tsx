import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Filter, Search, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Project {
  id: string;
  name: string;
}
interface Sprint {
  id: string;
  name: string;
}

interface Filters {
  search: string;
  status: string;
  priority: string;
  assignee: string;
}

interface TaskFiltersProps {
  projects: Project[];
  sprints: Sprint[];
  filters: Filters;
  setFilters: (filters: Filters) => void;
  selectedProject: string;
  setSelectedProject: (id: string) => void;
  selectedSprint: string;
  setSelectedSprint: (id: string) => void;
}

const TaskFilters = ({
  projects,
  sprints,
  filters,
  setFilters,
  selectedProject,
  setSelectedProject,
  selectedSprint,
  setSelectedSprint,
}: TaskFiltersProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2">
          <Filter className="h-5 w-5 text-accent" />
          Filtros e Ordenação
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row md:flex-wrap gap-4 px-6">
          <div className="space-y-2 md:flex-1 min-w-[180px]">
            <Label htmlFor="project">Projeto</Label>
            <div className="flex items-center gap-2">
              <Select
                value={selectedProject}
                onValueChange={setSelectedProject}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {projects
                    .filter((p) => p.id)
                    .map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {selectedProject !== "all" && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive hover:bg-destructive/10 ml-1 p-0.5 cursor-pointer"
                  aria-label="Limpar filtro de sprint"
                  onClick={() => setSelectedProject("all")}
                >
                  <span className="font-extrabold text-lg" aria-hidden>
                    ✕
                  </span>
                </Button>
              )}
            </div>
          </div>
          <div className="space-y-2 md:flex-1 min-w-[180px]">
            <Label htmlFor="sprint">Sprint</Label>
            <div className="flex items-center gap-2">
              <Select
                value={selectedSprint}
                onValueChange={setSelectedSprint}
                disabled={!selectedProject}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {sprints
                    .filter((s) => s.id)
                    .map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {selectedSprint !== "all" && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive hover:bg-destructive/10 ml-1 p-0.5 cursor-pointer"
                  aria-label="Limpar filtro de sprint"
                  onClick={() => setSelectedSprint("all")}
                >
                  <span className="font-extrabold text-lg" aria-hidden>
                    ✕
                  </span>
                </Button>
              )}
            </div>
          </div>
          <div className="space-y-2 md:flex-1 min-w-[180px]">
            <Label htmlFor="search">Buscar</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="search"
                placeholder="Buscar tarefas..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="pl-10"
              />
            </div>
          </div>
          {/* Adicione outros filtros conforme necessário */}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskFilters;
