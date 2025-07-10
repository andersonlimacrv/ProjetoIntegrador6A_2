import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role?: string; 
}

interface Tenant {
  id: string;
  name: string;
  slug: string;
}

interface AuthContextType {
  user: User | null;
  tenant: Tenant | null;
  isAuthenticated: boolean;
  login: (userData: User, tenantData?: Tenant) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Carregar dados de autenticação do localStorage
    const savedUser = localStorage.getItem("user");
    const savedTenant = localStorage.getItem("tenant");
    const token = localStorage.getItem("token");

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
      if (savedTenant) {
        setTenant(JSON.parse(savedTenant));
      }
    }

    setIsLoading(false);
  }, []);

  const logout = () => {
    setUser(null);
    setTenant(null);
    localStorage.removeItem("user");
    localStorage.removeItem("tenant");
    localStorage.removeItem("token");
    localStorage.removeItem("sessionId");
  };

  const login = (userData: User, tenantData?: Tenant) => {
    setUser(userData);
    if (tenantData) {
      setTenant(tenantData);
    }
  };

  const isAuthenticated = !!user && !!localStorage.getItem("token");

  console.log(
    "AuthContext - user:",
    user,
    "token:",
    localStorage.getItem("token"),
    "isAuthenticated:",
    isAuthenticated
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        tenant,
        isAuthenticated,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
