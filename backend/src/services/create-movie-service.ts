import { db } from "../db/index.js";
import { movies } from "../db/schema.js";
import { linkMovieToProduct } from "./link-movie-to-product-service.js";

export async function createMovieService({
  title,
  year,
  director,
  rating,
  genre,
  actors,
  synopsis,
  posterUrl,
  price,
  createdBy,
}: {
  title: string;
  year: number;
  director: string;
  rating: number;
  genre: string;
  actors: string[];
  synopsis: string;
  posterUrl: string;
  price: number;
  createdBy: string;
}) {
  const [movie] = await db
    .insert(movies)
    .values({
      title,
      year,
      director,
      rating,
      genre,
      actors,
      synopsis,
      posterUrl,
      price,
      createdBy,
    })
    .returning();

  const product = await linkMovieToProduct(movie);

  return {
    ...movie,
    productId: product.id,
  };
}
