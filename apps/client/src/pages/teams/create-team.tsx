import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/contexts/toast-context";
import { useAuth } from "@/contexts/auth-context";
import { teamsApi } from "@/services/domains/teamsApi";

export default function CreateTeamPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { tenant } = useAuth();

  const [form, setForm] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      addToast({
        title: "Nome obrigatório",
        description: "Informe o nome da equipe.",
        type: "error",
      });
      return;
    }
    if (!tenant) {
      addToast({
        title: "Tenant não encontrado",
        description: "Não foi possível identificar o tenant do usuário.",
        type: "error",
      });
      return;
    }
    setLoading(true);
    try {
      const response = await teamsApi.create({
        name: form.name,
        description: form.description,
        tenantId: tenant.id,
      });
      if (response.ok && response.data.success) {
        addToast({
          title: "Equipe criada",
          description: "A equipe foi criada com sucesso.",
          type: "success",
        });
        navigate("/dashboard/teams");
      } else {
        addToast({
          title: "Erro ao criar equipe",
          description:
            response.data.message ||
            response.data.error ||
            "Ocorreu um erro ao criar a equipe.",
          type: "error",
        });
      }
    } catch (error) {
      addToast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Criar Nova Equipe</CardTitle>
          <CardDescription>
            Preencha os dados abaixo para criar uma nova equipe.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Nome da Equipe *
              </label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Digite o nome da equipe"
                required
                disabled={loading}
                autoFocus
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-1"
              >
                Descrição
              </label>
              <Textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Descreva a equipe (opcional)"
                disabled={loading}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                Criar Equipe
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
