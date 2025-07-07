// Wrapper base para requisições HTTP

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const API_PREFIX = "/api";

export class ApiClient {
  baseUrl: string;
  apiPrefix: string;
  defaultHeaders: Record<string, string>;
  // Exemplo de token (não utilizado por padrão)
  authToken?: string;

  constructor(baseUrl: string = API_BASE_URL, apiPrefix: string = API_PREFIX) {
    this.baseUrl = baseUrl;
    this.apiPrefix = apiPrefix;
    this.defaultHeaders = { "Content-Type": "application/json" };
  }

  // Exemplo: método para setar token de autenticação (opcional)
  setAuthToken(token: string) {
    this.authToken = token;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${this.apiPrefix}${endpoint}`;
    const headers = {
      ...this.defaultHeaders,
      ...(options.headers || {}),
      // Exemplo: incluir Authorization se authToken estiver setado
      ...(this.authToken ? { Authorization: `Bearer ${this.authToken}` } : {}),
    };
    const response = await fetch(url, {
      headers,
      ...options,
    });
    if (!response.ok) {
      let errorMsg = `HTTP error! status: ${response.status}`;
      try {
        const err = await response.json();
        errorMsg = err.message || err.error || errorMsg;
      } catch {}
      throw new Error(errorMsg);
    }
    return response.json();
  }

  get<T>(endpoint: string, options: RequestInit = {}) {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }
  post<T>(endpoint: string, body?: any, options: RequestInit = {}) {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : null,
    });
  }
  put<T>(endpoint: string, body?: any, options: RequestInit = {}) {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : null,
    });
  }
  patch<T>(endpoint: string, body?: any, options: RequestInit = {}) {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : null,
    });
  }
  delete<T>(endpoint: string, options: RequestInit = {}) {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

// Instância global do ApiClient
export const apiClient = new ApiClient();
