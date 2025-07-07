import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, Shield, HelpCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useToast } from "@/contexts/toast-context";
import { useAuth } from "@/contexts/auth-context";
import { useNavigate } from "react-router-dom";

const userData = {
  name: "John Doe",
  avatarUrl: null,
  email: "9dH0w@example.com",
  role: "admin",
};

export function UserButton() {
  const { addToast } = useToast();
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "admin";
  const navigate = useNavigate();

  console.log(user);

  const handleUserMenuAction = (action: string) => {
    switch (action) {
      case "profile":
        addToast({
          type: "info",
          title: "Profile Settings",
          description: "Opening profile settings...",
        });
        break;
      case "settings":
        addToast({
          type: "info",
          title: "Settings",
          description: "Opening application settings...",
        });
        break;
      case "admin":
        navigate("/dashboard/admin");
        break;
      case "help":
        addToast({
          type: "info",
          title: "Help Center",
          description: "Opening help documentation...",
        });
        break;
      case "logout":
        logout();
        break;
      default:
        break;
    }
  };

  if (!user) {
    return null;
  }
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-2 p-1 hover:bg-accent/20 rounded-full transition-colors cursor-pointer">
            <Avatar className="shadow">
              <AvatarImage src={user.avatarUrl || ""} />
              <AvatarFallback>
                {user.name?.[0]?.toUpperCase() || ""}
              </AvatarFallback>
            </Avatar>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 bg-background/80 backdrop-blur-md border border-border/50"
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
              <p className="text-xs leading-none text-primary font-medium">
                {user.role}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => handleUserMenuAction("profile")}
            className="cursor-pointer"
          >
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleUserMenuAction("settings")}
            className="cursor-pointer"
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem
              onClick={() => handleUserMenuAction("admin")}
              className="cursor-pointer"
            >
              <Shield className="mr-2 h-4 w-4" />
              <span>Admin Panel</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => handleUserMenuAction("help")}
            className="cursor-pointer"
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Help & Support</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => handleUserMenuAction("logout")}
            className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <button>Logout</button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
