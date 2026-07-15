import { db } from "../db/index.js";
import { movies, orders } from "../db/schema.js";
import { eq } from "drizzle-orm";

export async function orderHistoryService({ userId }: { userId: string }) {
  const ordersList = await db
    .select({
      id: orders.id,
      productId: orders.productId,
      orderName: orders.orderName,
      amount: orders.amount,
      currency: orders.currency,
      status: orders.status,
      createdAt: orders.createdAt,
      paidAt: orders.paidAt,
      invoiceUrl: orders.invoiceUrl,
      movie: {
        posterUrl: movies.posterUrl,
        year: movies.year,
        genre: movies.genre,
        director: movies.director,
      },
    })
    .from(orders)
    .leftJoin(movies, eq(orders.productId, movies.productId))
    .where(eq(orders.userId, userId));

  return {
    ordersList,
  };
}
