import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { movies, products, orders } from "../db/schema.js";
import { stripe } from "../lib/stripe.js";
import { AppError } from "../errors/app-error.js";

export async function createPaymentService({
  productId,
  userId,
  movieId,
}: {
  userId: string;
  productId?: string;
  movieId?: string;
}) {
  let resolvedProductId = productId;

  if (movieId) {
    const movie = await db.query.movies.findFirst({
      where: eq(movies.id, movieId),
    });

    if (!movie) {
      throw new AppError("Movie not found", 404);
    }

    if (!movie.productId) {
      throw new AppError("This movie is not linked to a product yet", 400);
    }

    resolvedProductId = movie.productId;
  }

  if (!resolvedProductId) {
    throw new AppError("productId or movieId is required", 400);
  }

  const product = await db.query.products.findFirst({
    where: eq(products.id, resolvedProductId),
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: product.price,
    currency: product.currency || "eur",
    metadata: {
      userId,
      productId: resolvedProductId,
      movieId: movieId ?? "",
    },
  });

  await db.insert(orders).values({
    userId,
    productId: resolvedProductId,
    stripePaymentIntentId: paymentIntent.id,
    amount: product.price,
    currency: product.currency,
    status: "pending",
    orderName: product.name,
  });

  return {
    clientSecret: paymentIntent.client_secret,
  };
}
