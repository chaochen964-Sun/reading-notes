import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "netlify/database/migrations",
  schema: "./db/schema.ts",
  dialect: "postgresql",
  // Timestamp prefixes keep newly generated migrations sorting after whatever
  // Netlify has already applied to the database branch.
  migrations: { prefix: "timestamp" },
});
