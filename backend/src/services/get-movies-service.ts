import { count, desc, ilike, or } from "drizzle-orm";
import { db } from "../db/index.js";
import { movies } from "../db/schema.js";

export async function getMoives({
  page,
  limit,
  search,
}: {
  page: number;
  limit: number;
  search: string;
}) {
  const offset = (page - 1) * limit;
  const searchCondition = search
    ? or(
        ilike(movies.title, `%${search}%`),
        ilike(movies.director, `%${search}%`)
      )
    : undefined;

  const moviesList = await db
    .select()
    .from(movies)
    .where(searchCondition)
    .orderBy(desc(movies.rating))
    .limit(limit)
    .offset(offset);

  const totalResult = await db
    .select({ count: count() })
    .from(movies)
    .where(searchCondition);

  const total = Number(totalResult[0]?.count ?? 0);

  return {
    data: moviesList,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
