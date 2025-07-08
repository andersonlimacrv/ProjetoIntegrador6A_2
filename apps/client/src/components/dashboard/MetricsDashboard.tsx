import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  FileText,
  CheckSquare,
  Calendar,
  Users,
  Clock,
  Activity,
  PieChart,
  LineChart,
  BarChart,
  Download,
  RefreshCw,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface MetricCard {
  title: string;
  value: string | number;
  change?: number;
  changeType?: "increase" | "decrease" | "neutral";
  icon: React.ReactNode;
  color: string;
  description?: string;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}

interface MetricsDashboardProps {
  projectId?: string;
  timeRange: "week" | "month" | "quarter" | "year";
  onTimeRangeChange: (range: "week" | "month" | "quarter" | "year") => void;
}

export function MetricsDashboard({
  projectId,
  timeRange,
  onTimeRangeChange,
}: MetricsDashboardProps) {
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState({
    totalStories: 0,
    completedStories: 0,
    totalTasks: 0,
    completedTasks: 0,
    totalEpics: 0,
    activeSprints: 0,
    teamMembers: 0,
    velocity: 0,
    burndown: 0,
    cycleTime: 0,
    leadTime: 0,
  });

  const [chartData, setChartData] = useState<{
    velocity: ChartData;
    burndown: ChartData;
    statusDistribution: ChartData;
    priorityDistribution: ChartData;
  }>({
    velocity: {
      labels: [],
      datasets: [],
    },
    burndown: {
      labels: [],
      datasets: [],
    },
    statusDistribution: {
      labels: [],
      datasets: [],
    },
    priorityDistribution: {
      labels: [],
      datasets: [],
    },
  });

  // Simular carregamento de métricas
  useEffect(() => {
    setLoading(true);

    // Simular dados de métricas
    setTimeout(() => {
      setMetrics({
        totalStories: 45,
        completedStories: 32,
        totalTasks: 156,
        completedTasks: 128,
        totalEpics: 8,
        activeSprints: 2,
        teamMembers: 6,
        velocity: 24,
        burndown: 85,
        cycleTime: 3.2,
        leadTime: 5.8,
      });

      // Simular dados de gráficos
      setChartData({
        velocity: {
          labels: ["Sprint 1", "Sprint 2", "Sprint 3", "Sprint 4", "Sprint 5"],
          datasets: [
            {
              label: "Story Points",
              data: [18, 22, 25, 20, 24],
              backgroundColor: "#3b82f6",
              borderColor: "#1d4ed8",
              borderWidth: 2,
            },
          ],
        },
        burndown: {
          labels: [
            "Dia 1",
            "Dia 2",
            "Dia 3",
            "Dia 4",
            "Dia 5",
            "Dia 6",
            "Dia 7",
          ],
          datasets: [
            {
              label: "Story Points Restantes",
              data: [24, 20, 16, 12, 8, 4, 0],
              backgroundColor: "#10b981",
              borderColor: "#059669",
              borderWidth: 2,
            },
          ],
        },
        statusDistribution: {
          labels: [
            "Backlog",
            "Pronta",
            "Em Progresso",
            "Em Revisão",
            "Concluída",
          ],
          datasets: [
            {
              label: "Histórias",
              data: [8, 12, 6, 4, 15],
              backgroundColor: [
                "#3b82f6",
                "#10b981",
                "#f59e0b",
                "#8b5cf6",
                "#059669",
              ],
            },
          ],
        },
        priorityDistribution: {
          labels: ["Baixa", "Média", "Alta", "Crítica"],
          datasets: [
            {
              label: "Histórias",
              data: [10, 18, 12, 5],
              backgroundColor: ["#10b981", "#f59e0b", "#f97316", "#ef4444"],
            },
          ],
        },
      });

      setLoading(false);
    }, 1000);
  }, [timeRange, projectId]);

  const metricCards: MetricCard[] = [
    {
      title: "Histórias Totais",
      value: metrics.totalStories,
      change: 12,
      changeType: "increase",
      icon: <FileText className="h-4 w-4" />,
      color: "text-blue-600",
      description: "Histórias de usuário criadas",
    },
    {
      title: "Histórias Concluídas",
      value: metrics.completedStories,
      change: 8,
      changeType: "increase",
      icon: <CheckSquare className="h-4 w-4" />,
      color: "text-green-600",
      description: "Histórias finalizadas",
    },
    {
      title: "Tarefas Totais",
      value: metrics.totalTasks,
      change: -3,
      changeType: "decrease",
      icon: <Activity className="h-4 w-4" />,
      color: "text-purple-600",
      description: "Tarefas criadas",
    },
    {
      title: "Tarefas Concluídas",
      value: metrics.completedTasks,
      change: 15,
      changeType: "increase",
      icon: <CheckSquare className="h-4 w-4" />,
      color: "text-emerald-600",
      description: "Tarefas finalizadas",
    },
    {
      title: "Épicos",
      value: metrics.totalEpics,
      change: 2,
      changeType: "increase",
      icon: <Target className="h-4 w-4" />,
      color: "text-orange-600",
      description: "Épicos ativos",
    },
    {
      title: "Sprints Ativos",
      value: metrics.activeSprints,
      change: 0,
      changeType: "neutral",
      icon: <Calendar className="h-4 w-4" />,
      color: "text-indigo-600",
      description: "Sprints em andamento",
    },
    {
      title: "Membros da Equipe",
      value: metrics.teamMembers,
      change: 1,
      changeType: "increase",
      icon: <Users className="h-4 w-4" />,
      color: "text-pink-600",
      description: "Membros ativos",
    },
    {
      title: "Velocidade",
      value: `${metrics.velocity} pts/sprint`,
      change: 4,
      changeType: "increase",
      icon: <TrendingUp className="h-4 w-4" />,
      color: "text-cyan-600",
      description: "Story points por sprint",
    },
  ];

  const getChangeIcon = (changeType: "increase" | "decrease" | "neutral") => {
    switch (changeType) {
      case "increase":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "decrease":
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getChangeColor = (changeType: "increase" | "decrease" | "neutral") => {
    switch (changeType) {
      case "increase":
        return "text-green-600";
      case "decrease":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const completionRate =
    metrics.totalStories > 0
      ? (metrics.completedStories / metrics.totalStories) * 100
      : 0;
  const taskCompletionRate =
    metrics.totalTasks > 0
      ? (metrics.completedTasks / metrics.totalTasks) * 100
      : 0;

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Dashboard de Métricas
          </h2>
          <p className="text-muted-foreground">
            Visualize o progresso e performance do projeto
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={timeRange}
            onValueChange={(value: any) => onTimeRangeChange(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Última Semana</SelectItem>
              <SelectItem value="month">Último Mês</SelectItem>
              <SelectItem value="quarter">Último Trimestre</SelectItem>
              <SelectItem value="year">Último Ano</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <div className={metric.color}>{metric.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              {metric.change !== undefined && (
                <div className="flex items-center gap-1 text-xs">
                  {getChangeIcon(metric.changeType!)}
                  <span className={getChangeColor(metric.changeType!)}>
                    {metric.change > 0 ? "+" : ""}
                    {metric.change}%
                  </span>
                  <span className="text-muted-foreground">
                    vs. período anterior
                  </span>
                </div>
              )}
              {metric.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {metric.description}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Métricas de Progresso */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Progresso das Histórias
            </CardTitle>
            <CardDescription>
              Taxa de conclusão das histórias de usuário
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Conclusão Geral</span>
              <span className="text-sm font-bold">
                {completionRate.toFixed(1)}%
              </span>
            </div>
            <Progress value={completionRate} className="h-2" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Concluídas:</span>
                <span className="font-medium ml-2">
                  {metrics.completedStories}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Pendentes:</span>
                <span className="font-medium ml-2">
                  {metrics.totalStories - metrics.completedStories}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Progresso das Tarefas
            </CardTitle>
            <CardDescription>Taxa de conclusão das tarefas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Conclusão Geral</span>
              <span className="text-sm font-bold">
                {taskCompletionRate.toFixed(1)}%
              </span>
            </div>
            <Progress value={taskCompletionRate} className="h-2" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Concluídas:</span>
                <span className="font-medium ml-2">
                  {metrics.completedTasks}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Pendentes:</span>
                <span className="font-medium ml-2">
                  {metrics.totalTasks - metrics.completedTasks}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Velocidade */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Velocidade da Equipe
            </CardTitle>
            <CardDescription>
              Story points completados por sprint
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Gráfico de Velocidade
                </p>
                <p className="text-xs text-muted-foreground">
                  Média: {metrics.velocity} pts/sprint
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de Burndown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Burndown Chart
            </CardTitle>
            <CardDescription>Progresso do trabalho restante</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <LineChart className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Gráfico de Burndown
                </p>
                <p className="text-xs text-muted-foreground">
                  Progresso: {metrics.burndown}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Distribuição por Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Distribuição por Status
            </CardTitle>
            <CardDescription>
              Histórias organizadas por status atual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <PieChart className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Gráfico de Pizza
                </p>
                <p className="text-xs text-muted-foreground">
                  Status das histórias
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Distribuição por Prioridade */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Distribuição por Prioridade
            </CardTitle>
            <CardDescription>
              Histórias organizadas por prioridade
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Gráfico de Barras
                </p>
                <p className="text-xs text-muted-foreground">
                  Prioridades das histórias
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas de Performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Cycle Time
            </CardTitle>
            <CardDescription>
              Tempo médio para completar uma história
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.cycleTime}</div>
            <p className="text-sm text-muted-foreground">dias</p>
            <div className="mt-2">
              <Badge
                variant="outline"
                className="text-green-600 border-green-600"
              >
                <TrendingDown className="w-3 h-3 mr-1" />
                -0.5 dias
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Lead Time
            </CardTitle>
            <CardDescription>
              Tempo total desde a criação até a entrega
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.leadTime}</div>
            <p className="text-sm text-muted-foreground">dias</p>
            <div className="mt-2">
              <Badge variant="outline" className="text-red-600 border-red-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                +0.8 dias
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Capacidade da Equipe
            </CardTitle>
            <CardDescription>Média de story points por membro</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {(metrics.velocity / metrics.teamMembers).toFixed(1)}
            </div>
            <p className="text-sm text-muted-foreground">pts/membro</p>
            <div className="mt-2">
              <Badge
                variant="outline"
                className="text-green-600 border-green-600"
              >
                <TrendingUp className="w-3 h-3 mr-1" />
                +0.5 pts
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {loading && (
        <div className="text-center py-8 text-muted-foreground">
          <RefreshCw className="h-8 w-8 mx-auto mb-4 animate-spin" />
          <p>Carregando métricas...</p>
        </div>
      )}
    </div>
  );
}
