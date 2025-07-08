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
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus } from "lucide-react";
// Importe o serviço de sprints quando existir
// import { sprintsApi } from "@/services/domains/sprintsApi";

// Tipo Sprint mínimo (ajuste conforme seu backend/shared)
type Sprint = {
  id: string;
  name: string;
  status: string;
  startDate: string;
  endDate: string;
  goal?: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function ProjectSprintsPage() {
  const { id: projectId } = useParams();
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulação de fetch (troque pelo sprintsApi real)
  useEffect(() => {
    setLoading(true);
    // Exemplo de fetch, troque pelo seu sprintsApi.getByProject(projectId)
    // sprintsApi.getByProject(projectId).then(...)
    setTimeout(() => {
      setSprints([
        {
          id: "1",
          name: "Sprint 1",
          status: "active",
          startDate: "2025-07-01",
          endDate: "2025-07-15",
          goal: "Entregar MVP inicial",
        },
        {
          id: "2",
          name: "Sprint 2",
          status: "planned",
          startDate: "2025-07-16",
          endDate: "2025-07-30",
        },
      ]);
      setLoading(false);
    }, 800);
  }, [projectId]);

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-2 sm:px-6 flex flex-col gap-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">Sprints do Projeto</h1>
        <Button variant="outline" className="gap-2">
          <Plus className="w-4 h-4" /> Novo Sprint
        </Button>
      </div>
      {loading ? (
        <div className="text-center text-muted-foreground py-12">
          Carregando...
        </div>
      ) : sprints.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <span className="text-muted-foreground">
              Nenhum sprint cadastrado.
            </span>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sprints.map((sprint) => (
            <Card key={sprint.id} className="flex flex-col h-full">
              <CardHeader>
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
                <Button asChild size="sm" variant="outline">
                  <Link to={`sprints/${sprint.id}`}>Ver detalhes</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
