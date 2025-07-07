import { ChevronRight, type LucideIcon } from "lucide-react";
import { useLocation } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { AuroraText } from "../ui/aurora-text";

interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
}

interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: NavSubItem[];
}

export function NavMain({ items }: { items: NavItem[] }) {
  const location = useLocation();

  const isItemActive = (itemUrl: string) => {
    const currentPath = location.pathname;

    if (currentPath === itemUrl) {
      return true;
    }

    if (itemUrl !== "/" && currentPath.startsWith(itemUrl + "/")) {
      return true;
    }

    return false;
  };

  const isSubItemActive = (subItemUrl: string) => {
    return location.pathname === subItemUrl;
  };

  const shouldBeOpen = (item: NavItem) => {
    if (isItemActive(item.url)) {
      return true;
    }

    if (item.isActive) {
      return true;
    }

    if (item.items) {
      return item.items.some((subItem) => isSubItemActive(subItem.url));
    }

    return false;
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <AuroraText>All Sync</AuroraText>
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={shouldBeOpen(item)}
          >
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={isItemActive(item.url)}
                className="data-[active=true]:bg-accent/60"
              >
                <a href={item.url}>
                  {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton >
              {item.items && item.items.length > 0 && (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isSubItemActive(subItem.url)}
                            className="data-[active=true]:bg-muted-foreground/10 my-1"
                          >
                            <a href={subItem.url}>
                              {subItem.icon && (
                                <div className="text-primary/30">
                                  <subItem.icon className="mr-2 h-4 w-4" />
                                </div>
                              )}
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
