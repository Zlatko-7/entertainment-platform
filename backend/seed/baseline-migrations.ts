import "dotenv/config";
import crypto from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationDir = join(__dirname, "../migration");

// CURSOR MIGRATION: mark already-applied migrations in drizzle journal (no SQL run, no data deleted)
async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const journal = JSON.parse(
    readFileSync(join(migrationDir, "meta/_journal.json"), "utf8"),
  ) as {
    entries: Array<{ tag: string; when: number }>;
  };

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

  try {
    await pool.query(`CREATE SCHEMA IF NOT EXISTS drizzle`);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (
        id SERIAL PRIMARY KEY,
        hash text NOT NULL,
        created_at bigint
      )
    `);

    const { rows } = await pool.query<{ hash: string }>(
      `SELECT hash FROM drizzle.__drizzle_migrations`,
    );
    const applied = new Set(rows.map((row) => row.hash));

    // CURSOR MIGRATION: baseline everything except the latest Stripe migration
    const tagsToBaseline = journal.entries
      .map((entry) => entry.tag)
      .filter((tag) => tag !== "0003_thankful_flatman");

    for (const tag of tagsToBaseline) {
      const sql = readFileSync(join(migrationDir, `${tag}.sql`), "utf8");
      const hash = crypto.createHash("sha256").update(sql).digest("hex");
      const entry = journal.entries.find((item) => item.tag === tag);

      if (applied.has(hash)) {
        console.log(`Already baselined: ${tag}`);
        continue;
      }

      await pool.query(
        `INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES ($1, $2)`,
        [hash, entry?.when ?? Date.now()],
      );
      console.log(`Baselined: ${tag}`);
    }

    console.log("Done. Run: npm run db:migrate");
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error("Baseline failed:", error);
  process.exit(1);
});
