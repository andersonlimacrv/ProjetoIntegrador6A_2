import { useState } from "react";
import UserList from "./components/UserList";
import { TaskList } from "./components/TaskList";
import { CreateTaskForm } from "./components/CreateTaskForm";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";

type TabType = "users" | "tasks";

function App() {
  const [activeTab, setActiveTab] = useState<TabType>("users");
  const [refreshTasks, setRefreshTasks] = useState(0);

  const handleTaskCreated = () => {
    setRefreshTasks((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Projeto Integrador 6A
          </h1>
          <p className="text-gray-600">
            Sistema de gerenciamento com React, Hono.js e Drizzle ORM
          </p>
        </header>

        {/* Navegação por abas */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm">
            <Button
              variant={activeTab === "users" ? "default" : "ghost"}
              onClick={() => setActiveTab("users")}
              className="flex-1"
            >
              Usuários
            </Button>
            <Button
              variant={activeTab === "tasks" ? "default" : "ghost"}
              onClick={() => setActiveTab("tasks")}
              className="flex-1"
            >
              Tasks
            </Button>
          </div>
        </div>

        {/* Conteúdo das abas */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Usuários</CardTitle>
              </CardHeader>
              <CardContent>
                <UserList />
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Formulário de criação */}
            <div className="lg:col-span-1">
              <CreateTaskForm onTaskCreated={handleTaskCreated} />
            </div>

            {/* Lista de tasks */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Gerenciamento de Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <TaskList key={refreshTasks} />
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
