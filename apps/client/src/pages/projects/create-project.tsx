
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

export function CreateProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Criar Projeto</h1>
        <p className="text-muted-foreground">
          Crie um novo projeto para sua equipe.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            Novo Projeto
          </CardTitle>
          <CardDescription>
            Preencha as informações para criar um novo projeto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Formulário de criação de projeto virá aqui
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
