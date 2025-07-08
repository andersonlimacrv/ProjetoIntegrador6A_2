import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Play,
  Pause,
  Archive,
  Star,
  Zap,
  Shield,
  LucideIcon,
} from "lucide-react";

export type StatusType =
  | "active"
  | "inactive"
  | "pending"
  | "error"
  | "running"
  | "paused"
  | "archived"
  | "featured"
  | "urgent"
  | "secure"
  | "completed"
  | "cancelled"
  | "draft"
  | "published"
  | "custom";

interface StatusBadgeProps {
  status: StatusType | string;
  label?: string;
  icon?: LucideIcon;
  variant?: "default" | "secondary" | "destructive" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const statusConfig = {
  active: {
    label: "Ativo",
    icon: CheckCircle,
    className:
      "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
  },
  inactive: {
    label: "Inativo",
    icon: XCircle,
    className: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200",
  },
  pending: {
    label: "Pendente",
    icon: Clock,
    className:
      "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200",
  },
  error: {
    label: "Erro",
    icon: AlertCircle,
    className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
  },
  running: {
    label: "Executando",
    icon: Play,
    className: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
  },
  paused: {
    label: "Pausado",
    icon: Pause,
    className:
      "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200",
  },
  archived: {
    label: "Arquivado",
    icon: Archive,
    className:
      "bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200",
  },
  featured: {
    label: "Destaque",
    icon: Star,
    className:
      "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200",
  },
  urgent: {
    label: "Urgente",
    icon: Zap,
    className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
  },
  secure: {
    label: "Seguro",
    icon: Shield,
    className:
      "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200",
  },
  completed: {
    label: "Concluído",
    icon: CheckCircle,
    className:
      "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
  },
  cancelled: {
    label: "Cancelado",
    icon: XCircle,
    className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
  },
  draft: {
    label: "Rascunho",
    icon: Clock,
    className: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200",
  },
  published: {
    label: "Publicado",
    icon: CheckCircle,
    className: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
  },
};

export function StatusBadge({
  status,
  label,
  icon: customIcon,
  variant = "default",
  size = "md",
  className,
}: StatusBadgeProps) {
  const config = statusConfig[status as keyof typeof statusConfig];
  const Icon = customIcon || config?.icon;
  const displayLabel = label || config?.label || status;

  const sizeClasses = {
    sm: "px-1 py-.5 text-xs",
    md: "px-1.5 py-.5 text-sm",
    lg: "px-2 py-1 text-base",
  };

  return (
    <Badge
      variant={variant}
      className={cn(
        "inline-flex items-center gap-1 font-medium opacity-80",
        sizeClasses[size],
        config?.className,
        className
      )}
    >
      {Icon && <Icon className="w-3 h-3" />}
      {displayLabel}
    </Badge>
  );
}
