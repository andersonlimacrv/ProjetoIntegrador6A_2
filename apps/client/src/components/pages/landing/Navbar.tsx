import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LoginDialog } from "@/components/auth/LoginDialog";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

// Smooth scroll function
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    scrollToSection(sectionId);
    setIsMenuOpen(false); // Close mobile menu if open
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 pt-6"
      >
        {/* Desktop Navigation - Dock Style */}
        <div className="hidden lg:block">
          <div className="flex justify-center w-full px-4">
            <div className="bg-black/50 backdrop-blur-2xl border border-white/10 rounded-2xl px-6 py-3 shadow-2xl max-w-fit">
              <div className="flex items-center space-x-6 xl:space-x-8">
                {/* Logo */}
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    AllSync
                  </span>
                </div>

                {/* Navigation Menu */}
                <NavigationMenu>
                  <NavigationMenuList className="space-x-1">
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="bg-transparent hover:bg-white/10 text-gray-300 hover:text-white data-[state=open]:bg-white/10 data-[state=open]:text-white">
                        Produto
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid gap-3 p-6 w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] bg-background/95 backdrop-blur-xl border-white/10">
                          <div className="row-span-3">
                            <NavigationMenuLink asChild>
                              <button
                                onClick={() => handleNavClick("features")}
                                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-purple-600/20 to-pink-600/20 p-6 no-underline outline-none focus:shadow-md text-left"
                              >
                                <Zap className="h-6 w-6 text-purple-400" />
                                <div className="mb-2 mt-4 text-lg font-medium text-white">
                                  AllSync
                                </div>
                                <p className="text-sm leading-tight text-gray-300">
                                  Plataforma completa para gestão ágil de
                                  projetos e equipes
                                </p>
                              </button>
                            </NavigationMenuLink>
                          </div>
                          <ListItem
                            onClick={() => handleNavClick("features")}
                            title="Recursos"
                          >
                            Quadros Kanban, sprints e métricas avançadas
                          </ListItem>
                          <ListItem
                            onClick={() => handleNavClick("dashboard")}
                            title="Dashboard"
                          >
                            Visualize tudo em um só lugar
                          </ListItem>
                          <ListItem
                            onClick={() => handleNavClick("integrations")}
                            title="Integrações"
                          >
                            Conecte com suas ferramentas favoritas
                          </ListItem>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="bg-transparent hover:bg-white/10 text-gray-300 hover:text-white data-[state=open]:bg-white/10 data-[state=open]:text-white">
                        Soluções
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-background/95 backdrop-blur-xl border-white/10">
                          <ListItem
                            title="Para Desenvolvedores"
                            onClick={() => handleNavClick("developers")}
                          >
                            Ferramentas ágeis para equipes de desenvolvimento
                          </ListItem>
                          <ListItem
                            title="Para Product Managers"
                            onClick={() => handleNavClick("pm")}
                          >
                            Gerencie roadmaps e prioridades
                          </ListItem>
                          <ListItem
                            title="Para Equipes"
                            onClick={() => handleNavClick("teams")}
                          >
                            Colaboração e comunicação eficiente
                          </ListItem>
                          <ListItem
                            title="Para Empresas"
                            onClick={() => handleNavClick("enterprise")}
                          >
                            Soluções escaláveis para grandes organizações
                          </ListItem>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <button
                          onClick={() => handleNavClick("pricing")}
                          className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors focus:bg-white/10 focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                        >
                          Preços
                        </button>
                      </NavigationMenuLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <button
                          onClick={() => handleNavClick("docs")}
                          className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors focus:bg-white/10 focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                        >
                          Documentação
                        </button>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3 flex-shrink-0">
                  <Button
                    variant="ghost"
                    onClick={() => setIsLoginOpen(true)}
                    className="text-gray-300 hover:text-white hover:bg-white/10"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => setIsLoginOpen(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    Começar grátis
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden px-4">
          <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  AllSync
                </span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white hover:bg-white/10"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-white px-3">
                    Produto
                  </h3>
                  <button
                    onClick={() => handleNavClick("features")}
                    className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    Recursos
                  </button>
                  <button
                    onClick={() => handleNavClick("dashboard")}
                    className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => handleNavClick("integrations")}
                    className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    Integrações
                  </button>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-white px-3">
                    Soluções
                  </h3>
                  <button
                    onClick={() => handleNavClick("developers")}
                    className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    Para Desenvolvedores
                  </button>
                  <button
                    onClick={() => handleNavClick("pm")}
                    className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    Para Product Managers
                  </button>
                  <button
                    onClick={() => handleNavClick("teams")}
                    className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    Para Equipes
                  </button>
                </div>

                <div className="border-t border-white/10 pt-4 space-y-2">
                  <button
                    onClick={() => handleNavClick("pricing")}
                    className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    Preços
                  </button>
                  <button
                    onClick={() => handleNavClick("docs")}
                    className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    Documentação
                  </button>
                </div>

                <div className="border-t border-white/10 pt-4 space-y-3">
                  <Button
                    variant="ghost"
                    onClick={() => setIsLoginOpen(true)}
                    className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => setIsLoginOpen(true)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Começar grátis
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>

      <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </>
  );
}

const ListItem = ({
  className,
  title,
  children,
  onClick,
  ...props
}: {
  className?: string;
  title: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
  
      <NavigationMenuLink asChild>
        <button
          onClick={onClick}
          className={cn(
            "block w-full text-left select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none text-white">
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-gray-400">
            {children}
          </p>
        </button>
      </NavigationMenuLink>
    
  );
};
