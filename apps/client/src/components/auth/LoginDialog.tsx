import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icons } from "@/components/ui/icons";
import { useToast } from "@/contexts/toast-context";
import { authApi } from "@/services/domains/authApi";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Login state
  const [email, setEmail] = useState("joao.silva@exemplo.com");
  const [password, setPassword] = useState("123456");

  // Register state
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
  });

  const { login } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authApi.login({ email, password });
      
      if (response.ok && response.data.success) {
        // Armazenar dados de autenticação
        localStorage.setItem("token", response.data.data.token || "");
        localStorage.setItem("sessionId", response.data.data.sessionId || "");
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
        if (response.data.data.tenant) {
          localStorage.setItem("tenant", JSON.stringify(response.data.data.tenant));
        }
        
        // Atualizar contexto de autenticação
        login(response.data.data.user, response.data.data.tenant);
        
        addToast({
          type: "success",
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta!",
        });
        
        console.log("Login bem-sucedido, redirecionando para /dashboard");
        onOpenChange(false);
        navigate("/dashboard");
      } else {
        // Tratar erro de credenciais inválidas (401) como warning
        const isInvalidCredentials = response.status === 401;
        const message = response.data.message || response.data.error || "Erro ao fazer login";
        
        addToast({
          type: isInvalidCredentials ? "warning" : "error",
          title: isInvalidCredentials ? "Credenciais inválidas" : "Erro ao fazer login",
          description: message,
        });
      }
    } catch (error) {
      console.error("Erro de conexão:", error);
      addToast({
        type: "error",
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);

    try {
      const response = await authApi.register(registerData);
      
      if (response.ok && response.data.success) {
        // Armazenar dados de autenticação
        localStorage.setItem("token", response.data.data.token || "");
        localStorage.setItem("sessionId", response.data.data.sessionId || "");
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
        if (response.data.data.tenant) {
          localStorage.setItem("tenant", JSON.stringify(response.data.data.tenant));
        }
        
        // Atualizar contexto de autenticação
        login(response.data.data.user, response.data.data.tenant);
        
        addToast({
          type: "success",
          title: "Conta criada com sucesso!",
          description: "Bem-vindo ao sistema!",
        });
        
        onOpenChange(false);
        navigate("/dashboard");
      } else {
        addToast({
          type: "error",
          title: "Erro ao criar conta",
          description: response.data.message || response.data.error || "Verifique os dados informados",
        });
      }
    } catch (error) {
      console.error("Erro de conexão:", error);
      addToast({
        type: "error",
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const handleRegisterInputChange = (field: string, value: string) => {
    setRegisterData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-background/80 backdrop-blur-xl border-white/10">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Bem-vindo de volta
          </DialogTitle>
        </DialogHeader>
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.1 }}
        >
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/10 border">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Cadastro</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className=" bg-white/5 min-h-[420px]">
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-xl">
                      Entre na sua conta
                    </CardTitle>
                    <CardDescription>
                      Digite seu email e senha para acessar
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="bg-white/5 border-white/10 focus:border-purple-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Senha</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="bg-white/5 border-white/10 focus:border-purple-500"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          "Entrar"
                        )}
                      </Button>
                    </form>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-white/10" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground/20">
                          Ou continue com
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        className="border-white/10 bg-white/5 hover:bg-white/10"
                      >
                        <Icons.gitHub className="mr-2 h-4 w-4" />
                        GitHub
                      </Button>
                      <Button
                        variant="outline"
                        className="border-white/10 bg-white/5 hover:bg-white/10"
                      >
                        <Icons.google className="mr-2 h-4 w-4" />
                        Google
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="register">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="min-h-[520px] bg-white/5">
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-xl">Crie sua conta</CardTitle>
                    <CardDescription>
                      Comece grátis e organize sua equipe
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome completo</Label>
                        <Input
                          id="name"
                          placeholder="Seu nome"
                          value={registerData.name}
                          onChange={(e) =>
                            handleRegisterInputChange("name", e.target.value)
                          }
                          required
                          className="bg-white/5 border-white/10 focus:border-purple-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email-register">Email</Label>
                        <Input
                          id="email-register"
                          type="email"
                          placeholder="seu@email.com"
                          value={registerData.email}
                          onChange={(e) =>
                            handleRegisterInputChange("email", e.target.value)
                          }
                          required
                          className="bg-white/5 border-white/10 focus:border-purple-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company-name">Nome da empresa</Label>
                        <Input
                          id="company-name"
                          placeholder="Nome da sua empresa"
                          value={registerData.companyName}
                          onChange={(e) =>
                            handleRegisterInputChange(
                              "companyName",
                              e.target.value
                            )
                          }
                          required
                          className="bg-white/5 border-white/10 focus:border-purple-500"
                        />
                      </div>
                      <div className="space-y-2 pb-4">
                        <Label htmlFor="password-register">Senha</Label>
                        <Input
                          id="password-register"
                          type="password"
                          placeholder="••••••••"
                          value={registerData.password}
                          onChange={(e) =>
                            handleRegisterInputChange(
                              "password",
                              e.target.value
                            )
                          }
                          required
                          minLength={6}
                          className="bg-white/5 border-white/10 focus:border-purple-500"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        disabled={isRegistering}
                      >
                        {isRegistering ? (
                          <>
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            Criando conta...
                          </>
                        ) : (
                          "Criar conta grátis"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
