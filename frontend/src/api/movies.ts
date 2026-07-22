import { apiUrl, authFetch, parseJsonError } from "@/api/client";
import type { FilterOption, Movie } from "@/types/dashboard";

export interface MoviesParams {
  page: number;
  limit: number;
  search: string;
  filter: FilterOption;
}

export interface MoviesResponse {
  data: Movie[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getMovies(params: MoviesParams): Promise<MoviesResponse> {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });

  if (params.search.trim()) {
    searchParams.set("search", params.search.trim());
  }

  if (params.filter !== "all") {
    searchParams.set("filter", params.filter);
  }

  const res = await authFetch(
    `${apiUrl}/api/get-movies?${searchParams.toString()}`,
    { method: "GET" }
  );

  if (!res.ok) {
    await parseJsonError(res, "Failed to load movies");
  }

  return res.json();
}

export async function createMovie(formData: FormData): Promise<Movie> {
  const res = await authFetch(`${apiUrl}/api/add-movies`, {
    method: "POST",
    body: formData,
  });

  if (res.status === 403) {
    throw new Error("Only admins can add movies");
  }

  if (!res.ok) {
    await parseJsonError(res, "Failed to add movie. Please try again.");
  }

  return res.json();
}
