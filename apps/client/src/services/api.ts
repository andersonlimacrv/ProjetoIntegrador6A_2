import {
  User,
  CreateUserDTO,
  UpdateUserDTO,
  ApiResponse,
} from "@packages/shared";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro na requisição:", error);
      return {
        success: false,
        error: "Erro de conexão com o servidor",
      };
    }
  }

  // Usuários
  async getUsers(): Promise<ApiResponse<User[]>> {
    return this.request<User[]>("/api/users");
  }

  async getUserById(id: number): Promise<ApiResponse<User>> {
    return this.request<User>(`/api/users/${id}`);
  }

  async createUser(userData: CreateUserDTO): Promise<ApiResponse<User>> {
    return this.request<User>("/api/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async updateUser(
    id: number,
    userData: UpdateUserDTO
  ): Promise<ApiResponse<User>> {
    return this.request<User>(`/api/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: number): Promise<ApiResponse<null>> {
    return this.request<null>(`/api/users/${id}`, {
      method: "DELETE",
    });
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<any>> {
    return this.request("/health");
  }
}

export const apiService = new ApiService();
