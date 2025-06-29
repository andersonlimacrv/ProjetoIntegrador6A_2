import { useState } from "react";
import { CreateTaskDTO } from "@packages/shared";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { api } from "../services/api";

interface CreateTaskFormProps {
  onTaskCreated?: () => void;
}

export function CreateTaskForm({ onTaskCreated }: CreateTaskFormProps) {
  const [formData, setFormData] = useState<CreateTaskDTO>({
    title: "",
    description: "",
    userId: 1, // Por enquanto fixo, depois pode ser selecionado
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Título é obrigatório");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await api.createTask(formData);

      // Limpar formulário
      setFormData({
        title: "",
        description: "",
        userId: 1,
      });

      // Notificar componente pai
      onTaskCreated?.();
    } catch (err) {
      setError("Erro ao criar task");
      console.error("Erro ao criar task:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof CreateTaskDTO,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpar erro quando usuário começar a digitar
    if (error) {
      setError(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nova Task</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              type="text"
              placeholder="Digite o título da task"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Digite a descrição da task (opcional)"
              value={formData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="userId">Usuário</Label>
            <Input
              id="userId"
              type="number"
              placeholder="ID do usuário"
              value={formData.userId}
              onChange={(e) =>
                handleInputChange("userId", parseInt(e.target.value) || 1)
              }
              min="1"
            />
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Criando..." : "Criar Task"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
