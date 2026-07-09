/// <reference types="node" />

import "dotenv/config";
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in environment");
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./migration",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
