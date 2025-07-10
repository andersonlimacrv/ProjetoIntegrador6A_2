import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function DashboardActivities({ loading, activities }) {
  return (
    <Card className="col-span-3 shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>Atividades Recentes</CardTitle>
        <CardDescription>Últimas atualizações do projeto</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-64 overflow-y-auto">
          {loading ? (
            <div className="text-muted-foreground">Carregando...</div>
          ) : activities.length === 0 ? (
            <div className="text-muted-foreground">
              Nenhuma atividade recente encontrada.
            </div>
          ) : (
            activities.slice(0, 8).map((activity, idx) => (
              <div
                key={activity.id || idx}
                className="flex items-center space-x-4"
              >
                <div className="w-2 h-2 rounded-full bg-accent" />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {activity.description || activity.type || "Atividade"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.createdAt
                      ? new Date(activity.createdAt).toLocaleString()
                      : ""}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
