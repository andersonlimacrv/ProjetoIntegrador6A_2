import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users } from "lucide-react";

export function TeamSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Configurações da Equipe
        </h1>
        <p className="text-muted-foreground">
          Gerencie as configurações específicas da equipe.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Configurações da Equipe
          </CardTitle>
          <CardDescription>
            Visualize e gerencie configurações específicas da equipe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Formulário de configurações da equipe virá aqui
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
