import { Outlet } from "react-router-dom";

export function TeamsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Equipes</h1>
        <p className="text-muted-foreground">
          Gerencie suas equipes e membros.
        </p>
      </div>

      <Outlet />
    </div>
  );
}
