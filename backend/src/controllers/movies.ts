import { Request, Response } from "express";
import { and, count, desc, gte, ilike, lt, or, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { movies } from "../db/schema.js";

function buildMovieConditions(search: string, filter: string) {
  const conditions = [];

  if (search) {
    const pattern = `%${search}%`;
    conditions.push(
      or(
        ilike(movies.title, pattern),
        ilike(movies.director, pattern),
        ilike(movies.genre, pattern),
        sql`array_to_string(${movies.actors}, ',') ILIKE ${pattern}`,
      ),
    );
  }

  if (filter === "popular") {
    conditions.push(gte(movies.rating, 8));
  } else if (filter === "new") {
    conditions.push(gte(movies.year, new Date().getFullYear() - 1));
  } else if (filter === "budget") {
    conditions.push(lt(movies.price, 10));
  }

  return conditions.length > 0 ? and(...conditions) : undefined;
}

export async function getMovies(req: Request, res: Response) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";
    const filter =
      typeof req.query.filter === "string" ? req.query.filter : "all";

    const offset = (page - 1) * limit;
    const whereClause = buildMovieConditions(search, filter);

    const [moviesList, totalResult] = await Promise.all([
      db
        .select()
        .from(movies)
        .where(whereClause)
        .orderBy(desc(movies.rating), desc(movies.year))
        .limit(limit)
        .offset(offset),
      db.select({ count: count() }).from(movies).where(whereClause),
    ]);

    const total = Number(totalResult[0]?.count ?? 0);

    return res.json({
      data: moviesList,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
