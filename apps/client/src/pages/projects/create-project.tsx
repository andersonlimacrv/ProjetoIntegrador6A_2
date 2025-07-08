import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { projectsApi } from "@/services/domains/projectsApi";
import { useToast } from "@/contexts/toast-context";
import { useAuth } from "@/contexts/auth-context";
import type { CreateProjectDTO } from "@packages/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";

export function CreateProjectPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user: currentUser, tenant: currentTenant } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<
    Omit<CreateProjectDTO, "tenantId" | "ownerId">
  >({
    name: "",
    slug: "",
    description: "",
    projectKey: "",
  });

  // Função para validar o formulário
  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Validar nome
    if (!formData.name.trim()) {
      errors.push("Nome do projeto é obrigatório");
    } else if (formData.name.trim().length < 3) {
      errors.push("Nome do projeto deve ter pelo menos 3 caracteres");
    } else if (formData.name.trim().length > 255) {
      errors.push("Nome do projeto deve ter no máximo 255 caracteres");
    }

    // Validar project key
    if (!formData.projectKey.trim()) {
      errors.push("Chave do projeto é obrigatória");
    } else if (!/^[A-Z0-9]+$/.test(formData.projectKey)) {
      errors.push(
        "Chave do projeto deve conter apenas letras maiúsculas e números"
      );
    } else if (formData.projectKey.length < 2) {
      errors.push("Chave do projeto deve ter pelo menos 2 caracteres");
    } else if (formData.projectKey.length > 10) {
      errors.push("Chave do projeto deve ter no máximo 10 caracteres");
    }

    // Validar slug
    if (!formData.slug.trim()) {
      errors.push("Slug é obrigatório");
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      errors.push(
        "Slug deve conter apenas letras minúsculas, números e hífens"
      );
    } else if (formData.slug.length < 3) {
      errors.push("Slug deve ter pelo menos 3 caracteres");
    } else if (formData.slug.length > 100) {
      errors.push("Slug deve ter no máximo 100 caracteres");
    } else if (formData.slug.startsWith("-") || formData.slug.endsWith("-")) {
      errors.push("Slug não pode começar ou terminar com hífen");
    } else if (formData.slug.includes("--")) {
      errors.push("Slug não pode conter hífens consecutivos");
    }

    // Validar descrição (opcional, mas se preenchida deve ter limites)
    if (formData.description && formData.description.length > 1000) {
      errors.push("Descrição deve ter no máximo 1000 caracteres");
    }

    return { isValid: errors.length === 0, errors };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser || !currentTenant) {
      addToast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para criar um projeto.",
        type: "error",
      });
      return;
    }

    // Validar formulário
    const validation = validateForm();
    if (!validation.isValid) {
      addToast({
        title: "Dados inválidos",
        description: validation.errors.join(". "),
        type: "error",
      });
      return;
    }

    setLoading(true);

    try {
      const projectData: CreateProjectDTO = {
        ...formData,
        tenantId: currentTenant.id,
        ownerId: currentUser.id,
      };

      // Log do payload sendo enviado
      console.log("🚀 Enviando payload para criar projeto:", {
        ...projectData,
        // Não logar dados sensíveis
        tenantId: `${projectData.tenantId} (${currentTenant.name})`,
        ownerId: `${projectData.ownerId} (${currentUser.name})`,
      });

      const res = await projectsApi.create(projectData);

      // Log da resposta do servidor
      console.log("📡 Resposta do servidor:", {
        status: res.status,
        ok: res.ok,
        data: res.data,
      });

      if (res.ok && res.data.success) {
        addToast({
          title: "Projeto criado",
          description: "O projeto foi criado com sucesso!",
          type: "success",
        });
        navigate("/dashboard/projects");
      } else {
        console.error("❌ Erro na resposta do servidor:", res);
        addToast({
          title: "Erro ao criar projeto",
          description:
            res.data.message ||
            res.data.error ||
            `Erro ${res.status}: Erro desconhecido`,
          type: "error",
        });
      }
    } catch (error) {
      console.error("💥 Erro de conexão ao criar projeto:", error);
      addToast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Função para gerar slug automaticamente a partir do nome
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove acentos
      .replace(/[^a-z0-9\s-]/g, "") // Remove caracteres especiais
      .replace(/\s+/g, "-") // Substitui espaços por hífens
      .replace(/-+/g, "-") // Remove hífens consecutivos
      .replace(/^-+|-+$/g, ""); // Remove hífens no início e fim
  };

  // Função para gerar project key automaticamente a partir do nome
  const generateProjectKey = (name: string) => {
    return name
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove acentos
      .replace(/[^A-Z0-9\s]/g, "") // Remove caracteres especiais
      .split(" ")
      .map((word) => word.slice(0, 3)) // Pega as 3 primeiras letras de cada palavra
      .join("")
      .slice(0, 10); // Máximo 10 caracteres
  };

  if (!currentUser || !currentTenant) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Criar Projeto</h1>
          <p className="text-muted-foreground">
            Você precisa estar logado para criar um projeto.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Criar Projeto</h1>
        <p className="text-muted-foreground">
          Crie um novo projeto para sua equipe.
        </p>
        <div className="mt-2 text-sm text-muted-foreground">
          <p>
            <strong>Tenant:</strong> {currentTenant.name}
          </p>
          <p>
            <strong>Proprietário:</strong> {currentUser.name}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            Novo Projeto
          </CardTitle>
          <CardDescription>
            Preencha as informações para criar um novo projeto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Projeto *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    handleInputChange("name", name);

                    // Gerar slug e project key automaticamente se estiverem vazios
                    if (!formData.slug) {
                      handleInputChange("slug", generateSlug(name));
                    }
                    if (!formData.projectKey) {
                      handleInputChange("projectKey", generateProjectKey(name));
                    }
                  }}
                  placeholder="Ex: Sistema de Gestão"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Digite o nome completo do projeto. O slug e a chave serão
                  gerados automaticamente.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectKey">Chave do Projeto *</Label>
                <Input
                  id="projectKey"
                  value={formData.projectKey}
                  onChange={(e) =>
                    handleInputChange(
                      "projectKey",
                      e.target.value.toUpperCase()
                    )
                  }
                  placeholder="Ex: SG"
                  maxLength={10}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Apenas letras maiúsculas e números. Ex: SG, API, WEB123
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  handleInputChange(
                    "slug",
                    e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-")
                  )
                }
                placeholder="Ex: sistema-gestao"
                required
              />
              <p className="text-xs text-muted-foreground">
                URL amigável do projeto. Apenas letras minúsculas, números e
                hífens.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Descreva o objetivo e escopo do projeto"
                rows={3}
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground">
                {(formData.description || "").length}/1000 caracteres
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Criando..." : "Criar Projeto"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard/projects")}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
