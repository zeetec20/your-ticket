import { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema",
  out: "./src/db/migrations",
  driver: "pg",
  dbCredentials: process.env.DATABASE_URL!,
} as Config;
