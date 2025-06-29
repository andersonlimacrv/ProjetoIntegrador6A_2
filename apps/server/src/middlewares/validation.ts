import { Context, Next } from "hono";
import { z } from "zod";

/**
 * Middleware para validar dados de entrada usando Zod
 */
export const validate = <T extends z.ZodType>(schema: T) => {
  return async (c: Context, next: Next) => {
    try {
      const body = await c.req.json();
      const validatedData = schema.parse(body);

      // Adiciona os dados validados ao contexto
      c.set("validatedData", validatedData);

      await next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return c.json(
          {
            success: false,
            error: "Dados inválidos",
            details: error.errors.map((err) => ({
              field: err.path.join("."),
              message: err.message,
            })),
          },
          400
        );
      }

      return c.json(
        {
          success: false,
          error: "Erro ao processar dados",
        },
        400
      );
    }
  };
};

/**
 * Middleware para validar parâmetros de rota
 */
export const validateParams = <T extends z.ZodType>(schema: T) => {
  return async (c: Context, next: Next) => {
    try {
      const params = c.req.param();
      const validatedParams = schema.parse(params);

      // Adiciona os parâmetros validados ao contexto
      c.set("validatedParams", validatedParams);

      await next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return c.json(
          {
            success: false,
            error: "Parâmetros inválidos",
            details: error.errors.map((err) => ({
              field: err.path.join("."),
              message: err.message,
            })),
          },
          400
        );
      }

      return c.json(
        {
          success: false,
          error: "Erro ao processar parâmetros",
        },
        400
      );
    }
  };
};

/**
 * Middleware para validar query parameters
 */
export const validateQuery = <T extends z.ZodType>(schema: T) => {
  return async (c: Context, next: Next) => {
    try {
      const query = c.req.query();
      const validatedQuery = schema.parse(query);

      // Adiciona os query parameters validados ao contexto
      c.set("validatedQuery", validatedQuery);

      await next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return c.json(
          {
            success: false,
            error: "Query parameters inválidos",
            details: error.errors.map((err) => ({
              field: err.path.join("."),
              message: err.message,
            })),
          },
          400
        );
      }

      return c.json(
        {
          success: false,
          error: "Erro ao processar query parameters",
        },
        400
      );
    }
  };
};
