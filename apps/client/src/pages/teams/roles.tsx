import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileStack } from "lucide-react";

export function RolesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Funções</h1>
        <p className="text-muted-foreground">
          Gerencie as funções e responsabilidades das equipes.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileStack className="h-5 w-5" />
            Funções da Equipe
          </CardTitle>
          <CardDescription>
            Visualize e gerencie todas as funções
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Lista de funções virá aqui
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
