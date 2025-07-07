import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileStack } from "lucide-react";

export function BacklogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Backlog</h1>
        <p className="text-muted-foreground">Gerencie o backlog do produto.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileStack className="h-5 w-5" />
            Backlog do Produto
          </CardTitle>
          <CardDescription>
            Visualize e organize o backlog de histórias de usuário
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Lista do backlog virá aqui
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
