import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookText } from "lucide-react";

export function UserStoriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Histórias de Usuário
        </h1>
        <p className="text-muted-foreground">
          Gerencie suas histórias de usuário e backlog.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookText className="h-5 w-5" />
            Suas Histórias
          </CardTitle>
          <CardDescription>
            Visualize e gerencie todas as histórias de usuário
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Lista de histórias virá aqui
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
