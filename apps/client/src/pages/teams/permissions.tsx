import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WalletCards } from "lucide-react";

export function PermissionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Permissões</h1>
        <p className="text-muted-foreground">
          Gerencie as permissões e acessos das equipes.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <WalletCards className="h-5 w-5" />
            Permissões da Equipe
          </CardTitle>
          <CardDescription>
            Visualize e gerencie todas as permissões
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Lista de permissões virá aqui
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
