import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Presentation } from "lucide-react";

export function EpicBoardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Board de Épicos</h1>
        <p className="text-muted-foreground">
          Visualize seus épicos em um board Kanban.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Presentation className="h-5 w-5" />
            Board de Épicos
          </CardTitle>
          <CardDescription>
            Visualize e organize seus épicos em colunas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Board Kanban virá aqui
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
