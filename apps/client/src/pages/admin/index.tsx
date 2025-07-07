import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  User,
  Calendar,
  UserCheck,
  UserX,
  Crown,
  Settings,
} from "lucide-react";
import { useToast } from "@/contexts/toast-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { usersApi } from "@/services/domains/usersApi";
import type {
  User as ApiUser,
  CreateUserDTO,
  UpdateUserDTO,
} from "@packages/shared";

export function AdminPage() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ApiUser | null>(null);
  const [newUser, setNewUser] = useState<CreateUserDTO>({
    name: "",
    email: "",
    password: "12345678",
    avatarUrl: "",
  });

  const { addToast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const fetchRes = await usersApi.getAll();
      if (fetchRes.success && Array.isArray(fetchRes.data)) {
        setUsers(fetchRes.data);
      } else {
        setUsers([]);
        addToast({
          type: "error",
          title: "Erro",
          description: fetchRes.error || "Erro ao buscar usuários CLIENT",
        });
      }
    } catch (e: any) {
      setUsers([]);
      addToast({ type: "error", title: "Erro", description: e.message });
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "active" && user.isActive) ||
      (selectedStatus === "inactive" && !user.isActive) ||
      (selectedStatus === "pending" && user.isActive === undefined);
    return matchesSearch && matchesStatus;
  });

  const getRoleIcon = () => <User className="w-4 h-4 text-gray-500" />;

  const getRoleBadgeColor = () =>
    "bg-gray-500/20 text-gray-700 dark:text-gray-400";

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-700 dark:text-green-400";
      case "inactive":
        return "bg-red-500/20 text-red-700 dark:text-red-400";
      case "pending":
        return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400";
      default:
        return "bg-gray-500/20 text-gray-700 dark:text-gray-400";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "-";
    if (typeof date === "string") {
      if (date === "Never") return "Nunca";
      return new Date(date).toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
    return date.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email) {
      addToast({
        type: "error",
        title: "Erro de validação",
        description: "Preencha todos os campos obrigatórios",
      });
      return;
    }
    try {
      const createRes = await usersApi.create(newUser);
      if (createRes.success && createRes.data) {
        setUsers((prev) => [...prev, createRes.data as ApiUser]);
        setNewUser({
          name: "",
          email: "",
          password: "12345678",
          avatarUrl: "",
        });
        setIsCreateDialogOpen(false);
        addToast({
          type: "success",
          title: "Usuário criado",
          description: `${createRes.data.name} foi criado com sucesso`,
        });
      } else {
        addToast({
          type: "error",
          title: "Erro",
          description: createRes.error || "Erro ao criar usuário",
        });
      }
    } catch (e: any) {
      addToast({ type: "error", title: "Erro", description: e.message });
    }
  };

  const handleEditUser = (user: ApiUser) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    const updateData: UpdateUserDTO = {
      name: editingUser.name,
      email: editingUser.email,
      avatarUrl: editingUser.avatarUrl || "",
      isActive: editingUser.isActive,
    };
    try {
      const updateRes = await usersApi.update(
        Number(editingUser.id),
        updateData
      );
      if (updateRes.success && updateRes.data) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === editingUser.id && updateRes.data ? updateRes.data : u
          )
        );
        setIsEditDialogOpen(false);
        setEditingUser(null);
        addToast({
          type: "success",
          title: "Usuário atualizado",
          description: `${updateRes.data.name} foi atualizado com sucesso`,
        });
      } else {
        addToast({
          type: "error",
          title: "Erro",
          description: updateRes.error || "Erro ao atualizar usuário",
        });
      }
    } catch (e: any) {
      addToast({ type: "error", title: "Erro", description: e.message });
    }
  };

  const handleDeleteUser = async (user: ApiUser) => {
    try {
      const deleteRes = await usersApi.delete(user.id);
      if (deleteRes.success) {
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
        addToast({
          type: "warning",
          title: "Usuário deletado",
          description: `${user.name} foi removido do sistema`,
        });
      } else {
        addToast({
          type: "error",
          title: "Erro",
          description: deleteRes.error || "Erro ao deletar usuário",
        });
      }
    } catch (e: any) {
      addToast({ type: "error", title: "Erro", description: e.message });
    }
  };

  const handleToggleStatus = async (user: ApiUser) => {
    const updateData: UpdateUserDTO = { isActive: !user.isActive };
    try {
      const toggleRes = await usersApi.update(Number(user.id), updateData);
      if (toggleRes.success && toggleRes.data) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id && toggleRes.data ? toggleRes.data : u
          )
        );
        addToast({
          type: "info",
          title: "Status atualizado",
          description: `${user.name} agora está ${
            toggleRes.data.isActive ? "ativo" : "inativo"
          }`,
        });
      } else {
        addToast({
          type: "error",
          title: "Erro",
          description: toggleRes.error || "Erro ao atualizar status",
        });
      }
    } catch (e: any) {
      addToast({ type: "error", title: "Erro", description: e.message });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage users, roles, and system permissions
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            Add User
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Add a new user to the system. They will receive an invitation
                email.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Enter full name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="Enter email address"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateUser}>Create User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: "Total Users",
            value: users.length,
            icon: User,
            color: "text-blue-500",
          },
          {
            title: "Active Users",
            value: users.filter((u) => u.isActive).length,
            icon: UserCheck,
            color: "text-green-500",
          },
          {
            title: "Pending Users",
            value: users.filter((u) => u.isActive === undefined).length,
            icon: Calendar,
            color: "text-yellow-500",
          },
          {
            title: "Inactive Users",
            value: users.filter((u) => !u.isActive).length,
            icon: UserX,
            color: "text-red-500",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-card/50 backdrop-blur-sm border border-border/50 rounded p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="flex items-center gap-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded p-4"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="bg-card/50 backdrop-blur-sm border border-border/50 rounded overflow-hidden"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        getInitials(user.name)
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${getStatusBadgeColor(
                      user.isActive ? "active" : "inactive"
                    )} border-0`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {formatDate(
                    user.lastLogin ? user.lastLogin.toString() : undefined
                  )}
                </TableCell>
                <TableCell>
                  {formatDate(
                    user.createdAt ? user.createdAt.toString() : undefined
                  )}
                </TableCell>
                <TableCell className="text-right pr-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <span className="flex items-center gap-2 px-4 py-2 bg-muted-foreground/5 hover:cursor-pointer  rounded-md hover:bg-primary/90">
                        <MoreHorizontal className="h-4 w-4" />
                      </span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Edit</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEditUser(user)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleToggleStatus(user)}
                      >
                        {user.isActive ? (
                          <>
                            <UserX className="mr-2 h-4 w-4" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <UserCheck className="mr-2 h-4 w-4" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <AlertDialog>
                        <AlertDialogTrigger>
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onSelect={(e) => e.preventDefault()}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-destructive">
                              This action cannot be undone. This will
                              permanently delete {user.name}'s account and
                              remove all associated data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteUser(user)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions.
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={editingUser.name}
                  onChange={(e) =>
                    setEditingUser((prev) =>
                      prev ? { ...prev, name: e.target.value } : null
                    )
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser((prev) =>
                      prev ? { ...prev, email: e.target.value } : null
                    )
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateUser}>Update User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
