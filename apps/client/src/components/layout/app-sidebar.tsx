import { NavMain } from "@/components/layout/nav-main"
import { NavSecondary } from "@/components/layout/nav-secondary"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader
} from "@/components/ui/sidebar"
import { navbarItems } from "@/lib/constants"
import { WorkspaceSwitcher } from "@/components/layout/workspace-switcher";


const data = {
  workspaces: [
    {
      name: "workspace name",
      logo_url: null,
      enterprise: "Enterprise name 1 kkkkkkkkkkkkkkkk",
    },
    {
      name: "Another Team",
      logo_url: null,
      enterprise: "Enterprise name 1 kkkkkkkkkkkkkkkkkkkkkkkkkkk",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <WorkspaceSwitcher workspaces={data.workspaces} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navbarItems.navMain} />
        <NavSecondary items={navbarItems.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>{/* nada ainda */}</SidebarFooter>
    </Sidebar>
  );
}
