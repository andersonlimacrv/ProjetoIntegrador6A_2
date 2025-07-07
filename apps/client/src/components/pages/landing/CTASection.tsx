import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import { LoginDialog } from "@/components/auth/LoginDialog";

const benefits = [
  "Setup em menos de 2 minutos",
  "Integração com Slack, GitHub e mais",
  "Suporte 24/7 em português",
  "Migração gratuita de outros tools",
  "Onboarding personalizado",
];

export function CTASection() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border-purple-500/30 backdrop-blur-sm overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-500/20 to-transparent rounded-full blur-3xl" />

              <CardContent className="p-12 relative z-10">
                <div className="text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <div className="inline-flex items-center px-4 py-2 bg-purple-600/30 border border-purple-500/50 rounded-full text-purple-200 text-sm font-medium backdrop-blur-sm mb-6">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Comece hoje mesmo
                    </div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                      <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                        Pronto para transformar
                      </span>
                      <br />
                      <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                        sua equipe?
                      </span>
                    </h2>

                    <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
                      Junte-se a mais de 25.000 equipes que já aumentaram sua
                      produtividade com o AllSync. Teste grátis por 14 dias, sem
                      cartão de crédito.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
                  >
                    <Button
                      size="lg"
                      onClick={() => setIsLoginOpen(true)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg"
                    >
                      Começar teste grátis
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>

                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg backdrop-blur-sm bg-accent/20"
                    >
                      Agendar demonstração
                    </Button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto"
                  >
                    {benefits.map((benefit, index) => (
                      <div
                        key={benefit}
                        className="flex items-center space-x-3 border-2 border-gray-600/80 rounded-full px-2 py-1 bg-gradient-to-l from-gray-800/20 to-gray-800/0 backdrop-blur-sm"
                      >
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{benefit}</span>
                      </div>
                    ))}
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </>
  );
}
