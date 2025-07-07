import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Map } from "lucide-react";

export function AllProjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Todos os Projetos</h1>
        <p className="text-muted-foreground">
          Visualize todos os projetos disponíveis.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5" />
            Todos os Projetos
          </CardTitle>
          <CardDescription>
            Visualize e gerencie todos os projetos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Lista completa de projetos virá aqui
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
