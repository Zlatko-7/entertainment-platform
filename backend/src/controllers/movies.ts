import { Request, Response } from "express";
import { db } from "../db/index.js";
import { movies } from "../db/schema.js";

export async function getMovies(req: Request, res: Response) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const offset = (page - 1) * limit;

    const moviesList = await db
      .select()
      .from(movies)
      .limit(limit)
      .offset(offset);

    const totalResult = await db.select().from(movies);
    const total = totalResult.length;

    return res.json({
      data: moviesList,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
