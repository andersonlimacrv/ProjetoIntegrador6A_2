import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LifeBuoy } from "lucide-react";

export function SupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Suporte</h1>
        <p className="text-muted-foreground">
          Obtenha ajuda e suporte para suas dúvidas.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LifeBuoy className="h-5 w-5" />
            Central de Suporte
          </CardTitle>
          <CardDescription>
            Encontre respostas para suas perguntas e obtenha ajuda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Central de suporte virá aqui
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
