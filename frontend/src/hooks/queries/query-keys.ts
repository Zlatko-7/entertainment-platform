import type { MoviesParams } from "@/api/movies";

export const queryKeys = {
  me: ["me"] as const,
  movies: (params: MoviesParams) => ["movies", params] as const,
  purchasedItems: ["purchased-items"] as const,
  orderHistory: ["order-history"] as const,
};
