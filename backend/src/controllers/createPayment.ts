// CURSOS LAST CHANGE: resolve product from movieId (movies.product_id → products) for checkout
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { movies, orders, products } from "../db/schema.js";
import { stripe } from "../lib/stripe.js";
import { Request, Response } from "express";

export async function createPayment(req: Request, res: Response) {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { productId, movieId } = req.body as {
    productId?: string;
    movieId?: string;
  };

  let resolvedProductId = productId;

  // CURSOS LAST CHANGE: lookup linked product when frontend sends movieId from Buy button
  if (movieId) {
    const movie = await db.query.movies.findFirst({
      where: eq(movies.id, movieId),
    });

    if (!movie) {
      return res.status(404).json({ message: "Movie not found!" });
    }

    if (!movie.productId) {
      return res.status(400).json({
        message: "This movie is not linked to a product yet.",
      });
    }

    resolvedProductId = movie.productId;
  }

  if (!resolvedProductId) {
    return res.status(400).json({
      message: "productId or movieId is required.",
    });
  }

  const product = await db.query.products.findFirst({
    where: eq(products.id, resolvedProductId),
  });

  if (!product) {
    return res.status(404).json({ message: "Product not found!" });
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

  return res.json({
    clientSecret: paymentIntent.client_secret,
  });
}
