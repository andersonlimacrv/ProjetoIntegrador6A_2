import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Users, Target, BarChart3 } from "lucide-react";
import { useState } from "react";
import { LoginDialog } from "@/components/auth/LoginDialog";
import BlurText from "@/components/common/BlurText";
import { AuroraText } from "@/components/ui/aurora-text";

export function HeroSection() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <section className="pt-40 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl 2xl:max-w-[1600px] 4xl:max-w-[2000px]">
          <div className="text-center py-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-full text-purple-300 text-sm font-medium backdrop-blur-sm mb-6">
                <BarChart3 className="w-4 h-4 mr-2" />
                Aumente sua produtividade em 40%
              </div>
              <div className="flex justify-center flex-col">
                <BlurText
                  text="Gerencie projetos"
                  delay={150}
                  animateBy="words"
                  direction="top"
                  className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold leading-tight mb-4 mx-auto text-white/80"
                />
                <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold leading-tight mb-6">
                  <p className="inline-flex px-2 lg:px-4 2xl:px-6 text-white/80">
                    do
                  </p>
                  <AuroraText> jeito certo ⏱</AuroraText>
                </h1>
              </div>

              <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl text-gray-300 max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto mb-8 leading-relaxed">
                Plataforma completa para gestão ágil de projetos, com quadros
                Kanban intuitivos, métricas avançadas e colaboração em tempo
                real. Transforme sua equipe em uma máquina de produtividade.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Button
                size="lg"
                onClick={() => setIsLoginOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg xl:text-xl xl:px-12 xl:py-6"
              >
                Começar grátis
                <ArrowRight className="ml-2 h-5 w-5 xl:h-6 xl:w-6" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg xl:text-xl xl:px-12 xl:py-6 backdrop-blur-sm bg-accent/20"
              >
                <Play className="mr-2 h-5 w-5 xl:h-6 xl:w-6" />
                Ver demonstração
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto mt-20"
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 xl:p-8 border border-white/10">
                <div className="flex items-center justify-center w-12 h-12 xl:w-16 xl:h-16 bg-purple-600/20 rounded-lg mb-4 mx-auto">
                  <Users className="w-6 h-6 xl:w-8 xl:h-8 text-purple-400" />
                </div>
                <h3 className="text-lg xl:text-xl font-semibold text-white mb-2">
                  Colaboração em Tempo Real
                </h3>
                <p className="text-gray-400 text-sm xl:text-base">
                  Trabalhe junto com sua equipe em qualquer lugar, com
                  atualizações instantâneas
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 xl:p-8 border border-white/10">
                <div className="flex items-center justify-center w-12 h-12 xl:w-16 xl:h-16 bg-pink-600/20 rounded-lg mb-4 mx-auto">
                  <Target className="w-6 h-6 xl:w-8 xl:h-8 text-pink-400" />
                </div>
                <h3 className="text-lg xl:text-xl font-semibold text-white mb-2">
                  Metodologia Ágil
                </h3>
                <p className="text-gray-400 text-sm xl:text-base">
                  Sprints, épicos e histórias de usuário organizados de forma
                  intuitiva
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 xl:p-8 border border-white/10">
                <div className="flex items-center justify-center w-12 h-12 xl:w-16 xl:h-16 bg-purple-600/20 rounded-lg mb-4 mx-auto">
                  <BarChart3 className="w-6 h-6 xl:w-8 xl:h-8 text-purple-400" />
                </div>
                <h3 className="text-lg xl:text-xl font-semibold text-white mb-2">
                  Analytics Avançados
                </h3>
                <p className="text-gray-400 text-sm xl:text-base">
                  Métricas detalhadas e insights para otimizar a performance da
                  equipe
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </>
  );
}
