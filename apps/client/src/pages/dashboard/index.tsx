/* import { useAuth } from "@/contexts/auth-context"; */
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import DynamicBreadcrumb from "@/components/layout/DynamicBreadcrumb";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { UserButton } from "@/components/auth/UserButton";
import { Outlet } from "react-router-dom";

function DashboardPage() {
  /* const { user, logout } = useAuth(); */
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <div className="flex items-center gap-2 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <DynamicBreadcrumb />
          </div>
          <ThemeSwitcher />
          <UserButton />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex-1 rounded-xl">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default DashboardPage;
