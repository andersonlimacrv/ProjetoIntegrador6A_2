import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WalletCards } from "lucide-react";

export function BillingSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Configurações de Faturamento
        </h1>
        <p className="text-muted-foreground">
          Gerencie as configurações de faturamento e pagamento.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <WalletCards className="h-5 w-5" />
            Faturamento
          </CardTitle>
          <CardDescription>
            Visualize e gerencie configurações de faturamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Painel de faturamento virá aqui
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
