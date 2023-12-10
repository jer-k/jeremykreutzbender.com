import type { Config } from "drizzle-kit";
import "dotenv/config";

export default {
  schema: "./db/schema/*",
  out: "./db/migrations",
  driver: "mysql2",
  dbCredentials: {
    host: process.env.DATABASE_HOST!,
    user: process.env.DATABASE_USERNAME!,
    password: process.env.DATABASE_PASSWORD!,
    database: process.env.DATABASE_NAME!,
  },
  breakpoints: true,
} satisfies Config;
