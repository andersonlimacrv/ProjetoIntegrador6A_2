import { useState } from "react";
import { MetricsDashboard } from "@/components/dashboard/MetricsDashboard";

export function AnalyticsDashboardPage() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "quarter" | "year">("month");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard de Métricas</h1>
        <p className="text-muted-foreground">
          Visualize o progresso e performance do projeto com métricas detalhadas.
        </p>
      </div>

      <MetricsDashboard
        projectId="current"
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
      />
    </div>
  );
} 