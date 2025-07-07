import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GanttChartSquare } from "lucide-react";

export function SprintPlanningPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Planejamento de Sprint
        </h1>
        <p className="text-muted-foreground">
          Planeje e organize seus próximos sprints.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GanttChartSquare className="h-5 w-5" />
            Planejamento
          </CardTitle>
          <CardDescription>
            Organize tarefas e estime esforços para o próximo sprint
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Ferramentas de planejamento virão aqui
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
