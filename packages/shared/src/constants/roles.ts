// Roles default globais para times e projetos
export const DEFAULT_ROLES = [
  {
    name: "leader",
    displayName: "Leader",
    description: "Team leader with full permissions.",
    isSystemRole: true,
  },
  {
    name: "admin",
    displayName: "Admin",
    description: "Administrator with management permissions.",
    isSystemRole: true,
  },
  {
    name: "member",
    displayName: "Member",
    description: "Regular team member.",
    isSystemRole: true,
  },
  {
    name: "viewer",
    displayName: "Viewer",
    description: "Can only view information.",
    isSystemRole: true,
  },
];
