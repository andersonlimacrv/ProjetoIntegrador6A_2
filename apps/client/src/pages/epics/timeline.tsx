import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ListChecks } from "lucide-react";

export function EpicTimelinePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Timeline de Épicos
        </h1>
        <p className="text-muted-foreground">
          Visualize a linha do tempo dos seus épicos.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks className="h-5 w-5" />
            Timeline
          </CardTitle>
          <CardDescription>
            Visualize o cronograma e dependências dos épicos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Timeline interativa virá aqui
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
