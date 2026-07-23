// CURSOS LAST CHANGE: seed script — creates Stripe product/price per movie and sets movies.product_id
import "dotenv/config";
import { isNull } from "drizzle-orm";
import { db } from "../src/db/index.js";
import { movies } from "../src/db/schema.js";
import { linkMovieToProduct } from "../src/services/link-movie-to-product-service.js";

const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
const limit = limitArg ? Number(limitArg.split("=")[1]) : undefined;

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
