import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Zap, Github, Twitter, Linkedin, Mail } from "lucide-react";

const footerLinks = {
  product: {
    title: "Produto",
    links: [
      { name: "Recursos", href: "#features" },
      { name: "Preços", href: "#pricing" },
      { name: "Integrações", href: "#integrations" },
      { name: "API", href: "#api" },
    ],
  },
  company: {
    title: "Empresa",
    links: [
      { name: "Sobre", href: "#about" },
      { name: "Blog", href: "#blog" },
      { name: "Carreiras", href: "#careers" },
      { name: "Contato", href: "#contact" },
    ],
  },
  resources: {
    title: "Recursos",
    links: [
      { name: "Documentação", href: "#docs" },
      { name: "Suporte", href: "#support" },
      { name: "Status", href: "#status" },
      { name: "Changelog", href: "#changelog" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { name: "Privacidade", href: "#privacy" },
      { name: "Termos", href: "#terms" },
      { name: "Cookies", href: "#cookies" },
      { name: "LGPD", href: "#lgpd" },
    ],
  },
};

export function Footer() {
  const controls = useAnimation();
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.getElementById("footer");
      const rect = footer?.getBoundingClientRect();
      if (rect && rect.top < window.innerHeight) {
        setInView(true);
      } else {
        setInView(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    controls.start({
      borderTopLeftRadius: inView ? "0%" : "100%",
      borderTopRightRadius: inView ? "0%" : "100%",
      transition: { duration: 1, ease: "easeIn" },
    });
  }, [inView, controls]);

  return (
    <motion.footer
      id="footer"
      animate={controls}
      initial={{ borderTopLeftRadius: "100%", borderTopRightRadius: "100%" }}
      className="relative overflow-hidden py-32 px-4 sm:px-2 lg:px-4 border-t border-white/10 bg-gradient-to-r from-purple-600/10 to-pink-600/10"
    >
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative container mx-auto max-w-7xl z-10 grid grid-cols-1 lg:grid-cols-4 gap-12 mt-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="col-span-1 flex flex-col items-start"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AllSync
            </span>
          </div>
          <p className="text-gray-300 mb-8">
            Plataforma completa para gestão ágil de projetos. Transforme sua
            equipe em uma máquina de produtividade.
          </p>
        </motion.div>

        <div className="col-span-3 grid grid-cols-2 md:grid-cols-4 gap-8">
          {Object.entries(footerLinks).map(([key, section], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        <div className="flex col-span-full">
          <div className="flex space-x-6 py-1 w-full justify-center">
            {[Github, Twitter, Linkedin, Mail].map((Icon, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.25 }}
                transition={{ type: "spring", stiffness: 260 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-white/80 cursor-pointer rounded-full"
                >
                  <Icon className="h-10 w-10 text-white" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="col-span-full flex flex-col md:flex-row justify-between items-center pt-12 border-t border-gray-600/90"
        >
          <p className="text-gray-400 text-sm">
            © 2024 AllSync. Todos os direitos reservados.
          </p>
          <span className="text-sm text-gray-400 mt-4 md:mt-0">
            🇧🇷 ❤️
          </span>
        </motion.div>
      </motion.div>
    </motion.footer>
  );
}
