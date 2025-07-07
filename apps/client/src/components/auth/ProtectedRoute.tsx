import { useAuth } from "@/contexts/auth-context";
import { Navigate } from "react-router-dom";
import { SkeletonDashboard } from "@/components/common/LoadingPage";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <SkeletonDashboard />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
