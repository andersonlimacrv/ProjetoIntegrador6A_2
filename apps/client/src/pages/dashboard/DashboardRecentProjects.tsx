import TeamLegend from "@/components/tasks/TeamLegend";
import { Card } from "@/components/ui/card";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardRecentProjects({
  loading,
  recentProjects,
  projectTeams,
}) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>Projetos Recentes</CardTitle>
        <CardDescription>Projetos mais recentemente criados</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-64 overflow-y-auto w-full">
          {loading ? (
            <div className="text-muted-foreground">Carregando...</div>
          ) : recentProjects.length === 0 ? (
            <div className="text-muted-foreground">Nenhum projeto recente.</div>
          ) : (
            recentProjects.map((project) => (
              <div key={project.id} className="flex items-center space-x-4 px-8 w-full">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{project.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {project.createdAt
                      ? new Date(project.createdAt).toLocaleString()
                      : ""}
                  </p>
                </div>
                <TeamLegend projectTeams={projectTeams} projectId={project.id} />
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
