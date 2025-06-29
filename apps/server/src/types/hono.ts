import { Context } from "hono";
import { CreateUserInput, UpdateUserInput, UserIdInput } from "../models/User";

/**
 * Extensão do contexto do Hono com dados validados
 */
export interface AppContext extends Context {
  get(key: "validatedData"): CreateUserInput | UpdateUserInput;
  get(key: "validatedParams"): UserIdInput;
  get(key: "validatedQuery"): any;
  get(key: string): any;
}

/**
 * Tipos para middlewares personalizados
 */
export type AppMiddleware = (
  c: AppContext,
  next: () => Promise<void>
) => Promise<void>;
