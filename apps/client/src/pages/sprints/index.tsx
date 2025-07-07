
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket } from "lucide-react";

export function SprintsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sprints</h1>
        <p className="text-muted-foreground">
          Gerencie seus sprints e planejamento ágil.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Seus Sprints
          </CardTitle>
          <CardDescription>
            Visualize e gerencie todos os sprints do projeto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Lista de sprints virá aqui
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
