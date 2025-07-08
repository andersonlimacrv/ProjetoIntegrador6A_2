import { useAuth } from "@/contexts/auth-context";
import { Navigate } from "react-router-dom";
import { SkeletonDashboard } from "@/components/common/LoadingPage";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  console.log(
    "ProtectedRoute - isAuthenticated:",
    isAuthenticated,
    "isLoading:",
    isLoading
  );

  if (isLoading) {
    return <SkeletonDashboard />;
  }

  if (!isAuthenticated) {
    console.log(
      "ProtectedRoute - Usuário não autenticado, redirecionando para /"
    );
    return <Navigate to="/" replace />;
  }

  console.log("ProtectedRoute - Usuário autenticado, renderizando children");
  return <>{children}</>;
}
