import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sprintsApi } from "@/services/domains/sprintsApi";
import { useToast } from "@/contexts/toast-context";
import type { CreateSprintDTO } from "@packages/shared";

interface SprintFormProps {
  projectId: string;
  onSuccess?: () => void;
}

export function SprintForm({ projectId, onSuccess }: SprintFormProps) {
  const { addToast } = useToast();
  const [form, setForm] = useState<CreateSprintDTO>({
    projectId,
    name: "",
    startDate: "",
    endDate: "",
    goal: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await sprintsApi.create(form);
    if (res.ok && res.data.success) {
      addToast({ title: "Sprint criado com sucesso", type: "success" });
      if (onSuccess) onSuccess();
    } else {
      addToast({
        title: "Erro ao criar sprint",
        type: "error",
        description: res.data?.message,
      });
    }
    setLoading(false);
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="name">Nome do Sprint</Label>
        <Input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <Label htmlFor="startDate">Início</Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            value={form.startDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="endDate">Fim</Label>
          <Input
            id="endDate"
            name="endDate"
            type="date"
            value={form.endDate}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="goal">Meta do Sprint</Label>
        <Input
          id="goal"
          name="goal"
          value={form.goal}
          onChange={handleChange}
        />
      </div>
      <Button type="submit" disabled={loading} className="mt-2">
        {loading ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  );
}
