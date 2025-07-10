import { cn } from "@/lib/utils";

interface PriorityGaugeProps {
  priority: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const priorityConfig = {
  1: { label: "Baixa", color: "bg-green-500" },
  2: { label: "Média", color: "bg-yellow-500" },
  3: { label: "Alta", color: "bg-orange-500" },
  4: { label: "Crítica", color: "bg-red-500" },
  5: { label: "Urgente", color: "bg-purple-500" },
};

const sizeConfig = {
  sm: { h: "h-3", w: "w-6", text: "text-xs" },
  md: { h: "h-4", w: "w-10", text: "text-sm" },
  lg: { h: "h-6", w: "w-16", text: "text-base" },
};

export default function PriorityGauge({
  priority,
  size = "md",
  showLabel = true,
}: PriorityGaugeProps) {
  const sizeStyle = sizeConfig[size];

  return (
    <div className="flex flex-col items-center">
      {/* Números */}
      <div
        className={cn(
          "flex w-full justify-between mb-1",
          size === "sm" ? "px-1" : "px-2"
        )}
      >
        {[1, 2, 3, 4, 5].map((level) => (
          <span
            key={level}
            className={cn(
              "font-medium text-center",
              sizeStyle.text,
              level === priority ? "text-muted size-4 bg-accent rounded-full" : "text-gray-400"
            )}
          >
            {level}
          </span>
        ))}
      </div>
      {/* Barra dosadora */}
      <div className={cn("flex w-full gap-1")}>
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={cn(
              "rounded-full transition-all duration-300 border border-gray-300 flex items-center justify-center",
              sizeStyle.h,
              sizeStyle.w,
              level <= priority
                ? priorityConfig[priority as 1 | 2 | 3 | 4 | 5].color
                : "bg-gray-200"
            )}
          />
        ))}
      </div>
      {showLabel && (
        <span
          className={cn(
            "mt-1 font-medium text-center",
            sizeStyle.text,
            priorityConfig[priority as 1 | 2 | 3 | 4 | 5].color.replace(
              "bg-",
              "text-"
            )
          )}
        >
          {priorityConfig[priority as 1 | 2 | 3 | 4 | 5].label}
        </span>
      )}
    </div>
  );
}
