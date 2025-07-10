import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Home, Search, MapPin, Zap, Ghost, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export function NotFoundPage() {
  const navigate = useNavigate();
  const [showSparkles, setShowSparkles] = useState(false);

  // Ativando sparkles periodicamente
  useEffect(() => {
    const sparkleInterval = setInterval(() => {
      setShowSparkles(true);
      setTimeout(() => setShowSparkles(false), 1000);
    }, 3000);
    return () => clearInterval(sparkleInterval);
  }, []);

  // Partículas flutuantes
  const FloatingParticle = ({ delay = 0 }) => (
    <motion.div
      className="absolute w-2 h-2 bg-primary/20 rounded-full"
      initial={{ opacity: 0, y: 50 }}
      animate={{
        opacity: [0, 1, 0],
        y: [50, -50, -100],
        x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut",
      }}
    />
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      {/* Partículas de fundo */}
      {[...Array(12)].map((_, i) => (
        <FloatingParticle key={i} delay={i * 0.3} />
      ))}

      {/* Círculos decorativos de fundo */}
      <motion.div
        className="absolute top-20 left-20 w-32 h-32 rounded-full bg-primary/10"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-24 h-24 rounded-full bg-accent/20"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10"
      >
        <Card className="w-full max-w-md text-center relative overflow-hidden border-2 shadow-2xl">
          {/* Sparkles effect */}
          <AnimatePresence>
            {showSparkles && (
              <>
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Sparkles className="h-4 w-4 text-gray-500" />
                  </motion.div>
                ))}
              </>
            )}
          </AnimatePresence>

          <CardHeader className="pb-2">
            {/* Número 404 Animado */}
            <motion.div
              className="text-8xl font-bold text-primary/20 mb-2"
              animate={{
                textShadow: [
                  "0 0 20px rgba(var(--primary), 0.3)",
                  "0 0 40px rgba(var(--primary), 0.6)",
                  "0 0 20px rgba(var(--primary), 0.3)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              404
            </motion.div>

            {/* Fantasma Animado */}
            <motion.div
              className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-accent/10 relative"
              animate={{
                scale: [1, 1.1, 0.9, 1],
                rotate: [0, 5, -5, 0],
                y: [0, -5, 5, 0],
              }}
              transition={{
                duration: 6,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            >
              <Ghost className="h-10 w-10 text-primary" />

              {/* Olhos piscando */}
              <motion.div
                className="absolute top-6 left-6 w-1 h-1 bg-foreground rounded-full"
                animate={{
                  scaleY: [1, 0.1, 1],
                }}
                transition={{
                  duration: 0.2,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              />
              <motion.div
                className="absolute top-6 right-6 w-1 h-1 bg-foreground rounded-full"
                animate={{
                  scaleY: [1, 0.1, 1],
                }}
                transition={{
                  duration: 0.2,
                  repeat: Infinity,
                  repeatDelay: 3,
                  delay: 0.1,
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <CardTitle className="text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Ops! Você se perdeu
              </CardTitle>
              <CardDescription className="mt-2">
                Esta página decidiu fazer uma viagem interdimensional... ou
                talvez apenas não exista mesmo! 🌌
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Ícones flutuantes */}
            <motion.div
              className="flex justify-center gap-4 py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              {[Search, MapPin, Zap].map((Icon, index) => (
                <motion.div
                  key={index}
                  className="p-3 rounded-full bg-primary/10"
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.2,
                    ease: "easeInOut",
                  }}
                  whileHover={{ scale: 1.1 }}
                >
                  <Icon className="h-5 w-5 text-primary" />
                </motion.div>
              ))}
            </motion.div>

            <motion.p
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              Não se preocupe! Mesmo os melhores exploradores se perdem às
              vezes. Vamos te ajudar a encontrar o caminho de volta! 🧭
            </motion.p>

            {/* Botões animados */}
            <motion.div
              className="flex gap-3 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  asChild
                  variant="outline"
                  className="relative overflow-hidden"
                >
                  <Link to={-1}>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0"
                      animate={{
                        x: ["-100%", "100%"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    <span className="relative z-10">Voltar</span>
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild className="relative overflow-hidden">
                  <Link to="/dashboard">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                      animate={{
                        x: ["-100%", "100%"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                        delay: 0.5,
                      }}
                    />
                    <Home className="mr-2 h-4 w-4 relative z-10" />
                    <span className="relative z-10">Página Inicial</span>
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
