import { Outlet } from "react-router-dom";

export function ProjectsPage() {
  return (
    <div className="space-y-6 ">
      <div className="flex flex-col gap-2"  >
        <h1 className="text-3xl font-bold tracking-tight">Projetos</h1>
        <p className="text-muted-foreground">
          Gerencie seus projetos e equipes.
        </p>
      </div>

      <Outlet />
    </div>
  );
}
