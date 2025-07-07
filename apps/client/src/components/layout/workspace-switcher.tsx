import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function WorkspaceSwitcher({
  workspaces,
}: {
  workspaces: {
    name: string;
    logo_url: string | null;
    enterprise: string;
  }[];
}) {
  const { isMobile } = useSidebar();
  const activeWorkspace = workspaces[0];

  if (!activeWorkspace) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem className="py-1">
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer shadow-lg font-bold rounded-lg w-full py-2 flex items-center justify-between data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground px-2 bg-muted-foreground/5 hover:bg-muted-foreground/10 transition-colors duration-150">
            <div className="flex items-center gap-2">
              <Avatar>
                {activeWorkspace.logo_url ? (
                  <AvatarImage src={activeWorkspace.logo_url} />
                ) : null}
                <AvatarFallback>
                  {activeWorkspace.name.slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex text-lg 2xl:text-2xl flex-col text-left">
                <span className="truncate w-34">{activeWorkspace.name}</span>
                <span className="font-light text-xs text-gray-500/80 truncate w-34">
                  {activeWorkspace.enterprise}
                </span>
              </div>
            </div>
            <ChevronsUpDown className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-border">
              Change workspace
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {" "}
              <Plus /> New Workspace
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
