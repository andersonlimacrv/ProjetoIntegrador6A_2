import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/theme-context";
import { Loader2 } from "lucide-react";

export function SkeletonDashboard() {
  const { theme } = useTheme();

  return (
    <div
      className={cn(
        "relative min-h-screen flex bg-background text-foreground transition-colors",
        theme === "dark" ? "bg-[#0c0c0e]" : "bg-[#f4f4f5]"
      )}
    >
      {/* Sidebar */}
      <aside className="w-64 p-4 border-r border-muted flex flex-col gap-4 z-0">
        <div className="h-10 w-32 bg-muted rounded animate-pulse" />
        <div className="h-6 w-full bg-muted rounded animate-pulse" />
        <div className="h-6 w-3/4 bg-muted rounded animate-pulse" />
        <div className="h-6 w-5/6 bg-muted rounded animate-pulse" />
        <div className="h-6 w-2/3 bg-muted rounded animate-pulse" />
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 space-y-6 z-0">
        <div className="h-8 w-1/3 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      </main>
    </div>
  );
}

export function LoadingPage() {
  const { theme } = useTheme();

  return (
    <div className="relative">
      <SkeletonDashboard />
      {/* Overlay com blur e loader */}
      <div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md transition-colors duration-300",
          theme === "dark" ? "bg-black/80" : "bg-white/80"
        )}
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Carregando...</p>
        </div>
      </div>
    </div>
  );
}
