import UserAvatar from "@/components/common/UserAvatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TEAM_COLORS } from "@/lib/constants";

interface TeamMembersProps {
  members: any[];
}

export default function TeamMembers({ members }: TeamMembersProps) {
  if (!members || members.length === 0) {
    return null;
  }

  // Gerar cores para os times
  const teamColors: Record<string, string> = {};
  const uniqueTeams = new Set<string>();

  members.forEach((member: any) => {
    member.teams.forEach((team: any) => {
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
    <TooltipProvider>
      <div className="flex flex-wrap gap-3">
        {members.map((member: any) => (
          <Tooltip key={member.id}>
            <TooltipTrigger asChild>
              <div className="flex flex-col items-center gap-0.5 cursor-pointer">
                <div className="relative">
                  <UserAvatar
                    name={member.name}
                    avatarUrl={member.avatarUrl || ""}
                    size="md"
                  />
                  {/* Bordas coloridas para cada time */}
                  {member.teams.map((team: any, index: number) => (
                    <div
                      key={team.id}
                      className={`absolute inset-0 rounded-full border-2 ${
                        teamColors[team.id] || "border-gray-300"
                      }`}
                      style={{
                        transform: `rotate(${index * 45}deg)`,
                        zIndex: index + 1,
                      }}
                    />
                  ))}

                  {/* Badge do role no canto superior direito */}
                  {member.teams.length > 0 && (
                    <div className="absolute -top-1 -right-1 z-10">
                      <Badge
                        variant="secondary"
                        className="w-4 h-4 p-0 text-xs font-bold rounded-full flex items-center justify-center bg-white border border-gray-200 text-gray-700 shadow-sm"
                      >
                        {member.teams[0].role.charAt(0).toUpperCase()}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{member.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
