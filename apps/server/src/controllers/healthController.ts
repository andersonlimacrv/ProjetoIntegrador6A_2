import { Context } from "hono";
import { checkDatabaseHealth } from "../db/init";
import { Config } from "../config";
import { ApiResponse } from "@shared";

/**
 * Health check do servidor
 */
export async function healthCheck(c: Context) {
  const dbHealth = await checkDatabaseHealth();

  return c.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: Config.NODE_ENV,
    database: dbHealth,
    version: "1.0.0",
  });
}
