import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users } from "lucide-react";

export function TeamsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Equipes</h1>
        <p className="text-muted-foreground">
          Gerencie suas equipes e membros do projeto.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Suas Equipes
          </CardTitle>
          <CardDescription>
            Visualize e gerencie todas as equipes do projeto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Conteúdo das equipes virá aqui
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
