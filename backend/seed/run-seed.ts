import "dotenv/config";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const sql = readFileSync(join(__dirname, "movies.sql"), "utf8");
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

  try {
    await pool.query(sql);
    const { rows } = await pool.query<{ count: string }>(
      "SELECT COUNT(*)::text AS count FROM movies",
    );
    console.log(`Seeded movies. Total in database: ${rows[0]?.count ?? "0"}`);
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
