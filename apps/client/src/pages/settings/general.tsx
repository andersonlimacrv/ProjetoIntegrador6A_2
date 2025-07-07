import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Settings2 } from "lucide-react";

export function GeneralSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Configurações Gerais
        </h1>
        <p className="text-muted-foreground">
          Gerencie as configurações gerais do projeto.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Configurações Gerais
          </CardTitle>
          <CardDescription>
            Visualize e gerencie configurações básicas do projeto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Formulário de configurações gerais virá aqui
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
