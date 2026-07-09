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

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

  try {
    const { rows } = await pool.query<{ exists: boolean }>(`
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'movies' AND column_name = 'price'
      ) AS exists
    `);

    if (!rows[0]?.exists) {
      const migrationSql = readFileSync(
        join(__dirname, "../migration/0002_add_movie_price.sql"),
        "utf8",
      );

      const statements = migrationSql
        .split("--> statement-breakpoint")
        .map((statement) => statement.trim())
        .filter(Boolean);

      for (const statement of statements) {
        await pool.query(statement);
      }

      console.log("Added price column and set random prices on existing movies.");
    } else {
      await pool.query(`
        UPDATE movies
        SET price = round((1 + random() * 24)::numeric, 2)
      `);
      console.log("Price column already exists. Updated all movie prices.");
    }

    const count = await pool.query<{ count: string }>(
      "SELECT COUNT(*)::text AS count FROM movies",
    );
    console.log(`Movies in database: ${count.rows[0]?.count ?? "0"}`);
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error("Price migration failed:", error);
  process.exit(1);
});
