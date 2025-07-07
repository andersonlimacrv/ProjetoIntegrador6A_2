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
// Os demais tipos (sprint, status, comment, activity, session, etc) devem ser exportados apenas de seus arquivos exclusivos, se existirem, e não duplicados.
export * from "./utils";
