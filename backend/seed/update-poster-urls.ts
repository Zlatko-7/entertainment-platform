import "dotenv/config";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MOVIES_SQL = join(__dirname, "movies.sql");
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

type MovieRow = { title: string; year: number };

function parseMoviesFromSql(sql: string): MovieRow[] {
  const movies: MovieRow[] = [];
  const pattern = /VALUES \('((?:''|[^'])*)', (\d+),/g;

  for (const match of sql.matchAll(pattern)) {
    movies.push({
      title: match[1].replace(/''/g, "'"),
      year: Number(match[2]),
    });
  }

  return movies;
}

function toFullWikiImage(thumbnailUrl: string): string {
  const match = thumbnailUrl.match(
    /^(https:\/\/upload\.wikimedia\.org\/wikipedia\/[^/]+)\/thumb\/(.+\/)(?:\d+px-)?([^/]+)$/,
  );

  if (match) {
    return `${match[1]}/${match[2]}${match[3]}`;
  }

  return thumbnailUrl;
}

const WIKI_TITLE_OVERRIDES: Record<string, string> = {
  "Star Wars: Episode IV - A New Hope": "Star Wars (film)",
  "Star Wars: Episode V - The Empire Strikes Back": "The Empire Strikes Back",
  "Star Wars: Episode VI - Return of the Jedi": "Return of the Jedi",
  "Star Wars: Episode I - The Phantom Menace": "Star Wars: Episode I – The Phantom Menace",
  "Star Wars: Episode II - Attack of the Clones": "Star Wars: Episode II – Attack of the Clones",
  "Star Wars: Episode III - Revenge of the Sith": "Star Wars: Episode III – Revenge of the Sith",
  "Harry Potter and the Sorcerer's Stone": "Harry Potter and the Philosopher's Stone (film)",
  "Raiders of the Lost Ark": "Raiders of the Lost Ark",
  "Terminator 2: Judgment Day": "Terminator 2: Judgment Day",
};

function wikiPageCandidates(title: string, year: number): string[] {
  const override = WIKI_TITLE_OVERRIDES[title];
  const candidates = [
    override,
    `${title} (${year} film)`,
    `${title} (film)`,
    title,
  ].filter((value): value is string => Boolean(value));

  return [...new Set(candidates)];
}

async function fetchJsonWithRetry<T>(url: string, attempt = 0): Promise<T> {
  const response = await fetch(url, {
    headers: { "User-Agent": "teesttt-movie-seed/1.0 (local dev)" },
  });

  if (response.status === 429 && attempt < 5) {
    const waitMs = 2_000 * 2 ** attempt;
    await sleep(waitMs);
    return fetchJsonWithRetry<T>(url, attempt + 1);
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  return response.json() as Promise<T>;
}

async function getPosterFromTmdb(
  apiKey: string,
  title: string,
  year: number,
): Promise<string | null> {
  const params = new URLSearchParams({
    api_key: apiKey,
    query: title,
    year: String(year),
    language: "en-US",
  });

  const data = await fetchJsonWithRetry<{
    results: Array<{ poster_path: string | null; release_date?: string }>;
  }>(`https://api.themoviedb.org/3/search/movie?${params}`);

  const match =
    data.results.find((movie) => movie.release_date?.startsWith(String(year))) ??
    data.results[0];

  if (!match?.poster_path) {
    return null;
  }

  return `${TMDB_IMAGE_BASE}${match.poster_path}`;
}

async function getPosterFromWikipedia(
  title: string,
  year: number,
): Promise<string | null> {
  for (const pageTitle of wikiPageCandidates(title, year)) {
    try {
      const summary = await fetchJsonWithRetry<{ thumbnail?: { source: string } }>(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`,
      );

      if (summary.thumbnail?.source) {
        return toFullWikiImage(summary.thumbnail.source);
      }
    } catch {
      // Try the next candidate title.
    }

    await sleep(400);
  }

  return null;
}

async function resolvePosterUrl(
  title: string,
  year: number,
  tmdbApiKey?: string,
): Promise<string> {
  if (tmdbApiKey) {
    const tmdbPoster = await getPosterFromTmdb(tmdbApiKey, title, year);
    if (tmdbPoster) {
      return tmdbPoster;
    }
  }

  const wikiPoster = await getPosterFromWikipedia(title, year);
  if (wikiPoster) {
    return wikiPoster;
  }

  throw new Error(`No poster found for "${title}" (${year})`);
}

function needsPosterUpdate(line: string): boolean {
  return line.includes("image.tmdb.org");
}

function replacePosterUrlInSql(sql: string, title: string, posterUrl: string): string {
  const escapedTitle = title.replace(/'/g, "''");
  const lines = sql.split("\n");
  let replaced = false;

  const updatedLines = lines.map((line) => {
    if (!line.includes(`'${escapedTitle}'`)) {
      return line;
    }

    const nextLine = line.replace(
      /, '(?:https?:\/\/[^']+)', (\d+\.\d+)\);$/,
      `, '${posterUrl.replace(/'/g, "''")}', $1);`,
    );

    if (nextLine !== line) {
      replaced = true;
      return nextLine;
    }

    return line;
  });

  if (!replaced) {
    throw new Error(`Could not update SQL for "${title}"`);
  }

  return updatedLines.join("\n");
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const tmdbApiKey = process.env.TMDB_API_KEY;
  const source = tmdbApiKey ? "TMDB" : "Wikipedia";
  let sql = readFileSync(MOVIES_SQL, "utf8");
  const movies = parseMoviesFromSql(sql);

  console.log(`Updating ${movies.length} poster URLs via ${source}...`);

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const failures: string[] = [];

  try {
    for (const movie of movies) {
      const sqlLine = sql
        .split("\n")
        .find((line) => line.includes(`'${movie.title.replace(/'/g, "''")}'`));

      if (sqlLine && !needsPosterUpdate(sqlLine)) {
        console.log(`- ${movie.title} (${movie.year}) already updated`);
        continue;
      }

      try {
        const posterUrl = await resolvePosterUrl(movie.title, movie.year, tmdbApiKey);
        sql = replacePosterUrlInSql(sql, movie.title, posterUrl);

        await pool.query(
          "UPDATE movies SET poster_url = $1 WHERE title = $2 AND year = $3",
          [posterUrl, movie.title, movie.year],
        );

        console.log(`✓ ${movie.title} (${movie.year})`);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        failures.push(`${movie.title} (${movie.year}): ${message}`);
        console.warn(`✗ ${movie.title} (${movie.year}) — ${message}`);
      }

      await sleep(1_000);
    }

    writeFileSync(MOVIES_SQL, sql, "utf8");

    const { rows } = await pool.query<{ count: string }>(
      "SELECT COUNT(*)::text AS count FROM movies",
    );

    console.log(`\nDone. Movies in database: ${rows[0]?.count ?? "0"}`);

    if (failures.length > 0) {
      console.warn(`\n${failures.length} movie(s) could not be updated:`);
      for (const failure of failures) {
        console.warn(`  - ${failure}`);
      }
      process.exitCode = 1;
    }
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error("Poster update failed:", error);
  process.exit(1);
});
