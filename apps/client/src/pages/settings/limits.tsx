import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sliders } from "lucide-react";

export function LimitsSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Configurações de Limites
        </h1>
        <p className="text-muted-foreground">
          Gerencie os limites e restrições do projeto.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sliders className="h-5 w-5" />
            Limites
          </CardTitle>
          <CardDescription>
            Visualize e gerencie limites e restrições do projeto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Painel de limites virá aqui
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
