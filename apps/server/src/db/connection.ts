import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { Config } from "../config";

const client = postgres(Config.DATABASE_URL, {
  ssl: Config.isProduction() ? "require" : "prefer",
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });

export default db;
