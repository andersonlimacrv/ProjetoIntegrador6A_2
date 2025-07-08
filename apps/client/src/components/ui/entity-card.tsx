import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface EntityCardProps {
  title: string;
  description?: string;
  status?: ReactNode;
  children?: ReactNode;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  viewLabel?: string;
  editLabel?: string;
  deleteLabel?: string;
  showActions?: boolean;
  className?: string;
}

export function EntityCard({
  title,
  description,
  status,
  children,
  onView,
  onEdit,
  onDelete,
  viewLabel = "Ver",
  editLabel = "Editar",
  deleteLabel = "Deletar",
  showActions = true,
  className = "",
}: EntityCardProps) {
  return (
    <Card
      className={`hover:shadow-md hover:border-accent transition-all duration-300 ${className}`}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          {status}
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {children}

        {showActions && (
          <div className="flex justify-center items-center gap-2 mt-4">
            {onView && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex-1 w-full flex items-center justify-center">

                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 w-full flex items-center justify-center"
                    onClick={onView}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Ver</TooltipContent>
              </Tooltip>
            )}
            {onEdit && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex-1 w-full flex items-center justify-center">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 w-full flex items-center justify-center"
                      onClick={onEdit}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Editar</TooltipContent>
              </Tooltip>
            )}
            {onDelete && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex-1 w-full flex items-center justify-center">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 w-full flex items-center justify-center"
                    onClick={onDelete}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Deletar</TooltipContent>
              </Tooltip>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
