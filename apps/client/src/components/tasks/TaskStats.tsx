import { Card, CardContent } from "@/components/ui/card";
import {
  CheckSquare,
  AlertCircle,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  Circle,
} from "lucide-react";
import type { Status } from "@packages/shared";

interface TaskStatsProps {
  stats: {
    total: number;
    totalEstimatedHours: number;
    totalActualHours: number;
    statusCounts: Record<string, number>;
  };
  statuses: Status[];
}

const TaskStats = ({ stats, statuses }: TaskStatsProps) => {
  // Função para obter o ícone baseado no nome do status
  const getStatusIcon = (statusName: string) => {
    const name = statusName.toUpperCase();
    if (name.includes("TODO") || name.includes("A FAZER")) return AlertCircle;
    if (name.includes("PROGRESS") || name.includes("EM PROGRESSO")) return Play;
    if (name.includes("REVIEW") || name.includes("REVISÃO")) return Pause;
    if (name.includes("DONE") || name.includes("CONCLUÍDA")) return CheckCircle;
    if (name.includes("CANCELLED") || name.includes("CANCELADA"))
      return XCircle;
    return Circle;
  };

  // Função para obter a cor baseada no nome do status
  const getStatusColor = (statusName: string) => {
    const name = statusName.toUpperCase();
    if (name.includes("TODO") || name.includes("A FAZER"))
      return "text-gray-600";
    if (name.includes("PROGRESS") || name.includes("EM PROGRESSO"))
      return "text-blue-600";
    if (name.includes("REVIEW") || name.includes("REVISÃO"))
      return "text-yellow-600";
    if (name.includes("DONE") || name.includes("CONCLUÍDA"))
      return "text-green-600";
    if (name.includes("CANCELLED") || name.includes("CANCELADA"))
      return "text-red-600";
    return "text-gray-500";
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-1">
      {/* Total de Tarefas */}
      <Card>
        <CardContent>
          <div className="text-center">
            <CheckSquare className="h-6 w-6 mx-auto text-blue-600 mb-2" />
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
        </CardContent>
      </Card>

      {/* Status Dinâmicos */}
      {statuses.map((status) => {
        const IconComponent = getStatusIcon(status.name);
        const colorClass = getStatusColor(status.name);
        const count = stats.statusCounts[status.name] || 0;

        return (
          <Card key={status.id}>
            <CardContent>
              <div className="text-center">
                <IconComponent
                  className={`h-6 w-6 mx-auto ${colorClass} mb-2`}
                />
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-xs text-muted-foreground">{status.name}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Horas Estimadas */}
      <Card>
        <CardContent>
          <div className="text-center">
            <Clock className="h-6 w-6 mx-auto text-purple-600 mb-2" />
            <p className="text-2xl font-bold">{stats.totalEstimatedHours}</p>
            <p className="text-xs text-muted-foreground">Horas Estimadas</p>
          </div>
        </CardContent>
      </Card>

      {/* Horas Reais */}
      <Card>
        <CardContent>
          <div className="text-center">
            <BarChart3 className="h-6 w-6 mx-auto text-orange-600 mb-2" />
            <p className="text-2xl font-bold">{stats.totalActualHours}</p>
            <p className="text-xs text-muted-foreground">Horas Reais</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskStats;
