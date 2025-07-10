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
      isActive: true,
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
        },
      ],
    },
    {
      title: "Teams",
      url: "/dashboard/teams",
      icon: Users,
      isActive: true,
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
    /*  {
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
    }, */
    /*     {
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
    }, */
    {
      title: "Tasks",
      url: "/dashboard/tasks",
      icon: CheckSquare,
      isActive: true,
      items: [
        {
          title: "Create Task",
          url: "/dashboard/tasks/create",
          icon: PlusCircle,
        },
      ],
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: LineChart,
      isActive: false,
      /* items: [
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
      ], */
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
     /*  items: [
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
      ], */
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

export const PRIORITY_LABELS: Record<number, string> = {
  1: "Baixa",
  2: "Média",
  3: "Alta",
  4: "Crítica",
  5: "Urgente",
};

export const PRIORITY_COLORS: Record<number, string> = {
  1: "bg-green-100 text-green-800 border-green-200",
  2: "bg-yellow-100 text-yellow-800 border-yellow-200",
  3: "bg-orange-100 text-orange-800 border-orange-200",
  4: "bg-red-100 text-red-800 border-red-200",
  5: "bg-purple-100 text-purple-800 border-purple-200",
};

// Cores para os times (20 cores) - Ordem embaralhada para melhor distribuição
export const TEAM_COLORS = [
  "border-blue-500",
  "border-emerald-500",
  "border-purple-500",
  "border-orange-500",
  "border-pink-500",
  "border-indigo-500",
  "border-red-500",
  "border-amber-500",
  "border-teal-500",
  "border-violet-500",
  "border-rose-500",
  "border-lime-500",
  "border-cyan-500",
  "border-fuchsia-500",
  "border-sky-500",
  "border-green-500",
  "border-yellow-500",
  "border-slate-500",
  "border-zinc-500",
  "border-stone-500",
];

// Mapeamento de cores dos times para valores hexadecimais
export const TEAM_COLORS_HEX: Record<string, string> = {
  "border-blue-500": "#3b82f6",
  "border-emerald-500": "#10b981",
  "border-purple-500": "#8b5cf6",
  "border-orange-500": "#f97316",
  "border-pink-500": "#ec4899",
  "border-indigo-500": "#6366f1",
  "border-red-500": "#ef4444",
  "border-amber-500": "#f59e0b",
  "border-teal-500": "#14b8a6",
  "border-violet-500": "#7c3aed",
  "border-rose-500": "#f43f5e",
  "border-lime-500": "#84cc16",
  "border-cyan-500": "#06b6d4",
  "border-fuchsia-500": "#d946ef",
  "border-sky-500": "#0ea5e9",
  "border-green-500": "#22c55e",
  "border-yellow-500": "#eab308",
  "border-slate-500": "#64748b",
  "border-zinc-500": "#71717a",
  "border-stone-500": "#78716c",
};
