import TeamLegend from "@/components/tasks/TeamLegend";

export default function DashboardRecentProjects({
  loading,
  recentProjects,
  projectTeams,
}) {
  return (
    <div className="mt-4 w-full">
      <h3 className="text-base mb-2 font-semibold">Projetos Recentes</h3>
      {loading ? (
        <div className="text-muted-foreground">Carregando...</div>
      ) : recentProjects.length === 0 ? (
        <div className="text-muted-foreground">
          Nenhum projeto recente encontrado.
        </div>
      ) : (
        <ul className="list-disc ml-6 space-y-3">
          {recentProjects.map((proj) => (
            <li key={proj.id} className="text-sm flex flex-col gap-1">
              <span className="font-semibold">{proj.name}</span>{" "}
              <span className="text-xs text-muted-foreground">
                (
                {proj.createdAt
                  ? new Date(proj.createdAt).toLocaleDateString()
                  : ""}
                )
              </span>
              <div className="mt-1">
                <TeamLegend members={projectTeams[proj.id] || []} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
