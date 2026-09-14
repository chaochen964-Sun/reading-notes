import { drizzle } from "drizzle-orm/netlify-db";
import * as schema from "./schema";

// The Netlify Database connection is configured by the platform; no connection string needed.
export const db = drizzle({ schema });
