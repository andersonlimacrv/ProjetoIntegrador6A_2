import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AnimatedCircularProgressBar } from "../ui/animated-circular-progress-bar";
import { Calendar, Clock, MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

type Priority = "high" | "medium" | "low";

interface Task {
  id: number;
  title: string;
  priority: Priority;
  assignee: string;
  avatar: string;
}

interface KanbanColumn {
  title: string;
  color: string;
  tasks: Task[];
}
const priorityColors: Record<Priority, string> = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};

// Colunas do Kanban com tipagem
const kanbanColumns: KanbanColumn[] = [
  {
    title: "Backlog",
    color: "border-gray-500",
    tasks: [
      {
        id: 1,
        title: "Implementar autenticação JWT",
        priority: "high",
        assignee: "João Silva",
        avatar: "JS",
      },
      {
        id: 2,
        title: "Criar testes unitários",
        priority: "medium",
        assignee: "Maria Santos",
        avatar: "MS",
      },
    ],
  },
  {
    title: "Em Progresso",
    color: "border-yellow-500",
    tasks: [
      {
        id: 3,
        title: "Dashboard de métricas",
        priority: "high",
        assignee: "Pedro Costa",
        avatar: "PC",
      },
      {
        id: 4,
        title: "API de notificações",
        priority: "medium",
        assignee: "Ana Lima",
        avatar: "AL",
      },
    ],
  },
  {
    title: "Review",
    color: "border-blue-500",
    tasks: [
      {
        id: 5,
        title: "Integração com Slack",
        priority: "low",
        assignee: "Carlos Rocha",
        avatar: "CR",
      },
    ],
  },
  {
    title: "Concluído",
    color: "border-green-500",
    tasks: [
      {
        id: 6,
        title: "Setup do projeto",
        priority: "high",
        assignee: "João Silva",
        avatar: "JS",
      },
      {
        id: 7,
        title: "Configuração CI/CD",
        priority: "medium",
        assignee: "Maria Santos",
        avatar: "MS",
      },
    ],
  },
];

export function DashboardPreview() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const handleIncrement = (prev: number) => {
      if (prev === 100) {
        return 0;
      }
      return prev + 10;
    };
    setValue(handleIncrement);
    const interval = setInterval(() => setValue(handleIncrement), 2000);
    return () => clearInterval(interval);
  }, []);
  return (
    <section id="dashboard" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium backdrop-blur-sm mb-6">
            <Calendar className="w-4 h-4 mr-2" />
            Dashboard Intuitivo
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Visualize tudo em um só lugar
            </span>
          </h2>

          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Dashboard completo com quadros Kanban, métricas em tempo real e
            ferramentas de colaboração
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Projeto AllSync
              </h3>
              <p className="text-gray-300">Sprint 5 - Semana 2</p>
            </div>
            <div className="flex items-center space-x-4">
              <p className="text-lg text-gray-300">Progresso geral <span className="text-white/20">( % )</span></p>
              <AnimatedCircularProgressBar
                max={100}
                min={0}
                value={value}
                gaugePrimaryColor="rgb(103 90 229 / 80%)"
                gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
                className="size-20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kanbanColumns.map((column, columnIndex) => (
              <motion.div
                key={column.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: columnIndex * 0.1 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <div
                  className={`flex items-center justify-between p-3 rounded-lg border-l-4 bg-white/5 ${column.color}`}
                >
                  <h4 className="font-semibold text-white">{column.title}</h4>
                  <Badge variant="secondary" className="bg-white/10 text-white">
                    {column.tasks.length}
                  </Badge>
                </div>

                <div className="space-y-3">
                  {column.tasks.map((task, taskIndex) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: taskIndex * 0.1 }}
                      viewport={{ once: true }}
                      className="group"
                    >
                      <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/50 transition-all cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                priorityColors[task.priority]
                              } flex-shrink-0 mt-1`}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>

                          <h5 className="font-medium text-white mb-3 line-clamp-2">
                            {task.title}
                          </h5>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs bg-purple-600">
                                  {task.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-gray-300">
                                {task.assignee}
                              </span>
                            </div>

                            <div className="flex items-center space-x-2 text-gray-400">
                              <Clock className="h-3 w-3" />
                              <span className="text-xs">2d</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
