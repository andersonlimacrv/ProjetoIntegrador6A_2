// Utils
export const greet = (name: string) => `Hello, ${name}!`;

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const generateId = (): number => {
  return Math.floor(Math.random() * 1000000);
};

// Exportar todos os tipos do diagrama ER separados por entidade
export * from "./types/tenant";
export * from "./types/user";
export * from "./types/project";
export * from "./types/epic";
export * from "./types/userStory";
export * from "./types/task";
export * from "./types/sprint";
export * from "./types/status";
export * from "./types/comment";
export * from "./types/activity";
export * from "./types/session";
export * from "./utils";
