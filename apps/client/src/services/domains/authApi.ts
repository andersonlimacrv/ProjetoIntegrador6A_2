import { apiClient } from "../apiClient";
import type { ApiResponse } from "@packages/shared";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  companyName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  tenant?: {
    id: string;
    name: string;
    slug: string;
  };
  token?: string;
  sessionId?: string;
}

export const authApi = {
  register: async (data: RegisterData) => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/register",
      data
    );
    return response;
  },

  login: async (data: LoginData) => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      "/users/login",
      data
    );
    return response;
  },

  logout: async (sessionId: string) => {
    const response = await apiClient.post<ApiResponse<void>>("/users/logout", {
      sessionId,
    });
    return response;
  },

  validateToken: async (token: string) => {
    const response = await apiClient.post<ApiResponse<any>>(
      "/users/validate-token",
      { token }
    );
    return response;
  },
};
