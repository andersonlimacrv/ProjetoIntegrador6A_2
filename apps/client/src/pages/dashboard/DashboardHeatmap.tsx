export default function DashboardHeatmap({ days, dateMap }) {
  return (
    <div className="flex flex-col items-center">
      <span className="mb-2 text-xs text-muted-foreground">Mapa de calor das tarefas (últimos 30 dias)</span>
      <div className="flex gap-1">
        {days.map((day) => {
          const val = dateMap[day] || { created: 0, done: 0 };
          const intensity = Math.min(val.created + val.done, 5);
          const color = [
            "#f3f4f6",
            "#d1fae5",
            "#6ee7b7",
            "#34d399",
            "#059669",
            "#065f46",
          ][intensity];
          return (
            <div
              key={day}
              title={`${day}\nCriadas: ${val.created}\nConcluídas: ${val.done}`}
              className="w-4 h-8 rounded-sm border border-gray-200"
              style={{ backgroundColor: color }}
            />
          );
        })}
      </div>
    </div>
  );
} 