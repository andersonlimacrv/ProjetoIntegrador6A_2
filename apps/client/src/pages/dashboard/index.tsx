import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";

function DashboardPage() {
  const { user, logout } = useAuth();
  return (
    <div className="flex flex-col items-center space-y-4 justify-center min-h-screen">
      <div className="text-2xl font-bold">{user?.name}</div>
      <div>
        <Button onClick={logout}>Logout</Button>
      </div>
    </div>
  );
}

export default DashboardPage;
