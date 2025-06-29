import { Context, Next } from "hono";
import { handleError } from "../utils/errors";
import { Config } from "../config";

/**
 * Middleware global para tratamento de erros
 */
export const errorHandler = async (c: Context, next: Next) => {
  try {
    await next();
  } catch (error) {
    console.error("Erro capturado pelo middleware:", error);

    const errorResponse = handleError(error);

    return c.json(errorResponse, 500);
  }
};

/**
 * Middleware para logging de requisições
 */
export const requestLogger = async (c: Context, next: Next) => {
  const start = Date.now();
  const method = c.req.method;
  const url = c.req.url;

  console.log(`[${new Date().toISOString()}] ${method} ${url} - 🚀`);

  await next();

  const duration = Date.now() - start;
  const status = c.res.status;

  console.log(
    `[${new Date().toISOString()}] ${method} ${url} - ${status} (${duration}ms)`
  );
};

/**
 * Middleware para adicionar headers de segurança
 */
export const securityHeaders = async (c: Context, next: Next) => {
  await next();

  // Headers de segurança adicionais
  c.header("X-Content-Type-Options", "nosniff");
  c.header("X-Frame-Options", "DENY");
  c.header("X-XSS-Protection", "1; mode=block");
  c.header("Referrer-Policy", "strict-origin-when-cross-origin");

  if (Config.isProduction()) {
    c.header(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
  }
};
