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
import { apiService } from "../services/api";
import { Plus, Edit, Trash2, User as UserIcon } from "lucide-react";

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

  // Carregar usuários
  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUsers();

      if (response.success && response.data) {
        setUsers(response.data);
      } else {
        setError(response.error || "Erro ao carregar usuários");
      }
    } catch (err) {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  // Criar usuário
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await apiService.createUser(formData);

      if (response.success && response.data) {
        setUsers([...users, response.data]);
        setFormData({ name: "", email: "" });
        setShowForm(false);
        setError(null);
      } else {
        setError(response.error || "Erro ao criar usuário");
      }
    } catch (err) {
      setError("Erro de conexão");
    }
  };

  // Atualizar usuário
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingUser) return;

    try {
      const response = await apiService.updateUser(editingUser.id, formData);

      if (response.success && response.data) {
        setUsers(
          users.map((user) =>
            user.id === editingUser.id ? response.data! : user
          )
        );
        setFormData({ name: "", email: "" });
        setEditingUser(null);
        setError(null);
      } else {
        setError(response.error || "Erro ao atualizar usuário");
      }
    } catch (err) {
      setError("Erro de conexão");
    }
  };

  // Deletar usuário
  const handleDeleteUser = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar este usuário?")) return;

    try {
      const response = await apiService.deleteUser(id);

      if (response.success) {
        setUsers(users.filter((user) => user.id !== id));
        setError(null);
      } else {
        setError(response.error || "Erro ao deletar usuário");
      }
    } catch (err) {
      setError("Erro de conexão");
    }
  };

  // Editar usuário
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
    });
    setShowForm(true);
  };

  // Cancelar edição
  const handleCancelEdit = () => {
    setEditingUser(null);
    setFormData({ name: "", email: "" });
    setShowForm(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Carregando usuários...</div>
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

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <UserIcon className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">{user.name}</CardTitle>
              </div>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Criado em: {formatDate(new Date(user.createdAt))}
                </p>
                <p className="text-sm text-muted-foreground">
                  Atualizado em: {formatDate(new Date(user.updatedAt))}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditUser(user)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Deletar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {users.length === 0 && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UserIcon className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Nenhum usuário encontrado
            </h3>
            <p className="text-muted-foreground text-center">
              Comece criando o primeiro usuário do sistema.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
