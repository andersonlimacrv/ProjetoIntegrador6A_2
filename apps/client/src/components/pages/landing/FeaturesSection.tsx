import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Kanban,
  Calendar,
  BarChart3,
  Users,
  Zap,
  Shield,
  Clock,
  MessageSquare,
  Target,
  Workflow,
} from "lucide-react";

const features = [
  {
    icon: Kanban,
    title: "Quadros Kanban",
    description:
      "Visualize o fluxo de trabalho com quadros personalizáveis e intuitivos",
    color: "from-purple-600 to-pink-600",
  },
  {
    icon: Calendar,
    title: "Gestão de Sprints",
    description: "Planeje e execute sprints com cronogramas e metas claras",
    color: "from-blue-600 to-purple-600",
  },
  {
    icon: BarChart3,
    title: "Analytics Avançados",
    description:
      "Métricas detalhadas sobre produtividade e performance da equipe",
    color: "from-green-600 to-blue-600",
  },
  {
    icon: Users,
    title: "Colaboração em Equipe",
    description:
      "Trabalhe junto com comentários, menções e atualizações em tempo real",
    color: "from-pink-600 to-purple-600",
  },
  {
    icon: Target,
    title: "Épicos & Histórias",
    description: "Organize projetos grandes em épicos e histórias de usuário",
    color: "from-purple-600 to-blue-600",
  },
  {
    icon: Workflow,
    title: "Fluxos Personalizados",
    description: "Crie fluxos de trabalho que se adaptam ao seu processo",
    color: "from-orange-600 to-pink-600",
  },
  {
    icon: Clock,
    title: "Controle de Tempo",
    description:
      "Rastreie tempo gasto em tarefas e gere relatórios automáticos",
    color: "from-teal-600 to-green-600",
  },
  {
    icon: MessageSquare,
    title: "Comunicação Integrada",
    description: "Chat interno, notificações e updates centralizados",
    color: "from-indigo-600 to-purple-600",
  },
  {
    icon: Shield,
    title: "Segurança Enterprise",
    description: "Controle de acesso granular e auditoria completa",
    color: "from-red-600 to-pink-600",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-full text-purple-300 text-sm font-medium backdrop-blur-sm mb-6">
            <Zap className="w-4 h-4 mr-2" />
            Recursos Poderosos
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Tudo que você precisa para
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              gerenciar projetos ágeis
            </span>
          </h2>

          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Nossa plataforma oferece ferramentas completas para metodologias
            ágeis, desde o planejamento até a entrega, com foco na colaboração e
            produtividade.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/50 transition-all duration-300 h-full">
                <CardHeader className="text-center">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${feature.color} p-0.5 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <div className="w-full h-full bg-gray-900/70 rounded-2xl flex items-center justify-center">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
