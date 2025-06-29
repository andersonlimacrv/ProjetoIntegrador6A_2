/**
 * Utilitários compartilhados entre frontend e backend
 */

/**
 * Formata uma data para exibição
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) {
    return "Data não disponível";
  }

  let d: Date;

  // Se já é um objeto Date
  if (date instanceof Date) {
    d = date;
  } else {
    // Se é string, tenta converter
    d = new Date(date);
  }

  // Verifica se a data é válida
  if (isNaN(d.getTime())) {
    console.warn("Data inválida recebida:", date, "tipo:", typeof date);
    return "Data inválida";
  }

  try {
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Erro ao formatar data:", error, "data:", date);
    return "Erro na formatação";
  }
}

/**
 * Converte uma data para objeto Date válido
 */
export function parseDate(date: any): Date | null {
  if (!date) {
    return null;
  }

  if (date instanceof Date) {
    return date;
  }

  if (typeof date === "string") {
    const parsed = new Date(date);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
}

/**
 * Valida se um email é válido
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Capitaliza a primeira letra de uma string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Gera um ID único
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}
