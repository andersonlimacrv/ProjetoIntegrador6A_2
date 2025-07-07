import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Layers } from "lucide-react";

export function EpicsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Épicos</h1>
        <p className="text-muted-foreground">
          Gerencie seus épicos e histórias de usuário.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Seus Épicos
          </CardTitle>
          <CardDescription>
            Visualize e gerencie todos os épicos do projeto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Lista de épicos virá aqui
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
