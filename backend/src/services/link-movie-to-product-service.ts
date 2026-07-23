import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { movies, products } from "../db/schema.js";
import { AppError } from "../errors/app-error.js";
import { stripe } from "../lib/stripe.js";

export async function linkMovieToProduct(
  movie: typeof movies.$inferSelect
): Promise<typeof products.$inferSelect> {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new AppError("STRIPE_SECRET_KEY is not set", 500);
  }

  const amountCents = Math.max(50, Math.round(movie.price * 100));

  const stripeProduct = await stripe.products.create({
    name: movie.title,
    description: `${movie.title} (${movie.year}) — digital movie purchase`,
    metadata: {
      movieId: movie.id,
    },
  });

  const stripePrice = await stripe.prices.create({
    product: stripeProduct.id,
    unit_amount: amountCents,
    currency: "eur",
  });

  const [product] = await db
    .insert(products)
    .values({
      name: movie.title,
      description: movie.synopsis.slice(0, 500),
      stripeProductId: stripeProduct.id,
      stripePriceId: stripePrice.id,
      price: amountCents,
      currency: "eur",
      interval: "one_time",
      active: true,
    })
    .returning();

  await db
    .update(movies)
    .set({ productId: product.id })
    .where(eq(movies.id, movie.id));

  return product;
}
