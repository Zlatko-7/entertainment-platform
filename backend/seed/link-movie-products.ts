// CURSOS LAST CHANGE: seed script — creates Stripe product/price per movie and sets movies.product_id
import "dotenv/config";
import { eq, isNull } from "drizzle-orm";
import { db } from "../src/db/index.js";
import { movies, products } from "../src/db/schema.js";
import { stripe } from "../src/lib/stripe.js";

const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
const limit = limitArg ? Number(limitArg.split("=")[1]) : undefined;

async function linkMovieToProduct(movie: (typeof movies.$inferSelect)) {
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

async function main() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }

  let unlinked = await db
    .select()
    .from(movies)
    .where(isNull(movies.productId));

  if (limit && limit > 0) {
    unlinked = unlinked.slice(0, limit);
  }

  if (unlinked.length === 0) {
    console.log("All movies already have a linked product.");
    return;
  }

  console.log(`Linking ${unlinked.length} movie(s) to Stripe products...`);

  let linked = 0;
  for (const movie of unlinked) {
    const product = await linkMovieToProduct(movie);
    linked += 1;
    console.log(`  ${linked}/${unlinked.length}: ${movie.title} → ${product.id}`);
  }

  console.log(`Done. Linked ${linked} movie(s).`);
}

main().catch((error) => {
  console.error("Link movie products failed:", error);
  process.exit(1);
});
