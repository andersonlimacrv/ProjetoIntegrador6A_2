/**
 * Classe base para erros da aplicação
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Erro para recursos não encontrados
 */
export class NotFoundError extends AppError {
  constructor(message: string = "Recurso não encontrado") {
    super(message, 404);
  }
}

/**
 * Erro para dados inválidos
 */
export class ValidationError extends AppError {
  constructor(message: string = "Dados inválidos") {
    super(message, 400);
  }
}

/**
 * Erro para conflitos (ex: email já existe)
 */
export class ConflictError extends AppError {
  constructor(message: string = "Conflito de dados") {
    super(message, 409);
  }
}

/**
 * Erro para operações não autorizadas
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = "Não autorizado") {
    super(message, 401);
  }
}

/**
 * Erro para operações proibidas
 */
export class ForbiddenError extends AppError {
  constructor(message: string = "Acesso negado") {
    super(message, 403);
  }
}

/**
 * Função para tratar erros e retornar resposta padronizada
 */
export function handleError(error: unknown): {
  success: false;
  error: string;
  message?: string;
} {
  if (error instanceof AppError) {
    return {
      success: false,
      error: error.message,
    };
  }

  if (error instanceof Error) {
    return {
      success: false,
      error: "Erro interno do servidor",
      message:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    };
  }

  return {
    success: false,
    error: "Erro interno do servidor",
  };
}
