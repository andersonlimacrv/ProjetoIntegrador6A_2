import {
  User,
  CreateUserDTO,
  UpdateUserDTO,
  Task,
  CreateTaskDTO,
  UpdateTaskDTO,
  ApiResponse,
} from "@packages/shared";

// Configuração base da API
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Cliente HTTP base
class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // User endpoints
  async getUsers(): Promise<ApiResponse<User[]>> {
    return this.request<User[]>('/api/users');
  }

  async getUser(id: number): Promise<ApiResponse<User>> {
    return this.request<User>(`/api/users/${id}`);
  }

  async createUser(data: CreateUserDTO): Promise<ApiResponse<User>> {
    return this.request<User>('/api/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUser(id: number, data: UpdateUserDTO): Promise<ApiResponse<User>> {
    return this.request<User>(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/api/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Task endpoints
  async getTasks(): Promise<ApiResponse<Task[]>> {
    return this.request<Task[]>('/api/tasks');
  }

  async getTask(id: number): Promise<ApiResponse<Task>> {
    return this.request<Task>(`/api/tasks/${id}`);
  }

  async getTasksByUser(userId: number): Promise<ApiResponse<Task[]>> {
    return this.request<Task[]>(`/api/tasks/user/${userId}`);
  }

  async getCompletedTasks(): Promise<ApiResponse<Task[]>> {
    return this.request<Task[]>('/api/tasks/completed');
  }

  async getPendingTasks(): Promise<ApiResponse<Task[]>> {
    return this.request<Task[]>('/api/tasks/pending');
  }

  async createTask(data: CreateTaskDTO): Promise<ApiResponse<Task>> {
    return this.request<Task>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTask(id: number, data: UpdateTaskDTO): Promise<ApiResponse<Task>> {
    return this.request<Task>(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async completeTask(id: number): Promise<ApiResponse<Task>> {
    return this.request<Task>(`/api/tasks/${id}/complete`, {
      method: 'PATCH',
    });
  }

  async incompleteTask(id: number): Promise<ApiResponse<Task>> {
    return this.request<Task>(`/api/tasks/${id}/incomplete`, {
      method: 'PATCH',
    });
  }

  async deleteTask(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; database: string }>> {
    return this.request<{ status: string; database: string }>('/health');
  }
}

export const api = new ApiClient();
