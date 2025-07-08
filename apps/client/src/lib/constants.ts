import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Rocket,
  Layers,
  BookText,
  LineChart,
  Settings2,
  LifeBuoy,
  Send,
  Map,
  PlusCircle,
  FileStack,
  GraduationCap,
  ListChecks,
  GanttChartSquare,
  CalendarCheck,
  Presentation,
  WalletCards,
  Sliders,
  CheckSquare,
  MessageSquare,
  BarChart3,
  Target,
  Activity,
} from "lucide-react";

export const navbarItems = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard/",
      icon: LayoutDashboard,
      isActive: false,
    },
    {
      title: "Projects",
      url: "/dashboard/projects",
      icon: FolderKanban,
      isActive: false,
      items: [
        {
          title: "All Projects",
          url: "/dashboard/projects/all",
          icon: Map,
        },
        {
          title: "Create Project",
          url: "/dashboard/projects/create",
          icon: PlusCircle,
        }
      ],
    },
    {
      title: "Teams",
      url: "/dashboard/teams",
      icon: Users,
      isActive: false,
      items: [
        {
          title: "Members",
          url: "/dashboard/teams/members",
          icon: Users,
        },
        {
          title: "Roles",
          url: "/dashboard/teams/roles",
          icon: FileStack,
        },
        {
          title: "Permissions",
          url: "/dashboard/teams/permissions",
          icon: WalletCards,
        },
      ],
    },
    {
      title: "Epics",
      url: "/dashboard/epics",
      icon: Layers,
      isActive: false,
      items: [
        {
          title: "Epic Board",
          url: "/dashboard/epics/board",
          icon: Presentation,
        },
        {
          title: "Epic Timeline",
          url: "/dashboard/epics/timeline",
          icon: ListChecks,
        },
      ],
    },
    {
      title: "UserStories",
      url: "/dashboard/user-stories",
      icon: BookText,
      isActive: false,
      items: [
        {
          title: "Backlog",
          url: "/dashboard/user-stories/backlog",
          icon: FileStack,
        },
        {
          title: "Kanban Board",
          url: "/dashboard/user-stories/kanban",
          icon: Target,
        },
        {
          title: "Templates",
          url: "/dashboard/user-stories/templates",
          icon: GraduationCap,
        },
      ],
    },
    {
      title: "Tasks",
      url: "/dashboard/tasks",
      icon: CheckSquare,
      isActive: false,
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: LineChart,
      isActive: false,
      items: [
        {
          title: "Dashboard",
          url: "/dashboard/analytics/dashboard",
          icon: BarChart3,
        },
        {
          title: "Reports",
          url: "/dashboard/analytics/reports",
          icon: LineChart,
        },
        {
          title: "Metrics",
          url: "/dashboard/analytics/metrics",
          icon: Sliders,
        },
      ],
    },
    {
      title: "Activity",
      url: "/dashboard/activity",
      icon: MessageSquare,
      isActive: false,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2,
      isActive: false,
      items: [
        {
          title: "General",
          url: "/dashboard/settings/general",
          icon: Settings2,
        },
        {
          title: "Team",
          url: "/dashboard/settings/team",
          icon: Users,
        },
        {
          title: "Billing",
          url: "/dashboard/settings/billing",
          icon: WalletCards,
        },
        {
          title: "Limits",
          url: "/dashboard/settings/limits",
          icon: Sliders,
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "/dashboard/support",
      icon: LifeBuoy,
      isActive: false,
    },
    {
      title: "Feedback",
      url: "/dashboard/feedback",
      icon: Send,
      isActive: false,
    },
  ],
};
