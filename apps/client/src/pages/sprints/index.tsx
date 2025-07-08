import { Outlet } from "react-router-dom";

export function SprintsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sprints</h1>
        <p className="text-muted-foreground">
          Gerencie seus sprints e planejamento.
        </p>
      </div>

      <Outlet />
    </div>
  );
}
