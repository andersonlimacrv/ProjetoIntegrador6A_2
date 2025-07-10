import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TEAM_COLORS, TEAM_COLORS_HEX } from "@/lib/constants";

interface TeamLegendProps {
  members: any[];
  direction?: "horizontal" | "vertical";
}

export default function TeamLegend({
  members,
  direction = "horizontal",
}: TeamLegendProps) {
  if (!members || members.length === 0) {
    return null;
  }

  // Gerar cores para os times
  const teamColors: Record<string, string> = {};
  const uniqueTeams = new Set<string>();

  members.forEach((member: any) => {
    (member.teams || []).forEach((team: any) => {
      if (team.id) {
        uniqueTeams.add(team.id);
      }
    });
  });

  const teamIds = Array.from(uniqueTeams).filter(Boolean) as string[];

  teamIds.forEach((teamId, index) => {
    teamColors[teamId] = TEAM_COLORS[index % TEAM_COLORS.length];
  });

  return (
    <div
      className={cn(
        "flex flex-wrap gap-1 items-center",
        direction === "vertical"
          ? "flex-col mb-2 gap-y-1 gap-x-0"
          : "flex-row mb-4 gap-x-2 gap-y-1"
      )}
    >
      {Object.entries(teamColors).map(([teamId, colorClass], index) => {
        const team = members
          .flatMap((member: any) => member.teams || [])
          .find((team: any) => team.id === teamId);

        const backgroundColor = TEAM_COLORS_HEX[colorClass] || "#6b7280";

        return team ? (
          <Badge
            key={teamId}
            variant="outline"
            className="text-[10px] md:text-xs font-medium flex items-center gap-1 w-fit px-2 py-1 min-w-[60px] max-w-full truncate"
            style={{ maxWidth: "100%" }}
          >
            <div
              className="w-2 h-2 -ml-1! rounded-full"
              style={{ backgroundColor }}
            />
            <span className="truncate">{team.name}</span>
          </Badge>
        ) : null;
      })}
    </div>
  );
}
