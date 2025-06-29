import { useState, useEffect } from "react";
import { Task, formatDate } from "@packages/shared";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { api } from "../services/api";

// Função para converter dados da API para objetos Date
function convertApiTaskToTask(apiTask: any): Task {
  return {
    ...apiTask,
    createdAt: new Date(apiTask.createdAt),
    updatedAt: new Date(apiTask.updatedAt),
  };
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await api.getTasks();

      if (response.success && response.data) {
        // Converter strings de data para objetos Date
        const convertedTasks = response.data.map(convertApiTaskToTask);
        setTasks(convertedTasks);
        setError(null);
      } else {
        setError(response.error || "Erro ao carregar tasks");
      }
    } catch (err) {
      setError("Erro ao carregar tasks");
      console.error("Erro ao carregar tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskStatus = async (taskId: number, completed: boolean) => {
    try {
      if (completed) {
        await api.completeTask(taskId);
      } else {
        await api.incompleteTask(taskId);
      }
      await loadTasks(); // Recarregar lista
    } catch (err) {
      console.error("Erro ao alterar status da task:", err);
    }
  };

  const deleteTask = async (taskId: number) => {
    if (!confirm("Tem certeza que deseja excluir esta task?")) return;

    try {
      await api.deleteTask(taskId);
      await loadTasks(); // Recarregar lista
    } catch (err) {
      console.error("Erro ao deletar task:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">Carregando tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-500">Nenhuma task encontrada</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Lista de Tasks</h2>

      <div className="grid gap-4">
        {tasks.map((task) => (
          <Card key={task.id} className={task.completed ? "opacity-75" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle
                  className={`text-lg ${task.completed ? "line-through" : ""}`}
                >
                  {task.title}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={task.completed ? "default" : "secondary"}>
                    {task.completed ? "Concluída" : "Pendente"}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {task.description && (
                <p className="text-gray-600 mb-4">{task.description}</p>
              )}

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Criada em: {formatDate(task.createdAt)}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleTaskStatus(task.id, !task.completed)}
                  >
                    {task.completed ? "Marcar Pendente" : "Marcar Concluída"}
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteTask(task.id)}
                  >
                    Excluir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
