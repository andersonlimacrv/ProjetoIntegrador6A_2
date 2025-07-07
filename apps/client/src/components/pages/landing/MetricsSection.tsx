import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, Users, Clock, Target } from "lucide-react";

const productivityData = [
  { month: "Jan", tasks: 120, completed: 95 },
  { month: "Feb", tasks: 150, completed: 125 },
  { month: "Mar", tasks: 180, completed: 165 },
  { month: "Apr", tasks: 210, completed: 195 },
  { month: "May", tasks: 240, completed: 220 },
  { month: "Jun", tasks: 275, completed: 260 },
];

const sprintData = [
  { sprint: "Sprint 1", velocity: 32 },
  { sprint: "Sprint 2", velocity: 45 },
  { sprint: "Sprint 3", velocity: 52 },
  { sprint: "Sprint 4", velocity: 48 },
  { sprint: "Sprint 5", velocity: 58 },
];

const taskDistribution = [
  { name: "Concluídas", value: 65, color: "#10b981" },
  { name: "Em Progresso", value: 25, color: "#f59e0b" },
  { name: "Pendentes", value: 10, color: "#ef4444" },
];

export function MetricsSection() {
  return (
    <section id="metrics" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-green-600/20 border border-green-500/30 rounded-full text-green-300 text-sm font-medium backdrop-blur-sm mb-6">
            <TrendingUp className="w-4 h-4 mr-2" />
            Resultados Comprovados
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Métricas que falam por si só
            </span>
          </h2>

          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Veja como o AllSync está ajudando equipes a alcançar resultados
            extraordinários
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 text-center">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-green-600/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <CardTitle className="text-3xl font-bold text-white">
                  40%
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Aumento na produtividade
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 text-center">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-blue-600/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <CardTitle className="text-3xl font-bold text-white">
                  25K+
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Usuários ativos
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 text-center">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-purple-600/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-400" />
                </div>
                <CardTitle className="text-3xl font-bold text-white">
                  60%
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Redução no tempo de entrega
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 text-center">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-pink-600/20 flex items-center justify-center">
                  <Target className="w-6 h-6 text-pink-400" />
                </div>
                <CardTitle className="text-3xl font-bold text-white">
                  95%
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Taxa de satisfação
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                  Evolução da Produtividade
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Tarefas criadas vs. concluídas nos últimos 6 meses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={productivityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Line
                        type="monotone"
                        dataKey="tasks"
                        stroke="#8B5CF6"
                        strokeWidth={2}
                        dot={{ fill: "#8B5CF6" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="completed"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={{ fill: "#10B981" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="w-5 h-5 mr-2 text-blue-400" />
                  Velocity por Sprint
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Pontos de história entregues por sprint
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sprintData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="sprint" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Bar dataKey="velocity" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
