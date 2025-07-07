import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck } from "lucide-react";

export function CurrentSprintPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sprint Atual</h1>
        <p className="text-muted-foreground">
          Visualize e gerencie o sprint em andamento.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarCheck className="h-5 w-5" />
            Sprint Atual
          </CardTitle>
          <CardDescription>
            Detalhes e progresso do sprint atual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Detalhes do sprint atual virão aqui
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 