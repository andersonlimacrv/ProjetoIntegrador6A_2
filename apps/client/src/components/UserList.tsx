import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  User,
  CreateUserDTO,
  UpdateUserDTO,
  formatDate,
} from "@packages/shared";
import { api } from "../services/api";
import { Plus, Edit, Trash2, User as UserIcon } from "lucide-react";

// Função para converter dados da API para objetos Date
function convertApiUserToUser(apiUser: any): User {
  return {
    ...apiUser,
    createdAt: new Date(apiUser.createdAt),
    updatedAt: new Date(apiUser.updatedAt),
  };
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<CreateUserDTO>({
    name: "",
    email: "",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      setError(null);
      console.log("Carregando usuários...");

      const response = await api.getUsers();
      console.log("Resposta da API:", response);

      if (response.success && response.data) {
        // Converter strings de data para objetos Date
        const convertedUsers = response.data.map(convertApiUserToUser);
        setUsers(convertedUsers);
        console.log("Usuários definidos:", convertedUsers.length);
      } else {
        console.error("Erro na resposta da API:", response.error);
        setError(response.error || "Erro ao carregar usuários");
        setUsers([]);
      }
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
      setError("Erro ao carregar usuários");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await api.createUser(formData);
      if (response.success && response.data) {
        const newUser = convertApiUserToUser(response.data);
        setUsers((prevUsers) => [...prevUsers, newUser]);
        setFormData({ name: "", email: "" });
        setShowForm(false);
        setError(null);
      } else {
        setError(response.error || "Erro ao criar usuário");
      }
    } catch (err) {
      console.error("Erro ao criar usuário:", err);
      setError("Erro ao criar usuário");
    }
  }

  async function handleUpdateUser(e: React.FormEvent) {
    e.preventDefault();

    if (!editingUser) return;

    try {
      const response = await api.updateUser(editingUser.id, formData);
      if (response.success && response.data) {
        const updatedUser = convertApiUserToUser(response.data);
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === editingUser.id ? updatedUser : user
          )
        );
        setFormData({ name: "", email: "" });
        setEditingUser(null);
        setShowForm(false);
        setError(null);
      } else {
        setError(response.error || "Erro ao atualizar usuário");
      }
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      setError("Erro ao atualizar usuário");
    }
  }

  async function handleDeleteUser(id: number) {
    if (!confirm("Tem certeza que deseja deletar este usuário?")) return;

    try {
      const response = await api.deleteUser(id);
      if (response.success) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      } else {
        setError(response.error || "Erro ao deletar usuário");
      }
    } catch (err) {
      console.error("Erro ao deletar usuário:", err);
      setError("Erro ao deletar usuário");
    }
  }

  function handleEditUser(user: User) {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
    });
    setShowForm(true);
  }

  function handleCancelEdit() {
    setEditingUser(null);
    setFormData({ name: "", email: "" });
    setShowForm(false);
  }

  console.log("Estado atual - users:", users);
  console.log("Estado atual - loading:", loading);
  console.log("Estado atual - error:", error);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <p>Carregando usuários...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadUsers}>Tentar novamente</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie os usuários do sistema
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {editingUser ? "Editar Usuário" : "Novo Usuário"}
            </CardTitle>
            <CardDescription>
              {editingUser
                ? "Atualize as informações do usuário"
                : "Preencha as informações para criar um novo usuário"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser}>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Digite o nome"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Digite o email"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">
                    {editingUser ? "Atualizar" : "Criar"}
                  </Button>
                  {editingUser && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelEdit}
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {users.length === 0 ? (
        <div className="text-center py-8">
          <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum usuário encontrado
          </h3>
          <p className="text-gray-500 mb-4">
            Comece criando o primeiro usuário do sistema
          </p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Criar Primeiro Usuário
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{user.name}</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(user)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(user.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <span className="text-sm font-medium text-gray-500">Email:</span>
            <p className="text-sm">{user.email}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">
              Criado em:
            </span>
            <p className="text-sm">{formatDate(user.createdAt)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
