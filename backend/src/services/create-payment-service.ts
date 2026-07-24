import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { movies, products, orders } from "../db/schema.js";
import { stripe } from "../lib/stripe.js";
import { AppError } from "../errors/app-error.js";

export async function createPaymentService({
  productId,
  userId,
  movieId,
  userEmail,
}: {
  userId: string;
  productId?: string;
  movieId?: string;
  userEmail: string;
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

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: userEmail,
    line_items: [
      {
        price: product.stripePriceId,
        quantity: 1,
      },
    ],

    invoice_creation: {
      enabled: true,
      invoice_data: {
        metadata: {
          userId,
          productId: resolvedProductId,
          movieId: movieId ?? "",
        },
      },
    },
    success_url: `${process.env.FRONTEND_URL}/success`,
    cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    metadata: {
      userId,
      productId: resolvedProductId,
      movieId: movieId ?? "",
    },
  });

  await db.insert(orders).values({
    userId,
    productId: resolvedProductId,
    stripeCheckoutSessionId: session.id,
    amount: product.price,
    currency: product.currency,
    status: "pending",
    orderName: product.name,
  });

  return {
    url: session.url,
  };
}
